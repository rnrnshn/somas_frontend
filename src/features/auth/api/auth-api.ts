import { apiRequest } from '@/lib/api/client'
import type {
  AuthUser,
  ConfirmMsisdnPayload,
  EmailPayload,
  LoginPayload,
  LoginResponse,
  MsisdnPayload,
  TokenPasswordPayload,
} from '@/features/auth/types/auth'

export function loginBackoffice(payload: LoginPayload) {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  })
}

export function loginField(payload: LoginPayload) {
  return apiRequest<LoginResponse>('/auth/inquirer/login', {
    method: 'POST',
    body: payload,
  })
}

export function logout() {
  return apiRequest<{ success: boolean }>('/auth/logout', {
    method: 'POST',
    auth: true,
  })
}

export function getCurrentUser() {
  return apiRequest<AuthUser>('/users/me', {
    method: 'GET',
    auth: true,
  })
}

export function forgotPassword(payload: EmailPayload) {
  return apiRequest<void>('/auth/forgot-password', {
    method: 'POST',
    body: payload,
  })
}

export function resetPassword(payload: TokenPasswordPayload) {
  return apiRequest<void>('/auth/reset-password', {
    method: 'POST',
    body: payload,
  })
}

export function confirmAccount(payload: TokenPasswordPayload) {
  return apiRequest<void>('/auth/confirm-account', {
    method: 'POST',
    body: payload,
  })
}

export function resendConfirmationEmail(payload: EmailPayload) {
  return apiRequest<void>('/auth/resend-confirmation-email', {
    method: 'POST',
    body: payload,
  })
}

export function addMsisdn(payload: MsisdnPayload) {
  return apiRequest<void>('/auth/add-msisdn', {
    method: 'POST',
    auth: true,
    body: payload,
  })
}

export function confirmMsisdn(payload: ConfirmMsisdnPayload) {
  return apiRequest<void>('/auth/confirm-msisdn', {
    method: 'POST',
    auth: true,
    body: payload,
  })
}

export function resendConfirmationMsisdn() {
  return apiRequest<void>('/auth/resend-confirmation-msisdn', {
    method: 'POST',
    auth: true,
  })
}
