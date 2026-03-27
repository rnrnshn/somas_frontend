import { useMutation } from '@tanstack/react-query'
import {
  addMsisdn,
  confirmAccount,
  confirmMsisdn,
  forgotPassword,
  resendConfirmationEmail,
  resendConfirmationMsisdn,
  resetPassword,
} from '@/features/auth/api/auth-api'
import type { ConfirmMsisdnPayload, EmailPayload, MsisdnPayload, TokenPasswordPayload } from '@/features/auth/types/auth'

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (payload: EmailPayload) => forgotPassword(payload),
  })
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (payload: TokenPasswordPayload) => resetPassword(payload),
  })
}

export function useConfirmAccountMutation() {
  return useMutation({
    mutationFn: (payload: TokenPasswordPayload) => confirmAccount(payload),
  })
}

export function useResendConfirmationEmailMutation() {
  return useMutation({
    mutationFn: (payload: EmailPayload) => resendConfirmationEmail(payload),
  })
}

export function useAddMsisdnMutation() {
  return useMutation({
    mutationFn: (payload: MsisdnPayload) => addMsisdn(payload),
  })
}

export function useConfirmMsisdnMutation() {
  return useMutation({
    mutationFn: (payload: ConfirmMsisdnPayload) => confirmMsisdn(payload),
  })
}

export function useResendConfirmationMsisdnMutation() {
  return useMutation({
    mutationFn: () => resendConfirmationMsisdn(),
  })
}
