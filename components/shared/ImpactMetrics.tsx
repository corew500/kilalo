import { client } from '@/sanity/lib/client'

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

export async function ImpactMetrics() {
  const metrics = await getCurrentMetrics()

  if (!metrics) {
    return null
  }

  const displayMetrics = [
    {
      label: 'Businesses Supported',
      value: metrics.businessesSupported || 0,
      suffix: '+',
    },
    {
      label: 'Hekima Sessions',
      value: metrics.hekimaSessions || 0,
      suffix: '',
    },
    {
      label: 'Regions Served',
      value: metrics.regionsServed || 0,
      suffix: '',
    },
    {
      label: 'Jobs Created',
      value: metrics.jobsCreated || 0,
      suffix: '+',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
      {displayMetrics.map((metric, index) => (
        <div
          key={index}
          className="text-center p-6 rounded-lg bg-gradient-to-br from-teal/10 to-orange/10 border border-teal/20"
        >
          <div className="text-4xl font-bold text-teal mb-2">
            {metric.value}
            {metric.suffix}
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            {metric.label}
          </div>
        </div>
      ))}
    </div>
  )
}
