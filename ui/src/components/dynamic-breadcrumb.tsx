import { Link, useLocation } from 'react-router-dom'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface BreadcrumbSegment {
  label: string
  href?: string
}

export function DynamicBreadcrumb() {
  const location = useLocation()

  const generateBreadcrumbs = (): BreadcrumbSegment[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbSegment[] = []

    if (pathSegments.length === 0) {
      return breadcrumbs
    }

    // Resource name mappings
    const resourceLabels: Record<string, string> = {
      pods: 'Pods',
      deployments: 'Deployments',
      services: 'Services',
      configmaps: 'ConfigMaps',
      secrets: 'Secrets',
      ingresses: 'Ingresses',
      gateways: 'Gateways',
      httproutes: 'HTTPRoutes',
      jobs: 'Jobs',
      daemonsets: 'DaemonSets',
      statefulsets: 'StatefulSets',
      namespaces: 'Namespaces',
      pvcs: 'PVCs',
      crds: 'CRDs',
      crs: 'Custom Resources',
    }

    // Helper function to create breadcrumb item
    const createBreadcrumb = (
      label: string,
      href?: string
    ): BreadcrumbSegment => ({
      label: resourceLabels[label] || label,
      href,
    })

    // Helper function to get safe link for segments
    const getSafeLink = (index: number): string | undefined => {
      const isLastSegment = index === pathSegments.length - 1
      if (isLastSegment) return undefined

      // Handle different path patterns
      if (pathSegments[0] === 'crds') {
        if (index === 0) return '/crds'
        if (index === 1) return `/crds/${pathSegments[1]}`
        if (index === 2) return `/crds/${pathSegments[1]}` // namespace links back to CRD list
        return undefined
      } else {
        // Regular resources: namespace should link back to resource list
        const isNamespace = pathSegments.length === 3 && index === 1
        if (isNamespace) return `/${pathSegments[0]}`
        return `/${pathSegments.slice(0, index + 1).join('/')}`
      }
    }

    // Generate breadcrumbs for each path segment
    pathSegments.forEach((segment, index) => {
      const href = getSafeLink(index)
      breadcrumbs.push(createBreadcrumb(segment, href))
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <Breadcrumb className="hidden md:block">
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {crumb.href ? (
                <BreadcrumbLink asChild>
                  <Link to={crumb.href}>{crumb.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
