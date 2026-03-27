import { createRoute, type AnyRoute } from '@tanstack/react-router'
import { publicRouteDefinitions } from '@/app/router/public-route-definitions'

export function buildPublicRoutes(rootRoute: AnyRoute) {
  return publicRouteDefinitions.map(({ path, component }) =>
    createRoute({
      getParentRoute: () => rootRoute,
      path,
      component,
    })
  )
}
