// Outbound to Module 7 (Payment & Escrow)
// Called after bid acceptance to initiate escrow setup for the new project

const axios = require('axios');
const config = require('../../config/env');

/**
 * Initiates escrow setup for a newly awarded project.
 * Called non-blocking from BiddingService.acceptBid()
 * 
 * @param {Object} projectData - { project_id, client_id, freelancer_id, agreed_amount, currency, deadline }
 * @returns {Promise<Object|null>} - M7 response or null on failure
 */
async function initiateEscrow(projectData) {
  try {
    const response = await axios.post(
      `${config.MODULE7_BASE_URL}/api/v1/escrow/initiate`,
      {
        project_id: projectData.id,
        client_user_id: projectData.client_id,
        freelancer_user_id: projectData.freelancer_id,
        total_amount: projectData.agreed_amount,
        currency_code: projectData.currency || 'USD',
      },
      {
        headers: {
          'Authorization': `Bearer ${config.MODULE7_API_KEY}`,
          'Content-Type': 'application/json',
          'X-Source-Module': 'module3',
        },
        timeout: 8000,
      }
    );
    console.log(`[M7 Integration] Escrow initiated for project ${projectData.id}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[M7 Integration] Escrow initiation failed for project ${projectData.id}:`, error.message);
    return null; // Non-blocking — log and continue
  }
}

module.exports = { initiateEscrow };
