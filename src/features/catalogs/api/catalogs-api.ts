import { apiRequest } from '@/lib/api/client'
import type { CatalogOption } from '@/features/catalogs/types/catalog'

export type ProvinceOption = CatalogOption & {
  regionId?: number | null
}

export type DistrictOption = CatalogOption & {
  provinceId?: number | null
}

export function getPrograms() {
  return apiRequest<CatalogOption[]>('/programs', { method: 'GET', auth: true })
}

export function getRegions() {
  return apiRequest<CatalogOption[]>('/regions', { method: 'GET', auth: true })
}

export function getProvinces(regionId?: number) {
  const query = typeof regionId === 'number' && Number.isFinite(regionId) ? `?regionId=${regionId}` : ''
  return apiRequest<ProvinceOption[]>(`/provinces${query}`, { method: 'GET', auth: true })
}

export function getDistricts(provinceId: number) {
  return apiRequest<DistrictOption[]>(`/provinces/${provinceId}/districts`, { method: 'GET', auth: true })
}

export function getPaymentChannels() {
  return apiRequest<CatalogOption[]>('/payment-channels', { method: 'GET', auth: true })
}

export function getDisbursementTypes() {
  return apiRequest<CatalogOption[]>('/disbursement-types', { method: 'GET', auth: true })
}

export function createProgram(payload: { name: string; description?: string }) {
  return apiRequest<CatalogOption>('/programs', { method: 'POST', auth: true, body: payload })
}

export function updateProgram(id: number, payload: { name?: string; description?: string }) {
  return apiRequest<CatalogOption>(`/programs/${id}`, { method: 'PATCH', auth: true, body: payload })
}

export function deleteProgram(id: number) {
  return apiRequest<void>(`/programs/${id}`, { method: 'DELETE', auth: true })
}

export function createRegion(payload: { name: string }) {
  return apiRequest<CatalogOption>('/regions', { method: 'POST', auth: true, body: payload })
}

export function updateRegion(id: number, payload: { name?: string }) {
  return apiRequest<CatalogOption>(`/regions/${id}`, { method: 'PATCH', auth: true, body: payload })
}

export function deleteRegion(id: number) {
  return apiRequest<void>(`/regions/${id}`, { method: 'DELETE', auth: true })
}

export function createDisbursementType(payload: { name: string; description?: string }) {
  return apiRequest<CatalogOption>('/disbursement-types', { method: 'POST', auth: true, body: payload })
}

export function updateDisbursementType(id: number, payload: { name?: string; description?: string }) {
  return apiRequest<CatalogOption>(`/disbursement-types/${id}`, { method: 'PATCH', auth: true, body: payload })
}

export function deleteDisbursementType(id: number) {
  return apiRequest<void>(`/disbursement-types/${id}`, { method: 'DELETE', auth: true })
}
