'use strict';

/**
 * categoryRepository.js — Data Access Layer
 * All marketplace_categories and marketplace_tags queries live here.
 * Only this file (and other repositories) may import supabaseClient.
 */

const supabase = require('../../config/supabaseClient');

// ─── CATEGORIES ──────────────────────────────────────────────────────────────

/**
 * Fetch all active categories (flat list — caller builds tree from parent_id).
 */
async function getAllCategories() {
  return supabase
    .from('marketplace_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
}

/**
 * Fetch all categories ordered by sort_order (for tree building, includes inactive).
 */
async function getCategoryTree() {
  return supabase
    .from('marketplace_categories')
    .select('id, name, slug, description, icon_url, parent_id, is_active, sort_order')
    .order('sort_order', { ascending: true });
}

/**
 * Fetch a single category by primary key.
 * @param {string} id - UUID
 */
async function getCategoryById(id) {
  return supabase
    .from('marketplace_categories')
    .select('*')
    .eq('id', id)
    .single();
}

/**
 * Fetch a single category by its URL slug.
 * @param {string} slug
 */
async function getCategoryBySlug(slug) {
  return supabase
    .from('marketplace_categories')
    .select('*')
    .eq('slug', slug)
    .single();
}

/**
 * Insert a new category.
 * @param {Object} categoryData - { name, slug, description?, icon_url?, parent_id?, sort_order? }
 */
async function createCategory(categoryData) {
  return supabase
    .from('marketplace_categories')
    .insert(categoryData)
    .select()
    .single();
}

/**
 * Partially update a category.
 * @param {string} id
 * @param {Object} updates
 */
async function updateCategory(id, updates) {
  return supabase
    .from('marketplace_categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
}

// ─── TAGS ────────────────────────────────────────────────────────────────────

/**
 * Fetch all marketplace tags, optionally filtered by is_verified.
 * @param {{ is_verified?: boolean }} filters
 */
async function getAllTags(filters = {}) {
  let query = supabase
    .from('marketplace_tags')
    .select('id, name, slug, category_id, is_verified, usage_count')
    .order('usage_count', { ascending: false });

  if (typeof filters.is_verified === 'boolean') {
    query = query.eq('is_verified', filters.is_verified);
  }

  return query;
}

/**
 * Fetch a single tag by ID.
 * @param {string} id
 */
async function getTagById(id) {
  return supabase
    .from('marketplace_tags')
    .select('*')
    .eq('id', id)
    .single();
}

/**
 * Insert a new tag.
 * @param {Object} tagData - { name, slug, category_id?, is_verified? }
 */
async function createTag(tagData) {
  return supabase
    .from('marketplace_tags')
    .insert(tagData)
    .select()
    .single();
}

/**
 * Increment usage_count on a tag (called when a tag is added to a job/gig).
 * @param {string} id
 */
async function incrementTagUsage(id) {
  return supabase.rpc('increment_tag_usage', { tag_id: id });
}

module.exports = {
  getAllCategories,
  getCategoryTree,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  getAllTags,
  getTagById,
  createTag,
  incrementTagUsage,
};
