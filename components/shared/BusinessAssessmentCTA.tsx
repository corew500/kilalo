import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface BusinessAssessmentCTAProps {
  variant?: 'default' | 'card' | 'banner'
  className?: string
}

export function BusinessAssessmentCTA({
  variant = 'default',
  className = ''
}: BusinessAssessmentCTAProps) {
  if (variant === 'card') {
    return (
      <div className={`rounded-lg bg-gradient-to-r from-teal/10 to-orange/10 p-8 text-center ${className}`}>
        <h3 className="text-2xl font-bold mb-3">Ready to Scale Your Business?</h3>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Start with a free business evaluation. We'll help you identify growth opportunities
          and determine if the Vision & Structure Program is right for you.
        </p>
        <Button size="lg" asChild className="bg-teal hover:bg-teal/90">
          <Link href="/work-with-us">Schedule Free Assessment</Link>
        </Button>
      </div>
    )
  }

  if (variant === 'banner') {
    return (
      <div className={`rounded-lg border-2 border-teal/20 bg-teal/5 p-6 flex flex-col md:flex-row items-center justify-between gap-4 ${className}`}>
        <div>
          <h4 className="text-lg font-semibold mb-1">Get Your Free Business Evaluation</h4>
          <p className="text-sm text-muted-foreground">
            See if the Vision & Structure Program is right for your business
          </p>
        </div>
        <Button asChild className="bg-teal hover:bg-teal/90 whitespace-nowrap">
          <Link href="/work-with-us">Apply Now →</Link>
        </Button>
      </div>
    )
  }

  return (
    <Button
      size="lg"
      asChild
      className={`bg-orange hover:bg-orange/90 ${className}`}
    >
      <Link href="/work-with-us">Start with Free Assessment</Link>
    </Button>
  )
}
