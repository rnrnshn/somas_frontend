import { HttpError } from '@/lib/api/http-error'
import { getAccessToken } from '@/lib/auth/token-storage'

const DEFAULT_API_BASE_URL = 'http://localhost:3333'

type RequestOptions = Omit<RequestInit, 'body'> & {
  auth?: boolean
  body?: BodyInit | object | null
}

function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = false, headers, body, ...rest } = options
  const requestHeaders = new Headers(headers)
  const token = auth ? getAccessToken() : null

  if (auth && token) {
    requestHeaders.set('Authorization', `Bearer ${token}`)
  }

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData

  if (!isFormData && body && typeof body === 'object') {
    requestHeaders.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...rest,
    headers: requestHeaders,
    body: isFormData ? body : body && typeof body === 'object' ? JSON.stringify(body) : body,
  })

  if (response.status === 204) {
    return undefined as T
  }

  const contentType = response.headers.get('content-type') ?? ''
  const data = contentType.includes('application/json') ? await response.json() : await response.text()

  if (!response.ok) {
    const message =
      typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string'
        ? data.message
        : 'Something went wrong while communicating with the API.'

    throw new HttpError(response.status, message, data)
  }

  return data as T
}
