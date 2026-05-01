// Outbound to Module 6 (Communication & Notifications)
// Called after bid acceptance to notify the winning freelancer

const axios = require('axios');
const config = require('../../config/env');

/**
 * Sends bid acceptance notification to Module 6.
 * Non-blocking — failure must not affect marketplace state.
 */
async function notifyBidAccepted(freelancerId, clientId, projectData) {
  try {
    const response = await axios.post(
      `${config.MODULE6_BASE_URL}/api/v1/notifications/bid-accepted`,
      {
        recipient_id: freelancerId,
        sender_id: clientId,
        project_id: projectData.id,
        job_title: projectData.title,
        agreed_amount: projectData.agreed_amount,
        currency: projectData.currency,
      },
      {
        headers: {
          'Authorization': `Bearer ${config.MODULE6_API_KEY}`,
          'Content-Type': 'application/json',
          'X-Source-Module': 'module3',
        },
        timeout: 5000,
      }
    );
    console.log(`[M6 Integration] Bid accepted notification sent for freelancer ${freelancerId}`);
    return response.data;
  } catch (error) {
    console.error(`[M6 Integration] Notification failed for freelancer ${freelancerId}:`, error.message);
    return null;
  }
}

/**
 * Exposes job/gig listing data for Module 4 (AI Matching) to pull.
 * Module 4 calls our own endpoints — no outbound call needed here.
 * But we include a helper to validate M4 tokens if they call us.
 */
function validateModule4Request(req) {
  const sourceModule = req.headers['x-source-module'];
  return sourceModule === 'module4';
}

module.exports = { notifyBidAccepted, validateModule4Request };
