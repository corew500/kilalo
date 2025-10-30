import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EventCard } from '../EventCard'

// Default translations for tests
const defaultTranslations = {
  upcoming: 'Upcoming',
  recorded: 'Recorded',
  speakers: 'Speakers',
  registerNow: 'Register Now',
  watchRecording: 'Watch Recording',
}

describe('EventCard', () => {
  const baseProps = {
    title: 'Test Event',
    description: 'Event description',
    date: '2025-12-15T10:00:00Z',
    status: 'upcoming',
    translations: defaultTranslations,
  }

  it('renders event title', () => {
    render(<EventCard {...baseProps} />)
    expect(screen.getByText('Test Event')).toBeInTheDocument()
  })

  it('renders event description', () => {
    render(<EventCard {...baseProps} />)
    expect(screen.getByText('Event description')).toBeInTheDocument()
  })

  it('formats date correctly', () => {
    render(<EventCard {...baseProps} />)
    expect(screen.getByText(/Monday, December 15, 2025/)).toBeInTheDocument()
  })

  it('shows upcoming badge for upcoming events', () => {
    render(<EventCard {...baseProps} status="upcoming" />)
    expect(screen.getByText('Upcoming')).toBeInTheDocument()
  })

  it('shows recorded badge for past events with recording', () => {
    render(<EventCard {...baseProps} status="completed" recordingUrl="https://example.com/recording" />)
    expect(screen.getByText('Recorded')).toBeInTheDocument()
  })

  it('does not show recorded badge for past events without recording', () => {
    render(<EventCard {...baseProps} status="completed" />)
    expect(screen.queryByText('Recorded')).not.toBeInTheDocument()
  })

  it('renders format when provided', () => {
    render(<EventCard {...baseProps} format="virtual" />)
    expect(screen.getByText('virtual')).toBeInTheDocument()
  })

  it('replaces hyphens in format with spaces', () => {
    render(<EventCard {...baseProps} format="in-person" />)
    expect(screen.getByText('in person')).toBeInTheDocument()
  })

  it('defaults to In-person when format not provided', () => {
    render(<EventCard {...baseProps} />)
    expect(screen.getByText('In-person')).toBeInTheDocument()
  })

  it('renders string speakers', () => {
    const speakers = ['John Doe', 'Jane Smith']
    render(<EventCard {...baseProps} speakers={speakers} />)
    expect(screen.getByText('Speakers:')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('renders object speakers with name and title', () => {
    const speakers = [
      { name: 'John Doe', title: 'CEO' },
      { name: 'Jane Smith', title: 'CTO' },
    ]
    render(<EventCard {...baseProps} speakers={speakers} />)
    expect(screen.getByText('John Doe - CEO')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith - CTO')).toBeInTheDocument()
  })

  it('does not render speakers section when empty', () => {
    render(<EventCard {...baseProps} speakers={[]} />)
    expect(screen.queryByText('Speakers:')).not.toBeInTheDocument()
  })

  it('does not render speakers section when undefined', () => {
    render(<EventCard {...baseProps} />)
    expect(screen.queryByText('Speakers:')).not.toBeInTheDocument()
  })

  it('renders registration button for upcoming events with registrationUrl', () => {
    render(<EventCard {...baseProps} status="upcoming" registrationUrl="https://example.com/register" />)
    const button = screen.getByText('Register Now')
    expect(button).toBeInTheDocument()
    expect(button.closest('a')).toHaveAttribute('href', 'https://example.com/register')
    expect(button.closest('a')).toHaveAttribute('target', '_blank')
    expect(button.closest('a')).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('does not render registration button for upcoming events without registrationUrl', () => {
    render(<EventCard {...baseProps} status="upcoming" />)
    expect(screen.queryByText('Register Now')).not.toBeInTheDocument()
  })

  it('renders watch recording button for completed events with recordingUrl', () => {
    render(<EventCard {...baseProps} status="completed" recordingUrl="https://example.com/recording" />)
    const button = screen.getByText(/Watch Recording/)
    expect(button).toBeInTheDocument()
    expect(button.closest('a')).toHaveAttribute('href', 'https://example.com/recording')
    expect(button.closest('a')).toHaveAttribute('target', '_blank')
  })

  it('does not render watch recording button for completed events without recordingUrl', () => {
    render(<EventCard {...baseProps} status="completed" />)
    expect(screen.queryByText(/Watch Recording/)).not.toBeInTheDocument()
  })

  it('renders screen reader text for external links', () => {
    render(<EventCard {...baseProps} status="upcoming" registrationUrl="https://example.com" />)
    expect(screen.getByText('(opens in new tab)')).toBeInTheDocument()
  })

  it('renders complete upcoming event with all props', () => {
    const speakers = ['John Doe', 'Jane Smith']
    render(
      <EventCard
        {...baseProps}
        status="upcoming"
        format="virtual"
        registrationUrl="https://example.com/register"
        speakers={speakers}
      />
    )

    expect(screen.getByText('Test Event')).toBeInTheDocument()
    expect(screen.getByText('Upcoming')).toBeInTheDocument()
    expect(screen.getByText('virtual')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Register Now')).toBeInTheDocument()
  })

  it('renders complete past event with all props', () => {
    const speakers = [{ name: 'John Doe', title: 'Speaker' }]
    render(
      <EventCard
        {...baseProps}
        status="completed"
        format="in-person"
        recordingUrl="https://example.com/recording"
        speakers={speakers}
      />
    )

    expect(screen.getByText('Test Event')).toBeInTheDocument()
    expect(screen.getByText('Recorded')).toBeInTheDocument()
    expect(screen.getByText('in person')).toBeInTheDocument()
    expect(screen.getByText('John Doe - Speaker')).toBeInTheDocument()
    expect(screen.getByText(/Watch Recording/)).toBeInTheDocument()
  })
})
