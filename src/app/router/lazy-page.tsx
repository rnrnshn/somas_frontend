import { lazy } from 'react'

export function lazyPage<TModule extends { default: React.ComponentType<any> }>(
  loader: () => Promise<TModule>
) {
  return lazy(loader)
}
