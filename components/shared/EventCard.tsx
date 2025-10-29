'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslations } from 'next-intl'

interface EventCardProps {
  title: string
  description: string
  date: string
  format?: string | undefined
  registrationUrl?: string | undefined
  recordingUrl?: string | undefined
  status: string
  speakers?: string[] | Array<{ name: string; title: string }> | undefined
}

export function EventCard({
  title,
  description,
  date,
  format,
  registrationUrl,
  recordingUrl,
  status,
  speakers,
}: EventCardProps) {
  const t = useTranslations('Common')
  const eventDate = new Date(date)
  const isUpcoming = status === 'upcoming'
  const isPast = status === 'completed'

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="mb-2 flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription className="mt-2">
              {eventDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </CardDescription>
          </div>
          {isUpcoming && (
            <span className="inline-flex items-center rounded-full bg-orange/10 px-3 py-1 text-xs font-medium text-orange">
              {t('upcoming')}
            </span>
          )}
          {isPast && recordingUrl && (
            <span className="inline-flex items-center rounded-full bg-teal/10 px-3 py-1 text-xs font-medium text-teal">
              {t('recorded')}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <p className="mb-4 text-sm text-muted-foreground">{description}</p>

        {speakers && speakers.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium">{t('speakers')}:</p>
            {speakers.map((speaker, index) => (
              <p key={index} className="text-sm text-muted-foreground">
                {typeof speaker === 'string' ? speaker : `${speaker.name} - ${speaker.title}`}
              </p>
            ))}
          </div>
        )}

        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <svg
            className="h-4 w-4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span className="capitalize">{format?.replace('-', ' ') || 'In-person'}</span>
        </div>

        <div className="mt-auto">
          {isUpcoming && registrationUrl && (
            <Button asChild className="w-full bg-teal hover:bg-teal/90">
              <a href={registrationUrl} target="_blank" rel="noopener noreferrer">
                {t('registerNow')}
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            </Button>
          )}
          {isPast && recordingUrl && (
            <Button variant="outline" asChild className="w-full">
              <a href={recordingUrl} target="_blank" rel="noopener noreferrer">
                {t('watchRecording')} →<span className="sr-only"> (opens in new tab)</span>
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
