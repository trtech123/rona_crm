import { NextRequest, NextResponse } from 'next/server';
import { saveCommentFromMakeAction } from '@/app/actions/commentActions';

/**
 * API endpoint to receive webhook data from Make.com
 * This endpoint will log the received data to the console
 * and save comments to the database
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the JSON data from the request body
    const data = await request.json();
    
    // Log the entire payload to the console
    console.log('Received webhook data from Make.com:', JSON.stringify(data, null, 2));
    
    // Extract and log specific fields
    if (data.comments) {
      console.log('Comments from Make.com:', data.comments);
      
      // If we have a post_id and comments, save them to the database
      if (data.post_id && typeof data.comments === 'string') {
        const result = await saveCommentFromMakeAction(
          data.post_id,
          data.comments,
          'make',
          { original_data: data }
        );
        
        if (!result.success) {
          console.error('Failed to save comment from Make.com:', result.message);
        } else {
          console.log('Comment saved successfully:', result.comment?.id);
        }
      }
    }
    
    if (data.post_id) {
      console.log('Post ID:', data.post_id);
    }
    
    if (data.content) {
      console.log('Content:', data.content);
    }
    
    // Return a success response
    return NextResponse.json({ 
      success: true, 
      message: 'Webhook data received successfully' 
    });
  } catch (error) {
    // Log any errors that occur
    console.error('Error processing webhook data:', error);
    
    // Return an error response
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error processing webhook data',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Handle GET requests to the webhook endpoint
 * This can be useful for testing or verification
 */
export async function GET() {
  return NextResponse.json({ 
    status: 'Webhook endpoint is active',
    message: 'Send POST requests to this endpoint with your data'
  });
} 