/**
 * useCategories.js — React hook for categories and search.
 *
 * Usage:
 *   import { useCategories, useSearch } from '../../hooks/useCategories';
 *   const { categories, loading } = useCategories();
 */

import { useState, useEffect, useCallback } from 'react';
import { categoryApi, searchApi } from '../services/api';

/* ─── All categories ────────────────────────────────────────────────────────── */
export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  useEffect(() => {
    setLoading(true);
    categoryApi.getAll()
      .then(res => {
        if (res.success) setCategories(res.data || []);
        else setError(res.error || 'Failed to load categories');
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading, error };
}

/* ─── Global search (gigs + jobs) ──────────────────────────────────────────── */
export function useSearch() {
  const [results, setResults] = useState({ gigs: [], jobs: [] });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [query,   setQuery]   = useState('');

  const search = useCallback(async (searchQuery, filters = {}) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setResults({ gigs: [], jobs: [] });
      return;
    }
    setLoading(true);
    setError(null);
    setQuery(searchQuery);
    try {
      const res = await searchApi.global(searchQuery, filters);
      if (res.success) setResults(res.data || { gigs: [], jobs: [] });
      else setError(res.error || 'Search failed');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, query, search };
}
