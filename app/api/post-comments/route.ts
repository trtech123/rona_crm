import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
// No longer need URLSearchParams
// import { URLSearchParams } from 'url';

// Initialize Supabase client using Service Role Key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// NOTE: API Key environment variable and check removed as requested.

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "API Route Error (post-comments): Supabase URL or Service Role Key missing."
  );
}

// Create client only if config is present
const supabase =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

// Define the structure for the nested "from" object
interface CommentFrom {
  name: string;
  id: string; // Platform-specific user ID
}

// Define the structure for a single comment coming in the payload
interface InputComment {
  id: string; // Platform-specific comment ID
  from: CommentFrom;
  message: string;
}

interface CommentWebhookPayload {
  platform_post_id: string;
  comments: InputComment[]; // Array of the updated comment objects
}

/**
 * Public API endpoint for Make.com (or other services) to send post comments.
 * NOTE: This endpoint is publicly accessible.
 * Finds the internal post ID based on platform_post_id and inserts comments.
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log(
    `[${new Date(
      startTime
    ).toISOString()}] Public Post Comments API: Received POST request.`
  );

  // --- Supabase Client Check ---
  if (!supabase) {
    console.error(
      `[${new Date().toISOString()}] Public Post Comments API: Error - Supabase client not initialized.`
    );
    return NextResponse.json(
      {
        success: false,
        message: "Server configuration error: Supabase client not initialized.",
      },
      { status: 500 }
    );
  }

  let payload: CommentWebhookPayload | null = null;
  let rawBody = "";
  let cleanedBody = ""; // Variable for the cleaned body

  try {
    rawBody = await request.text(); // Read body as raw text first
    console.log(
      `[${new Date().toISOString()}] Public Post Comments API: Received Raw Body:`,
      rawBody
    );

    // --- Attempt to Clean and Parse Body ---
    try {
      cleanedBody = rawBody.trim(); // Remove leading/trailing whitespace

      // Fix 1: Remove leading comma if present
      if (cleanedBody.startsWith("{,")) {
        console.warn(
          `[${new Date().toISOString()}] Public Post Comments API: Found leading comma. Attempting to fix.`
        );
        cleanedBody = "{" + cleanedBody.substring(2); // Remove the comma
      }

      // Fix 2: Replace incorrect comma after "comment_id" with a colon
      // Be careful: this assumes "comment_id" is always followed by a comma and a space before its value
      const incorrectCommentIdSeparator = '"comment_id", ';
      const correctCommentIdSeparator = '"comment_id": ';
      if (cleanedBody.includes(incorrectCommentIdSeparator)) {
        console.warn(
          `[${new Date().toISOString()}] Public Post Comments API: Found incorrect separator for comment_id. Attempting to fix.`
        );
        cleanedBody = cleanedBody.replace(
          incorrectCommentIdSeparator,
          correctCommentIdSeparator
        );
      } else {
        console.warn(
          `[${new Date().toISOString()}] Public Post Comments API: Did not find expected incorrect separator "${incorrectCommentIdSeparator}". Check raw body if parsing fails.`
        );
      }

      console.log(
        `[${new Date().toISOString()}] Public Post Comments API: Attempting to parse Cleaned Body:`,
        cleanedBody
      );
      payload = JSON.parse(cleanedBody) as CommentWebhookPayload;
      console.log(
        `[${new Date().toISOString()}] Public Post Comments API: Successfully parsed cleaned body as JSON.`
      );
    } catch (parseError) {
      console.error(
        `[${new Date().toISOString()}] Public Post Comments API: Failed to parse cleaned body as JSON. Error: ${
          parseError instanceof Error ? parseError.message : parseError
        }`
      );
      // No fallback to form data needed now
      throw parseError instanceof Error
        ? parseError
        : new Error("Failed to parse cleaned request body.");
    }

    // --- Check if payload was successfully parsed ---
    if (!payload) {
      // Should not happen if parse succeeded, but good safety check
      throw new Error("Payload is null after parsing attempt.");
    }

    // --- Payload Validation (use the extracted payload) ---
    const { platform_post_id, comments } = payload;

    if (
      !platform_post_id ||
      !comments ||
      !Array.isArray(comments) ||
      comments.length === 0 ||
      !comments.every(
        (c) =>
          c &&
          typeof c.id === "string" &&
          c.from &&
          typeof c.from.name === "string" &&
          // typeof c.from.id === 'string' && // Not strictly needed
          typeof c.message === "string"
      )
    ) {
      console.warn(
        `[${new Date().toISOString()}] Public Post Comments API: Invalid payload structure received.`,
        JSON.stringify(payload, null, 2)
      );
      return NextResponse.json(
        { success: false, message: "Invalid payload structure after parsing." },
        { status: 400 }
      );
    }

    // --- Find Internal Post ID and User ID ---
    console.log(
      `[${new Date().toISOString()}] Public Post Comments API: Searching for internal post details matching platform_post_id: ${platform_post_id}`
    );
    const { data: postData, error: postFetchError } = await supabase
      .from("posts")
      .select("id, user_id") // <<< Select internal UUID AND user_id
      .eq("post_id", platform_post_id) // Match using the platform's post ID
      .maybeSingle(); // Use maybeSingle as it might not exist

    if (postFetchError) {
      console.error(
        `[${new Date().toISOString()}] Public Post Comments API: Error fetching post by platform_post_id ${platform_post_id}:`,
        postFetchError
      );
      throw postFetchError;
    }

    if (!postData || !postData.id || !postData.user_id) {
      console.warn(
        `[${new Date().toISOString()}] Public Post Comments API: Post or post user_id not found for platform_post_id: ${platform_post_id}. Cannot add comments or leads.`
      );
      return NextResponse.json(
        {
          success: false,
          message: `Post or required post data not found for platform_post_id: ${platform_post_id}`,
        },
        { status: 404 } // Not Found
      );
    }

    const internalPostId = postData.id;
    const postOwnerUserId = postData.user_id;
    console.log(
      `[${new Date().toISOString()}] Public Post Comments API: Found internal post ID: ${internalPostId} and User ID: ${postOwnerUserId} for platform_post_id: ${platform_post_id}`
    );

    // --- Process Each Comment: Upsert Comment & Potentially Create Lead ---
    let processedCommentCount = 0;
    let createdLeadCount = 0;
    const processingErrors: string[] = [];

    for (const comment of comments) {
      const lead_name = comment.from.name;
      // Determine source from comment if possible, otherwise default or extract from payload
      const source = (comment as any).source || "facebook"; // Assuming default or needs extraction elsewhere
      const external_comment_id = comment.id;
      const comment_content = comment.message;

      if (!lead_name || !source || !external_comment_id || !comment_content) {
        console.warn(
          `[${new Date().toISOString()}] Skipping comment due to missing data:`,
          comment
        );
        processingErrors.push(
          `Skipped comment ${external_comment_id}: Missing data.`
        );
        continue; // Skip this comment
      }

      // 1. Check for existing lead
      let leadExists = false;
      try {
        const { data: existingLead, error: leadCheckError } = await supabase
          .from("leads")
          .select("id")
          .eq("name", lead_name)
          .eq("source", source)
          .limit(1)
          .maybeSingle();

        if (leadCheckError) {
          console.error(
            `[${new Date().toISOString()}] Error checking for existing lead (${lead_name}/${source}):`,
            leadCheckError
          );
          processingErrors.push(
            `Lead check error for ${lead_name}: ${leadCheckError.message}`
          );
          // Decide whether to continue or skip - let's continue for now but log error
        }
        if (existingLead) {
          leadExists = true;
          console.log(
            `[${new Date().toISOString()}] Lead already exists for ${lead_name} from ${source}. Skipping lead creation.`
          );
        }
      } catch (err) {
        console.error(
          `[${new Date().toISOString()}] Exception during lead check for (${lead_name}/${source}):`,
          err
        );
        processingErrors.push(`Lead check exception for ${lead_name}`);
      }

      // 2. Insert lead if it doesn't exist
      if (!leadExists) {
        try {
          const newLead = {
            name: lead_name,
            user_id: postOwnerUserId,
            source: source,
            status: "new",
            email: null,
          };
          console.log(
            `[${new Date().toISOString()}] Attempting to insert new lead:`,
            newLead
          );
          const { error: leadInsertError } = await supabase
            .from("leads")
            .insert(newLead);

          if (leadInsertError) {
            console.error(
              `[${new Date().toISOString()}] Error inserting lead for ${lead_name} from ${source}:`,
              leadInsertError
            );
            processingErrors.push(
              `Lead insert error for ${lead_name}: ${leadInsertError.message}`
            );
            // Continue processing the comment even if lead insertion fails
          } else {
            createdLeadCount++;
            console.log(
              `[${new Date().toISOString()}] Successfully inserted lead for ${lead_name} from ${source}.`
            );
          }
        } catch (err) {
          console.error(
            `[${new Date().toISOString()}] Exception during lead insert for (${lead_name}/${source}):`,
            err
          );
          processingErrors.push(`Lead insert exception for ${lead_name}`);
        }
      }

      // 3. Upsert the comment
      try {
        const commentToUpsert = {
          post_id: internalPostId,
          content: comment_content,
          lead_name: lead_name,
          external_id: external_comment_id,
          source: source,
          user_id: postOwnerUserId, // Also store the post owner user_id with the comment
        };
        console.log(
          `[${new Date().toISOString()}] Attempting to upsert comment:`,
          commentToUpsert
        );
        const { error: upsertError } = await supabase
          .from("comments")
          .upsert(commentToUpsert, { onConflict: "external_id" });

        if (upsertError) {
          console.error(
            `[${new Date().toISOString()}] Error upserting comment ${external_comment_id} for post ${internalPostId}:`,
            upsertError
          );
          processingErrors.push(
            `Comment upsert error for ${external_comment_id}: ${upsertError.message}`
          );
          // Skip counting this as processed if upsert fails
        } else {
          processedCommentCount++;
          console.log(
            `[${new Date().toISOString()}] Successfully upserted comment ${external_comment_id} for post ${internalPostId}.`
          );
        }
      } catch (err) {
        console.error(
          `[${new Date().toISOString()}] Exception during comment upsert for ${external_comment_id}:`,
          err
        );
        processingErrors.push(
          `Comment upsert exception for ${external_comment_id}`
        );
      }
    } // End loop through comments

    // --- Success Response ---
    const duration = Date.now() - startTime;
    const message = `Processed ${processedCommentCount}/${
      comments.length
    } comments. Created ${createdLeadCount} new leads. Completed in ${duration}ms.${
      processingErrors.length > 0
        ? ` Errors: [${processingErrors.join(", ")}]`
        : ""
    }`;
    console.log(
      `[${new Date().toISOString()}] Public Post Comments API: ${message}`
    );

    // Return success even if some non-critical errors occurred during processing
    return NextResponse.json({
      success: true,
      message: message,
      errors: processingErrors,
    });
  } catch (error) {
    const errorDuration = Date.now() - startTime;
    console.error(
      `[${new Date().toISOString()}] --- Public Post Comments API: ERROR after ${errorDuration}ms ---`
    );
    console.error("Original Raw Body that caused error:", rawBody); // Log original raw body
    console.error("Cleaned Body before error (if applicable):", cleanedBody); // Log cleaned body
    console.error("Caught Error Object:", error);
    if (error instanceof Error) {
      console.error("Error Name:", error.name);
      console.error("Error Message:", error.message);
      if (error.stack) {
        console.error("Error Stack:", error.stack);
      }
    }
    try {
      console.error("Error Stringified:", JSON.stringify(error, null, 2));
    } catch (stringifyError) {
      console.error("Could not stringify the error object.");
    }
    console.error("--- END ERROR --- ");

    return NextResponse.json(
      {
        success: false,
        message: "Error processing comments webhook",
        error:
          error instanceof Error ? error.message : "Unknown processing error",
      },
      { status: 500 }
    );
  }
}
