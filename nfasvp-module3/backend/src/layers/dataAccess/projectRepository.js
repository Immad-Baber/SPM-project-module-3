'use strict';

/**
 * projectRepository.js — Data Access Layer
 * All queries against projects, project_milestones, project_git_repos,
 * and marketplace_notifications_log tables.
 */

const supabase = require('../../config/supabaseClient');

// ─── PROJECTS ─────────────────────────────────────────────────────────────────

async function createProject(projectData) {
  return supabase.from('projects').insert(projectData).select().single();
}

async function getProjectById(id) {
  return supabase
    .from('projects')
    .select(`*,
      milestones:project_milestones(id, title, description, amount, due_date, status, sort_order, submitted_at, approved_at),
      git_repo:project_git_repos(id, repo_url, provider, branch, is_private, linked_at)`)
    .eq('id', id)
    .single();
}

async function getProjectsByClient(clientId, filters = {}) {
  const { status, page = 1, limit = 10 } = filters;
  const from = (page - 1) * limit;
  let query = supabase
    .from('projects')
    .select('id, title, status, total_amount, project_type, started_at, deadline_at, freelancer_id', { count: 'exact' })
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1);
  if (status) query = query.eq('status', status);
  return query;
}

async function getProjectsByFreelancer(freelancerId, filters = {}) {
  const { status, page = 1, limit = 10 } = filters;
  const from = (page - 1) * limit;
  let query = supabase
    .from('projects')
    .select('id, title, status, total_amount, project_type, started_at, deadline_at, client_id', { count: 'exact' })
    .eq('freelancer_id', freelancerId)
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1);
  if (status) query = query.eq('status', status);
  return query;
}

async function updateProjectStatus(id, status) {
  return supabase
    .from('projects')
    .update({ status })
    .eq('id', id)
    .select('id, status')
    .single();
}

// ─── MILESTONES ───────────────────────────────────────────────────────────────

async function addMilestone(projectId, milestoneData) {
  return supabase
    .from('project_milestones')
    .insert({ ...milestoneData, project_id: projectId })
    .select()
    .single();
}

async function updateMilestoneStatus(milestoneId, status) {
  const updates = { status };
  if (status === 'submitted') updates.submitted_at = new Date().toISOString();
  if (status === 'approved')  updates.approved_at  = new Date().toISOString();
  return supabase
    .from('project_milestones')
    .update(updates)
    .eq('id', milestoneId)
    .select('id, status, submitted_at, approved_at')
    .single();
}

// ─── GIT REPOS ────────────────────────────────────────────────────────────────

async function linkGitRepo(projectId, repoData) {
  return supabase
    .from('project_git_repos')
    .upsert({ ...repoData, project_id: projectId }, { onConflict: 'project_id' })
    .select()
    .single();
}

// ─── NOTIFICATIONS LOG ────────────────────────────────────────────────────────

/**
 * Insert an entry into the marketplace_notifications_log audit table.
 * @param {Object} logData - { event_type, triggered_by, recipient_id, entity_type, entity_id, payload?, module6_sent?, module6_response? }
 */
async function logMarketplaceEvent(logData) {
  return supabase
    .from('marketplace_notifications_log')
    .insert(logData)
    .select('id')
    .single();
}

module.exports = {
  createProject,
  getProjectById,
  getProjectsByClient,
  getProjectsByFreelancer,
  updateProjectStatus,
  addMilestone,
  updateMilestoneStatus,
  linkGitRepo,
  logMarketplaceEvent,
};
