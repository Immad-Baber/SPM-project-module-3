'use strict';

/**
 * bidRepository.js — Data Access Layer
 * All queries against the bids table, including the ACID transaction RPC.
 */

const supabase = require('../../config/supabaseClient');

// ─── BIDS ─────────────────────────────────────────────────────────────────────

/**
 * Insert a new bid with status='pending'.
 * @param {Object} bidData - { job_id, freelancer_id, bid_amount, bid_type, duration_label, cover_letter }
 */
async function createBid(bidData) {
  return supabase
    .from('bids')
    .insert({ ...bidData, status: 'pending' })
    .select()
    .single();
}

/**
 * Fetch a single bid by ID.
 * @param {string} id
 */
async function getBidById(id) {
  return supabase
    .from('bids')
    .select(`
      *,
      job:jobs(id, title, budget_min, budget_max, status)
    `)
    .eq('id', id)
    .single();
}

/**
 * List all bids on a job (for client review).
 * @param {string} jobId
 */
async function getBidsByJob(jobId) {
  return supabase
    .from('bids')
    .select('*')
    .eq('job_id', jobId)
    .order('submitted_at', { ascending: false });
}

/**
 * Paginated bids by freelancer, with optional status filter (My Proposals view).
 * @param {string} freelancerId
 * @param {{ status?: string, page?: number, limit?: number }} filters
 */
async function getBidsByFreelancer(freelancerId, filters = {}) {
  const { status, page = 1, limit = 10 } = filters;
  const from = (page - 1) * limit;
  const to   = from + limit - 1;

  let query = supabase
    .from('bids')
    .select(`
      *,
      job:jobs(id, title, budget_min, budget_max, status, client_id)
    `, { count: 'exact' })
    .eq('freelancer_id', freelancerId)
    .order('submitted_at', { ascending: false })
    .range(from, to);

  if (status) query = query.eq('status', status);

  return query;
}

/**
 * Update the status of a single bid.
 * @param {string} id
 * @param {string} status - bid_status enum value
 */
async function updateBidStatus(id, status) {
  return supabase
    .from('bids')
    .update({ status })
    .eq('id', id)
    .select('id, status')
    .single();
}

/**
 * Reject all bids on a job except the accepted one.
 * Called as part of the bid acceptance flow.
 * @param {string} jobId
 * @param {string} acceptedBidId
 */
async function rejectAllOtherBids(jobId, acceptedBidId) {
  return supabase
    .from('bids')
    .update({ status: 'rejected' })
    .eq('job_id', jobId)
    .neq('id', acceptedBidId)
    .eq('status', 'pending'); // only reject pending ones
}

/**
 * Check if a freelancer already has a bid on this job.
 * Returns true if a duplicate exists.
 * @param {string} jobId
 * @param {string} freelancerId
 */
async function checkDuplicateBid(jobId, freelancerId) {
  const { data, error } = await supabase
    .from('bids')
    .select('id')
    .eq('job_id', jobId)
    .eq('freelancer_id', freelancerId)
    .maybeSingle();

  if (error) return { data: null, error };
  return { data: !!data, error: null }; // true = duplicate exists
}

/**
 * Withdraw a bid — set status to 'withdrawn'.
 * Verifies freelancer_id ownership before update.
 * @param {string} id
 * @param {string} freelancerId
 */
async function withdrawBid(id, freelancerId) {
  return supabase
    .from('bids')
    .update({ status: 'withdrawn' })
    .eq('id', id)
    .eq('freelancer_id', freelancerId) // ownership check
    .eq('status', 'pending')           // can only withdraw pending bids
    .select('id, status')
    .single();
}

// ─── ATOMIC BID ACCEPTANCE (ACID via Supabase RPC) ───────────────────────────

/**
 * Atomically accepts a bid and creates a project in a single DB transaction.
 * Delegates to a PostgreSQL stored procedure for ACID compliance (REQ-MKT-031).
 *
 * The RPC (defined in module3_rpc_accept_bid.sql) performs:
 *   1. UPDATE bids SET status='accepted' WHERE id=p_bid_id
 *   2. UPDATE bids SET status='rejected' WHERE job_id=p_job_id AND id != p_bid_id
 *   3. UPDATE jobs SET status='in_progress' WHERE id=p_job_id
 *   4. INSERT INTO projects (...) VALUES (p_project_data)
 *   5. RETURN the new project row
 *
 * @param {string} jobId
 * @param {string} bidId
 * @param {Object} projectData - { client_id, freelancer_id, title, total_amount, project_type, deadline_at? }
 */
async function acceptBidTransaction(jobId, bidId, projectData) {
  return supabase.rpc('accept_bid_transaction', {
    p_job_id       : jobId,
    p_bid_id       : bidId,
    p_client_id    : projectData.client_id,
    p_freelancer_id: projectData.freelancer_id,
    p_title        : projectData.title,
    p_total_amount : projectData.total_amount,
    p_project_type : projectData.project_type,
    p_deadline_at  : projectData.deadline_at || null,
  });
}

module.exports = {
  createBid,
  getBidById,
  getBidsByJob,
  getBidsByFreelancer,
  updateBidStatus,
  rejectAllOtherBids,
  checkDuplicateBid,
  withdrawBid,
  acceptBidTransaction,
};
