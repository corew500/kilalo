-- Fix handle_updated_at function security issue only
-- Migration: 20251101_fix_function_only
-- Created: 2025-11-01
-- Description: Fix function with security definer and set search_path

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$;

COMMENT ON FUNCTION public.handle_updated_at() IS
  'Automatically updates the updated_at timestamp. Security definer with empty search_path to prevent SQL injection.';
