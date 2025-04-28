# Make.com Integration for Facebook Publishing

This document explains how to set up the Make.com (formerly Integromat) integration to publish articles to Facebook.

## Setup Instructions

### 1. Create a Make.com Account

1. Sign up for a Make.com account at [https://www.make.com/](https://www.make.com/)
2. Create a new scenario

### 2. Configure the Webhook

1. Add a "Webhook" module as the trigger
2. Select "Custom webhook"
3. Configure the webhook to accept JSON data
4. Copy the webhook URL provided by Make.com

### 3. Add Facebook Module

1. Add a "Facebook" module as the action
2. Connect your Facebook account
3. Select "Create a Post" action
4. Configure the post parameters:
   - Page: Select your Facebook page
   - Message: Map to the `content` field from the webhook
   - Link: (Optional) Map to any URL fields
   - Image: (Optional) Map to the `media_urls` array

### 4. Configure Environment Variables

Add the following variables to your `.env.local` file:

```
MAKE_WEBHOOK_URL=https://hook.make.com/your-webhook-id
FACEBOOK_PAGE_ID=your-facebook-page-id
```

Replace `your-webhook-id` with the actual webhook ID from Make.com and `your-facebook-page-id` with your Facebook page ID.

### 5. Test the Integration

1. Publish a post from your application
2. Check the Make.com scenario execution logs
3. Verify that the post appears on your Facebook page

## Troubleshooting

- **Webhook not receiving data**: Check that the webhook URL is correctly set in your environment variables
- **Facebook post not appearing**: Verify your Facebook permissions and page access
- **Error in Make.com scenario**: Check the execution logs for specific error messages

## Advanced Configuration

### Adding Error Handling

You can add error handling in Make.com by:

1. Adding an "Error Handler" module
2. Configuring it to send notifications or retry the operation

### Scheduling Posts

To schedule posts for future publication:

1. Add a "Scheduler" module between the webhook and Facebook modules
2. Configure the desired schedule (e.g., specific time, delay)

### Multiple Platforms

To publish to multiple platforms:

1. Add additional modules for each platform (e.g., Instagram, LinkedIn)
2. Configure each module with the appropriate API credentials
3. Map the content fields accordingly 