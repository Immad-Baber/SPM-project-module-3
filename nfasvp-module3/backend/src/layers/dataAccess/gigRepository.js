'use strict';

/**
 * gigRepository.js — Data Access Layer
 * All queries against gigs, gig_pricing_tiers, gig_portfolio_samples,
 * and gig_required_skills tables.
 */

const supabase = require('../../config/supabaseClient');

async function createGig(gigData) {
  return supabase.from('gigs').insert({ status: 'draft', ...gigData }).select().single();
}

async function getGigById(id) {
  return supabase
    .from('gigs')
    .select(`*, category:marketplace_categories(id, name, slug),
      pricing_tiers:gig_pricing_tiers(id, tier, package_name, description, price, delivery_days, revisions, deliverables),
      portfolio_samples:gig_portfolio_samples(id, title, file_url, file_type, sort_order),
      required_skills:gig_required_skills(id, tag:marketplace_tags(id, name, slug, is_verified))`)
    .eq('id', id).single();
}

async function getGigsByFreelancer(freelancerId, filters = {}) {
  const { status, page = 1, limit = 10 } = filters;
  const from = (page - 1) * limit;
  let query = supabase
    .from('gigs')
    .select('id, title, status, avg_rating, review_count, orders_count, thumbnail_url, created_at, pricing_tiers:gig_pricing_tiers(tier, price)', { count: 'exact' })
    .eq('freelancer_id', freelancerId)
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1);
  if (status) query = query.eq('status', status);
  return query;
}

async function getAllGigs(filters = {}) {
  const { category_id, is_featured, min_rating, sort = 'newest', page = 1, limit = 10 } = filters;
  const from = (page - 1) * limit;
  
  let query = supabase
    .from('gigs')
    .select(`id, title, thumbnail_url, avg_rating, review_count, orders_count, is_featured, freelancer_id, created_at,
      category:marketplace_categories(id, name, slug),
      pricing_tiers:gig_pricing_tiers(tier, price, delivery_days),
      required_skills:gig_required_skills(tag:marketplace_tags(id, name, slug))`, { count: 'exact' })
    .eq('status', 'live');

  // Sorting
  if (sort === 'newest') {
    query = query.order('created_at', { ascending: false });
  } else if (sort === 'price_low') {
    query = query.order('gig_pricing_tiers(price)', { ascending: true });
  } else if (sort === 'rating') {
    query = query.order('avg_rating', { ascending: false });
  } else {
    query = query.order('is_featured', { ascending: false }).order('avg_rating', { ascending: false });
  }

  query = query.range(from, from + limit - 1);

  if (category_id)               query = query.eq('category_id', category_id);
  if (is_featured !== undefined)  query = query.eq('is_featured', is_featured);
  if (min_rating)                query = query.gte('avg_rating', min_rating);
  
  return query;
}

async function updateGig(id, updates) {
  return supabase.from('gigs').update(updates).eq('id', id).select().single();
}

async function deactivateGig(id) {
  return supabase.from('gigs').update({ status: 'paused' }).eq('id', id).select('id, status').single();
}

async function countActiveGigsByFreelancer(freelancerId) {
  return supabase
    .from('gigs')
    .select('id', { count: 'exact', head: true })
    .eq('freelancer_id', freelancerId)
    .eq('status', 'live');
}

async function addPricingTier(gigId, tierData) {
  return supabase
    .from('gig_pricing_tiers')
    .upsert({ ...tierData, gig_id: gigId }, { onConflict: 'gig_id,tier' })
    .select().single();
}

async function addPortfolioSample(gigId, sampleData) {
  return supabase.from('gig_portfolio_samples').insert({ ...sampleData, gig_id: gigId }).select().single();
}

async function addRequiredTag(gigId, tagId) {
  return supabase.from('gig_required_skills').insert({ gig_id: gigId, tag_id: tagId }).select().single();
}

async function searchGigs(query, filters = {}) {
  const { category_id, min_rating, page = 1, limit = 10 } = filters;
  const from = (page - 1) * limit;
  let dbQuery = supabase
    .from('gigs')
    .select(`id, title, thumbnail_url, avg_rating, review_count, orders_count, freelancer_id,
      category:marketplace_categories(id, name, slug),
      pricing_tiers:gig_pricing_tiers(tier, price, delivery_days),
      required_skills:gig_required_skills(tag:marketplace_tags(id, name, slug))`, { count: 'exact' })
    .eq('status', 'live')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order('avg_rating', { ascending: false })
    .range(from, from + limit - 1);
  if (category_id) dbQuery = dbQuery.eq('category_id', category_id);
  if (min_rating)  dbQuery = dbQuery.gte('avg_rating', min_rating);
  return dbQuery;
}

module.exports = {
  createGig, getGigById, getGigsByFreelancer, getAllGigs,
  updateGig, deactivateGig, countActiveGigsByFreelancer,
  addPricingTier, addPortfolioSample, addRequiredTag, searchGigs,
};
