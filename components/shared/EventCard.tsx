import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

interface EventCardProps {
  title: string
  description: string
  date: string
  format: string
  registrationUrl?: string
  recordingUrl?: string
  status: string
  speakers?: Array<{ name: string; title: string }>
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
  const eventDate = new Date(date)
  const isUpcoming = status === 'upcoming'
  const isPast = status === 'completed'

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-4 mb-2">
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
              Upcoming
            </span>
          )}
          {isPast && recordingUrl && (
            <span className="inline-flex items-center rounded-full bg-teal/10 px-3 py-1 text-xs font-medium text-teal">
              Recorded
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <p className="text-sm text-muted-foreground mb-4">{description}</p>

        {speakers && speakers.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Speakers:</p>
            {speakers.map((speaker, index) => (
              <p key={index} className="text-sm text-muted-foreground">
                {speaker.name} - {speaker.title}
              </p>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <svg
            className="h-4 w-4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span className="capitalize">{format.replace('-', ' ')}</span>
        </div>

        <div className="mt-auto">
          {isUpcoming && registrationUrl && (
            <Button asChild className="w-full bg-teal hover:bg-teal/90">
              <a href={registrationUrl} target="_blank" rel="noopener noreferrer">
                Register Now
              </a>
            </Button>
          )}
          {isPast && recordingUrl && (
            <Button variant="outline" asChild className="w-full">
              <a href={recordingUrl} target="_blank" rel="noopener noreferrer">
                Watch Recording →
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
