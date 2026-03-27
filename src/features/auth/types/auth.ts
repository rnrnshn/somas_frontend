export type AuthUser = {
  id: number
  name?: string | null
  fullName?: string | null
  email: string
  role?: string | null
}

export type LoginPayload = {
  email: string
  password: string
}

export type LoginResponse = {
  token: string
  user: AuthUser
}

export type EmailPayload = {
  email: string
}

export type TokenPasswordPayload = {
  token: string
  password: string
}

export type MsisdnPayload = {
  msisdn: string
}

export type ConfirmMsisdnPayload = {
  token: string
}
