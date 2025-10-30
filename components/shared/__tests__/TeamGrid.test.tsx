import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TeamGrid } from '../TeamGrid'

// Mock Next.js Image
vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    width,
    height,
  }: {
    src: string
    alt: string
    width: number
    height: number
  }) => <img src={src} alt={alt} width={width} height={height} />,
}))

// Mock Sanity image builder
vi.mock('@sanity/image-url', () => ({
  default: () => ({
    image: () => ({
      width: () => ({
        height: () => ({
          url: () => 'https://example.com/team-member.jpg',
        }),
      }),
    }),
  }),
}))

vi.mock('@/sanity/lib/client', () => ({
  client: {},
}))

describe('TeamGrid', () => {
  const mockMember = {
    _id: '1',
    name: 'John Doe',
    role: 'CEO & Founder',
    bio: 'John has 15 years of experience in technology and entrepreneurship.',
  }

  const mockMemberWithPhoto = {
    ...mockMember,
    photo: {
      _type: 'image' as const,
      alt: 'John Doe headshot',
    },
  }

  const mockMemberWithExpertise = {
    ...mockMemberWithPhoto,
    expertise: ['Leadership', 'Strategy', 'Technology'],
  }

  const mockMemberWithSocial = {
    ...mockMemberWithExpertise,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/johndoe',
      twitter: 'https://twitter.com/johndoe',
    },
  }

  it('renders empty grid when members array is empty', () => {
    const { container } = render(<TeamGrid members={[]} />)
    const grid = container.querySelector('.grid')
    expect(grid?.children.length).toBe(0)
  })

  it('renders single team member', () => {
    render(<TeamGrid members={[mockMember]} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('CEO & Founder')).toBeInTheDocument()
  })

  it('renders multiple team members', () => {
    const members = [
      mockMember,
      {
        _id: '2',
        name: 'Jane Smith',
        role: 'CTO',
        bio: 'Jane is a technology leader.',
      },
      {
        _id: '3',
        name: 'Bob Johnson',
        role: 'COO',
        bio: 'Bob manages operations.',
      },
    ]
    render(<TeamGrid members={members} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
  })

  it('renders team member photo with proper alt text', () => {
    render(<TeamGrid members={[mockMemberWithPhoto]} />)
    const images = screen.getAllByAltText('John Doe headshot')
    expect(images.length).toBeGreaterThan(0)
  })

  it('uses member name as fallback alt text when photo has no alt', () => {
    const memberNoAlt = {
      ...mockMember,
      photo: {
        _type: 'image' as const,
      },
    }
    render(<TeamGrid members={[memberNoAlt]} />)
    const images = screen.getAllByAltText('John Doe')
    expect(images.length).toBeGreaterThan(0)
  })

  it('renders card as clickable button with proper accessibility', () => {
    render(<TeamGrid members={[mockMember]} />)
    const card = screen.getByRole('button', {
      name: 'View profile of John Doe, CEO & Founder',
    })
    expect(card).toBeInTheDocument()
    expect(card).toHaveAttribute('tabIndex', '0')
  })

  it('opens dialog when team member card is clicked', () => {
    render(<TeamGrid members={[mockMember]} />)
    const card = screen.getByRole('button', {
      name: 'View profile of John Doe, CEO & Founder',
    })
    fireEvent.click(card)
    expect(screen.getByText('John has 15 years of experience in technology and entrepreneurship.')).toBeInTheDocument()
  })

  it('opens dialog when Enter key is pressed on card', () => {
    render(<TeamGrid members={[mockMember]} />)
    const card = screen.getByRole('button', {
      name: 'View profile of John Doe, CEO & Founder',
    })
    fireEvent.keyDown(card, { key: 'Enter' })
    expect(screen.getByText('John has 15 years of experience in technology and entrepreneurship.')).toBeInTheDocument()
  })

  it('opens dialog when Space key is pressed on card', () => {
    render(<TeamGrid members={[mockMember]} />)
    const card = screen.getByRole('button', {
      name: 'View profile of John Doe, CEO & Founder',
    })
    fireEvent.keyDown(card, { key: ' ' })
    expect(screen.getByText('John has 15 years of experience in technology and entrepreneurship.')).toBeInTheDocument()
  })

  it('displays member bio in dialog', () => {
    render(<TeamGrid members={[mockMember]} />)
    const card = screen.getByRole('button', {
      name: 'View profile of John Doe, CEO & Founder',
    })
    fireEvent.click(card)
    expect(screen.getByText('John has 15 years of experience in technology and entrepreneurship.')).toBeInTheDocument()
  })

  it('displays expertise tags when provided', () => {
    render(<TeamGrid members={[mockMemberWithExpertise]} />)
    const card = screen.getByRole('button')
    fireEvent.click(card)
    expect(screen.getByText('Expertise')).toBeInTheDocument()
    expect(screen.getByText('Leadership')).toBeInTheDocument()
    expect(screen.getByText('Strategy')).toBeInTheDocument()
    expect(screen.getByText('Technology')).toBeInTheDocument()
  })

  it('does not display expertise section when expertise is empty', () => {
    const memberNoExpertise = {
      ...mockMemberWithPhoto,
      expertise: [],
    }
    render(<TeamGrid members={[memberNoExpertise]} />)
    const card = screen.getByRole('button')
    fireEvent.click(card)
    expect(screen.queryByText('Expertise')).not.toBeInTheDocument()
  })

  it('does not display expertise section when expertise is undefined', () => {
    render(<TeamGrid members={[mockMemberWithPhoto]} />)
    const card = screen.getByRole('button')
    fireEvent.click(card)
    expect(screen.queryByText('Expertise')).not.toBeInTheDocument()
  })

  it('displays LinkedIn link when provided', () => {
    const { container } = render(<TeamGrid members={[mockMemberWithSocial]} />)
    const card = screen.getByRole('button')
    fireEvent.click(card)
    const linkedinLink = document.querySelector('a[href*="linkedin"]')
    expect(linkedinLink).not.toBeNull()
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/johndoe')
    expect(linkedinLink).toHaveAttribute('target', '_blank')
    expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('displays Twitter link when provided', () => {
    const { container } = render(<TeamGrid members={[mockMemberWithSocial]} />)
    const card = screen.getByRole('button')
    fireEvent.click(card)
    const twitterLink = document.querySelector('a[href*="twitter"]')
    expect(twitterLink).not.toBeNull()
    expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/johndoe')
    expect(twitterLink).toHaveAttribute('target', '_blank')
    expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('does not display social links section when socialLinks is undefined', () => {
    const { container } = render(<TeamGrid members={[mockMemberWithExpertise]} />)
    const card = screen.getByRole('button')
    fireEvent.click(card)
    expect(document.querySelector('a[href*="linkedin"]')).toBeNull()
    expect(document.querySelector('a[href*="twitter"]')).toBeNull()
  })

  it('handles member without photo gracefully', () => {
    render(<TeamGrid members={[mockMember]} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('CEO & Founder')).toBeInTheDocument()
    expect(screen.queryByAltText('John Doe')).not.toBeInTheDocument()
  })

  it('displays photo in both grid and dialog', () => {
    render(<TeamGrid members={[mockMemberWithPhoto]} />)
    const gridImages = screen.getAllByAltText('John Doe headshot')
    expect(gridImages.length).toBe(1)

    const card = screen.getByRole('button')
    fireEvent.click(card)

    const dialogImage = screen.getByAltText('John Doe')
    expect(dialogImage).toBeInTheDocument()
  })

  it('renders all member data in dialog when fully populated', () => {
    const { container } = render(<TeamGrid members={[mockMemberWithSocial]} />)
    const card = screen.getByRole('button')
    fireEvent.click(card)

    expect(screen.getAllByText('John Doe').length).toBeGreaterThan(0)
    expect(screen.getAllByText('CEO & Founder').length).toBeGreaterThan(0)
    expect(screen.getByText('John has 15 years of experience in technology and entrepreneurship.')).toBeInTheDocument()
    expect(screen.getByText('Expertise')).toBeInTheDocument()
    expect(screen.getByText('Leadership')).toBeInTheDocument()
    expect(document.querySelector('a[href*="linkedin"]')).not.toBeNull()
    expect(document.querySelector('a[href*="twitter"]')).not.toBeNull()
  })
})
