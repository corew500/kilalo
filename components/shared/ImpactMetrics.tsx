import { client } from '@/sanity/lib/client'
import { getSiteSettings } from '@/lib/sanity-helpers'

async function getCurrentMetrics() {
  const metrics = await client.fetch(`
    *[_type == "impactMetrics" && isCurrent == true][0] {
      businessesSupported,
      hekimaSessions,
      regionsServed,
      jobsCreated,
      customMetrics
    }
  `)
  return metrics
}

interface ImpactMetricsProps {
  locale: string
}

export async function ImpactMetrics({ locale }: ImpactMetricsProps) {
  const metrics = await getCurrentMetrics()
  const settings = await getSiteSettings(locale)

  if (!metrics) {
    return null
  }

  const displayMetrics = [
    {
      label: settings?.componentImpactBusinessesSupported || 'Businesses Supported',
      value: metrics.businessesSupported || 0,
      suffix: '+',
    },
    {
      label: settings?.componentImpactHekimaSessions || 'Hekima Sessions',
      value: metrics.hekimaSessions || 0,
      suffix: '',
    },
    {
      label: settings?.componentImpactRegionsServed || 'Regions Served',
      value: metrics.regionsServed || 0,
      suffix: '',
    },
    {
      label: settings?.componentImpactJobsCreated || 'Jobs Created',
      value: metrics.jobsCreated || 0,
      suffix: '+',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
      {displayMetrics.map((metric, index) => (
        <div
          key={index}
          className="rounded-lg border border-teal/20 bg-gradient-to-br from-teal/10 to-orange/10 p-6 text-center"
        >
          <div className="mb-2 text-4xl font-bold text-teal">
            {metric.value}
            {metric.suffix}
          </div>
          <div className="text-sm font-medium text-muted-foreground">{metric.label}</div>
        </div>
      ))}
    </div>
  )
}
