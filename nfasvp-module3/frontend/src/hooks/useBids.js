/**
 * useBids.js — React hooks for the Bidding / Proposal domain.
 *
 * Usage:
 *   import { useMyProposals, useSubmitBid } from '../../hooks/useBids';
 *   const { bids, loading } = useMyProposals({ status: 'pending' });
 */

import { useState, useEffect, useCallback } from 'react';
import { bidApi } from '../services/api';

/* ─── Freelancer — my proposals ─────────────────────────────────────────────── */
export function useMyProposals(filters = {}) {
  const [bids,    setBids]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [meta,    setMeta]    = useState({ total: 0 });

  const fetchBids = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await bidApi.myBids(filters);
      if (res.success) {
        setBids(res.data || []);
        setMeta(res.meta || meta);
      } else {
        setError(res.error || 'Failed to load proposals');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetchBids(); }, [fetchBids]);

  return { bids, loading, error, meta, refresh: fetchBids };
}

/* ─── Client — bids on a job ────────────────────────────────────────────────── */
export function useJobBids(jobId) {
  const [bids,    setBids]    = useState([]);
  const [loading, setLoading] = useState(!!jobId);
  const [error,   setError]   = useState(null);

  const fetchBids = useCallback(async () => {
    if (!jobId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await bidApi.listForJob(jobId);
      if (res.success) setBids(res.data || []);
      else setError(res.error || 'Failed to load bids');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => { fetchBids(); }, [fetchBids]);

  return { bids, loading, error, refresh: fetchBids };
}

/* ─── Submit a bid / proposal ───────────────────────────────────────────────── */
export function useSubmitBid() {
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);
  const [submitted, setSubmitted] = useState(null);

  const submitBid = async (jobId, bidData) => {
    setLoading(true);
    setError(null);
    setSubmitted(null);
    try {
      const res = await bidApi.submit(jobId, bidData);
      if (res.success) {
        setSubmitted(res.data);
        return res.data;
      }
      setError(res.error || 'Failed to submit proposal');
      return null;
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { submitBid, loading, error, submitted };
}

/* ─── Accept a bid (client action) ─────────────────────────────────────────── */
export function useAcceptBid() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [project, setProject] = useState(null);

  const acceptBid = async (jobId, bidId) => {
    setLoading(true);
    setError(null);
    setProject(null);
    try {
      const res = await bidApi.accept(jobId, bidId);
      if (res.success) {
        setProject(res.data?.project || res.data);
        return res.data;
      }
      setError(res.error || 'Failed to accept bid');
      return null;
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { acceptBid, loading, error, project };
}

/* ─── Reject a bid (client action) ─────────────────────────────────────────── */
export function useRejectBid() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const rejectBid = async (jobId, bidId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await bidApi.reject(jobId, bidId);
      if (res.success) return true;
      setError(res.error || 'Failed to reject bid');
      return false;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { rejectBid, loading, error };
}

/* ─── Withdraw own bid (freelancer action) ──────────────────────────────────── */
export function useWithdrawBid() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const withdrawBid = async (bidId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await bidApi.withdraw(bidId);
      if (res.success) return true;
      setError(res.error || 'Failed to withdraw bid');
      return false;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { withdrawBid, loading, error };
}
