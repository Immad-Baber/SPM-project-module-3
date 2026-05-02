'use strict';

/**
 * jobRepository.js — Data Access Layer
 * All queries against the jobs and job_required_skills tables.
 */

const supabase = require('../../config/supabaseClient');

// ─── JOBS ─────────────────────────────────────────────────────────────────────

/**
 * Insert a new job listing.
 * @param {Object} jobData
 */
async function createJob(jobData) {
  return supabase
    .from('jobs')
    .insert(jobData)
    .select()
    .single();
}

/**
 * Fetch a single job with its required skills (tags).
 * @param {string} id
 */
async function getJobById(id) {
  return supabase
    .from('jobs')
    .select(`
      *,
      category:marketplace_categories(id, name, slug),
      required_skills:job_required_skills(
        id, level,
        tag:marketplace_tags(id, name, slug)
      )
    `)
    .eq('id', id)
    .single();
}

/**
 * Paginated job listings for a specific client.
 * @param {string} clientId
 * @param {{ status?: string, page?: number, limit?: number }} filters
 */
async function getJobsByClient(clientId, filters = {}) {
  const { status, page = 1, limit = 10 } = filters;
  const from = (page - 1) * limit;
  const to   = from + limit - 1;

  let query = supabase
    .from('jobs')
    .select('*, required_skills:job_required_skills(tag:marketplace_tags(id, name, slug))', { count: 'exact' })
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (status) query = query.eq('status', status);

  return query;
}

/**
 * Paginated marketplace browse — open jobs only by default.
 * @param {{ status?, category_id?, project_type?, budget_min?, budget_max?, page?, limit? }} filters
 */
async function getAllJobs(filters = {}) {
  const {
    status       = 'open',
    category_id,
    project_type,
    budget_min,
    budget_max,
    page  = 1,
    limit = 10,
  } = filters;

  const from = (page - 1) * limit;
  const to   = from + limit - 1;

  let query = supabase
    .from('jobs')
    .select(`
      id, title, description, project_type, budget_min, budget_max,
      duration_label, experience_level, status, bids_count, created_at,
      category:marketplace_categories(id, name, slug),
      required_skills:job_required_skills(tag:marketplace_tags(id, name, slug))
    `, { count: 'exact' })
    .eq('status', status)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (category_id)  query = query.eq('category_id', category_id);
  if (project_type) query = query.eq('project_type', project_type);
  if (budget_min)   query = query.gte('budget_max', budget_min);
  if (budget_max)   query = query.lte('budget_min', budget_max);

  return query;
}

/**
 * Partial update of a job record.
 * @param {string} id
 * @param {Object} updates
 */
async function updateJob(id, updates) {
  return supabase
    .from('jobs')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
}

/**
 * Update only the status field of a job.
 * @param {string} id
 * @param {string} status - job_status enum value
 */
async function updateJobStatus(id, status) {
  return supabase
    .from('jobs')
    .update({ status })
    .eq('id', id)
    .select('id, status')
    .single();
}

// ─── JOB REQUIRED SKILLS ─────────────────────────────────────────────────────

/**
 * Bulk insert skill tags for a job.
 * @param {string}   jobId
 * @param {Array<{ tag_id: string, level?: string }>} skills
 */
async function addRequiredSkillsToJob(jobId, skills) {
  const rows = skills.map((s) => ({ job_id: jobId, tag_id: s.tag_id, level: s.level || null }));
  return supabase
    .from('job_required_skills')
    .insert(rows)
    .select();
}

/**
 * Remove a single skill tag from a job.
 * @param {string} jobId
 * @param {string} tagId
 */
async function removeRequiredSkillFromJob(jobId, tagId) {
  return supabase
    .from('job_required_skills')
    .delete()
    .eq('job_id', jobId)
    .eq('tag_id', tagId);
}

// ─── SEARCH ──────────────────────────────────────────────────────────────────

/**
 * Full-text search on jobs using ilike on title + description.
 * Combined with optional filters.
 * @param {string} query
 * @param {{ category_id?, project_type?, budget_min?, budget_max?, page?, limit? }} filters
 */
async function searchJobs(query, filters = {}) {
  const {
    category_id,
    project_type,
    budget_min,
    budget_max,
    page  = 1,
    limit = 10,
  } = filters;

  const from = (page - 1) * limit;
  const to   = from + limit - 1;

  let dbQuery = supabase
    .from('jobs')
    .select(`
      id, title, description, project_type, budget_min, budget_max,
      duration_label, status, bids_count, created_at,
      category:marketplace_categories(id, name, slug),
      required_skills:job_required_skills(tag:marketplace_tags(id, name, slug))
    `, { count: 'exact' })
    .eq('status', 'open')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (category_id)  dbQuery = dbQuery.eq('category_id', category_id);
  if (project_type) dbQuery = dbQuery.eq('project_type', project_type);
  if (budget_min)   dbQuery = dbQuery.gte('budget_max', budget_min);
  if (budget_max)   dbQuery = dbQuery.lte('budget_min', budget_max);

  return dbQuery;
}

module.exports = {
  createJob,
  getJobById,
  getJobsByClient,
  getAllJobs,
  updateJob,
  updateJobStatus,
  addRequiredSkillsToJob,
  removeRequiredSkillFromJob,
  searchJobs,
};
