import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface SiteSettings {
  componentBusinessAssessmentTitle?: string
  componentBusinessAssessmentDescription?: string
  componentScheduleFreeAssessment?: string
  componentGetFreeEvaluation?: string
  componentApplyNow?: string
}

interface BusinessAssessmentCTAProps {
  variant?: 'default' | 'card' | 'banner'
  className?: string
  settings?: SiteSettings
}

export function BusinessAssessmentCTA({
  variant = 'default',
  className = '',
  settings,
}: BusinessAssessmentCTAProps) {
  if (variant === 'card') {
    return (
      <div
        className={`rounded-lg bg-gradient-to-r from-teal/10 to-orange/10 p-8 text-center ${className}`}
      >
        <h3 className="mb-3 text-2xl font-bold">
          {settings?.componentBusinessAssessmentTitle || 'Ready to Scale Your Business?'}
        </h3>
        <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
          {settings?.componentBusinessAssessmentDescription ||
            "Start with a free business evaluation. We'll help you identify growth opportunities and determine if the Vision & Structure Program is right for you."}
        </p>
        <Button size="lg" asChild className="bg-teal hover:bg-teal/90">
          <Link href="/work-with-us">
            {settings?.componentScheduleFreeAssessment || 'Schedule Free Assessment'}
          </Link>
        </Button>
      </div>
    )
  }

  if (variant === 'banner') {
    return (
      <div
        className={`flex flex-col items-center justify-between gap-4 rounded-lg border-2 border-teal/20 bg-teal/5 p-6 md:flex-row ${className}`}
      >
        <div>
          <h4 className="mb-1 text-lg font-semibold">
            {settings?.componentGetFreeEvaluation || 'Get Your Free Business Evaluation'}
          </h4>
          <p className="text-sm text-muted-foreground">
            {settings?.componentBusinessAssessmentDescription ||
              'See if the Vision & Structure Program is right for your business'}
          </p>
        </div>
        <Button asChild className="whitespace-nowrap bg-teal hover:bg-teal/90">
          <Link href="/work-with-us">{settings?.componentApplyNow || 'Apply Now'} →</Link>
        </Button>
      </div>
    )
  }

  return (
    <Button size="lg" asChild className={`bg-orange hover:bg-orange/90 ${className}`}>
      <Link href="/work-with-us">
        {settings?.componentScheduleFreeAssessment || 'Start with Free Assessment'}
      </Link>
    </Button>
  )
}
