import type { AuthUser } from '@/features/auth/types/auth'

export const BACKOFFICE_ROLES = ['admin', 'content_manager', 'analytics'] as const
export const FIELD_ROLES = ['inquirer'] as const
export const APP_ROLES = [...BACKOFFICE_ROLES, ...FIELD_ROLES] as const

export type AppRole = (typeof APP_ROLES)[number]

const ROLE_LABELS: Record<AppRole, string> = {
  admin: 'Administrador',
  content_manager: 'Content Manager',
  analytics: 'Analytics',
  inquirer: 'Inquiridor',
}

function inferRoleFromEmail(email?: string | null): AppRole | null {
  if (!email) return null

  const normalizedEmail = email.trim().toLowerCase()

  switch (normalizedEmail) {
    case 'admin@somas.app':
      return 'admin'
    case 'content@somas.app':
      return 'content_manager'
    case 'analytic@somas.app':
      return 'analytics'
    case 'inquirer@somas.app':
      return 'inquirer'
    default:
      return null
  }
}

function inferRoleFromIdentity(user: Pick<AuthUser, 'email' | 'name' | 'fullName'>): AppRole | null {
  const roleFromEmail = inferRoleFromEmail(user.email)

  if (roleFromEmail) return roleFromEmail

  const normalizedName = (user.name ?? user.fullName ?? '').trim().toLowerCase().replace(/[-\s]+/g, '_')

  switch (normalizedName) {
    case 'admin':
    case 'administrator':
      return 'admin'
    case 'content_manager':
      return 'content_manager'
    case 'analytics':
    case 'analytic':
    case 'analyst':
      return 'analytics'
    case 'inquirer':
    case 'enumerator':
      return 'inquirer'
    default:
      return null
  }
}

export function normalizeRole(role?: string | null): AppRole | null {
  if (!role) return null

  const normalized = role.trim().toLowerCase().replace(/[-\s]+/g, '_')

  switch (normalized) {
    case 'admin':
    case 'administrator':
      return 'admin'
    case 'content_manager':
    case 'contentmanager':
      return 'content_manager'
    case 'analytics':
    case 'analytic':
    case 'analyst':
      return 'analytics'
    case 'inquirer':
    case 'enumerator':
      return 'inquirer'
    default:
      return null
  }
}

export function normalizeAuthUser(user: AuthUser | null | undefined): AuthUser | null {
  if (!user) return null

  const normalizedRole = normalizeRole(user.role) ?? inferRoleFromIdentity(user)

  return {
    ...user,
    role: normalizedRole,
  }
}

export function getRoleLabel(role?: string | null) {
  const normalizedRole = normalizeRole(role)
  return normalizedRole ? ROLE_LABELS[normalizedRole] : role ?? 'Sem role'
}

export function isBackofficeRole(role?: string | null) {
  const normalizedRole = normalizeRole(role)
  return normalizedRole ? BACKOFFICE_ROLES.includes(normalizedRole) : false
}

export function isFieldRole(role?: string | null) {
  return normalizeRole(role) === 'inquirer'
}

export function getDefaultRouteForRole(role?: string | null) {
  switch (normalizeRole(role)) {
    case 'admin':
      return '/backoffice/dashboard'
    case 'content_manager':
      return '/backoffice/campaigns'
    case 'analytics':
      return '/backoffice/dashboard'
    case 'inquirer':
      return '/field/dashboard'
    default:
      return '/'
  }
}

export function canAccessBackofficePath(role: string | null | undefined, path: string) {
  const normalizedRole = normalizeRole(role)

  if (path === '/backoffice/savings' || path.startsWith('/backoffice/savings/')) {
    return false
  }

  if (!normalizedRole || normalizedRole === 'inquirer') return false
  if (normalizedRole === 'admin') return true

  if (normalizedRole === 'content_manager') {
    return [
      '/backoffice/campaigns',
      '/backoffice/beneficiaries',
      '/backoffice/field-verification',
      '/backoffice/users',
    ].some((prefix) => path === prefix || path.startsWith(`${prefix}/`))
  }

  if (normalizedRole === 'analytics') {
    return [
      '/backoffice/dashboard',
      '/backoffice/metrics',
      '/backoffice/insights',
      '/backoffice/reports',
      '/backoffice/transactions',
      '/backoffice/disbursements',
    ].some((prefix) => path === prefix || path.startsWith(`${prefix}/`))
      || path === '/backoffice/campaigns'
      || /^\/backoffice\/campaigns\/[^/]+$/.test(path)
  }

  return false
}
