import { useCallback } from 'react'
import {
  Link,
  Navigate,
  Outlet,
  RouterProvider,
  useLocation,
  useNavigate as useTanstackNavigate,
  useParams as useTanstackParams,
} from '@tanstack/react-router'

export { Link, Navigate, Outlet, RouterProvider, useLocation }

export function useNavigate() {
  const navigate = useTanstackNavigate()

  return useCallback(
    (to: string) => {
      void navigate({ to })
    },
    [navigate]
  )
}

export function useParams<TParams extends Record<string, string | undefined> = Record<string, string | undefined>>() {
  return useTanstackParams({ strict: false }) as TParams
}
