import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BusinessAssessmentCTA } from '../BusinessAssessmentCTA'

describe('BusinessAssessmentCTA', () => {
  describe('default variant', () => {
    it('renders default button with default text', () => {
      render(<BusinessAssessmentCTA />)
      expect(screen.getByText('Start with Free Assessment')).toBeInTheDocument()
    })

    it('renders button with custom settings text', () => {
      const settings = {
        componentScheduleFreeAssessment: 'Book Your Free Consultation',
      }
      render(<BusinessAssessmentCTA settings={settings} />)
      expect(screen.getByText('Book Your Free Consultation')).toBeInTheDocument()
    })

    it('links to /work-with-us', () => {
      render(<BusinessAssessmentCTA />)
      const link = screen.getByText('Start with Free Assessment').closest('a')
      expect(link).toHaveAttribute('href', '/work-with-us')
    })

    it('applies custom className', () => {
      const { container } = render(<BusinessAssessmentCTA className="custom-class" />)
      const button = container.querySelector('.custom-class')
      expect(button).toBeInTheDocument()
    })
  })

  describe('card variant', () => {
    it('renders card with default title and description', () => {
      render(<BusinessAssessmentCTA variant="card" />)
      expect(screen.getByText('Ready to Scale Your Business?')).toBeInTheDocument()
      expect(
        screen.getByText(
          /Start with a free business evaluation. We'll help you identify growth opportunities/
        )
      ).toBeInTheDocument()
    })

    it('renders card with custom title from settings', () => {
      const settings = {
        componentBusinessAssessmentTitle: 'Transform Your Business Today',
      }
      render(<BusinessAssessmentCTA variant="card" settings={settings} />)
      expect(screen.getByText('Transform Your Business Today')).toBeInTheDocument()
    })

    it('renders card with custom description from settings', () => {
      const settings = {
        componentBusinessAssessmentDescription: 'Get personalized guidance for your business growth.',
      }
      render(<BusinessAssessmentCTA variant="card" settings={settings} />)
      expect(screen.getByText('Get personalized guidance for your business growth.')).toBeInTheDocument()
    })

    it('renders card with custom button text from settings', () => {
      const settings = {
        componentScheduleFreeAssessment: 'Get Started Now',
      }
      render(<BusinessAssessmentCTA variant="card" settings={settings} />)
      expect(screen.getByText('Get Started Now')).toBeInTheDocument()
    })

    it('links to /work-with-us', () => {
      render(<BusinessAssessmentCTA variant="card" />)
      const link = screen.getByText('Schedule Free Assessment').closest('a')
      expect(link).toHaveAttribute('href', '/work-with-us')
    })

    it('renders with gradient background', () => {
      const { container } = render(<BusinessAssessmentCTA variant="card" />)
      const card = container.querySelector('.bg-gradient-to-r')
      expect(card).toBeInTheDocument()
    })

    it('applies custom className', () => {
      const { container } = render(<BusinessAssessmentCTA variant="card" className="custom-card" />)
      const card = container.querySelector('.custom-card')
      expect(card).toBeInTheDocument()
    })
  })

  describe('banner variant', () => {
    it('renders banner with default title and description', () => {
      render(<BusinessAssessmentCTA variant="banner" />)
      expect(screen.getByText('Get Your Free Business Evaluation')).toBeInTheDocument()
      expect(screen.getByText('See if the Vision & Structure Program is right for your business')).toBeInTheDocument()
    })

    it('renders banner with custom title from settings', () => {
      const settings = {
        componentGetFreeEvaluation: 'Schedule Your Evaluation',
      }
      render(<BusinessAssessmentCTA variant="banner" settings={settings} />)
      expect(screen.getByText('Schedule Your Evaluation')).toBeInTheDocument()
    })

    it('renders banner with custom description from settings', () => {
      const settings = {
        componentBusinessAssessmentDescription: 'Discover if our program fits your needs',
      }
      render(<BusinessAssessmentCTA variant="banner" settings={settings} />)
      expect(screen.getByText('Discover if our program fits your needs')).toBeInTheDocument()
    })

    it('renders banner with custom button text from settings', () => {
      const settings = {
        componentApplyNow: 'Submit Application',
      }
      render(<BusinessAssessmentCTA variant="banner" settings={settings} />)
      expect(screen.getByText(/Submit Application/)).toBeInTheDocument()
    })

    it('links to /work-with-us', () => {
      render(<BusinessAssessmentCTA variant="banner" />)
      const link = screen.getByText(/Apply Now/).closest('a')
      expect(link).toHaveAttribute('href', '/work-with-us')
    })

    it('includes arrow in button text', () => {
      render(<BusinessAssessmentCTA variant="banner" />)
      expect(screen.getByText(/Apply Now →/)).toBeInTheDocument()
    })

    it('applies custom className', () => {
      const { container } = render(<BusinessAssessmentCTA variant="banner" className="custom-banner" />)
      const banner = container.querySelector('.custom-banner')
      expect(banner).toBeInTheDocument()
    })
  })

  describe('all variants with all settings', () => {
    const fullSettings = {
      componentBusinessAssessmentTitle: 'Custom Title',
      componentBusinessAssessmentDescription: 'Custom Description',
      componentScheduleFreeAssessment: 'Custom Schedule',
      componentGetFreeEvaluation: 'Custom Evaluation',
      componentApplyNow: 'Custom Apply',
    }

    it('renders default variant with all settings', () => {
      render(<BusinessAssessmentCTA settings={fullSettings} />)
      expect(screen.getByText('Custom Schedule')).toBeInTheDocument()
    })

    it('renders card variant with all settings', () => {
      render(<BusinessAssessmentCTA variant="card" settings={fullSettings} />)
      expect(screen.getByText('Custom Title')).toBeInTheDocument()
      expect(screen.getByText('Custom Description')).toBeInTheDocument()
      expect(screen.getByText('Custom Schedule')).toBeInTheDocument()
    })

    it('renders banner variant with all settings', () => {
      render(<BusinessAssessmentCTA variant="banner" settings={fullSettings} />)
      expect(screen.getByText('Custom Evaluation')).toBeInTheDocument()
      expect(screen.getByText('Custom Description')).toBeInTheDocument()
      expect(screen.getByText(/Custom Apply/)).toBeInTheDocument()
    })
  })

  describe('fallback behavior', () => {
    it('falls back to defaults when settings is undefined', () => {
      render(<BusinessAssessmentCTA />)
      expect(screen.getByText('Start with Free Assessment')).toBeInTheDocument()
    })

    it('falls back to defaults when settings is empty object', () => {
      render(<BusinessAssessmentCTA settings={{}} />)
      expect(screen.getByText('Start with Free Assessment')).toBeInTheDocument()
    })

    it('card variant falls back to defaults when settings is empty', () => {
      render(<BusinessAssessmentCTA variant="card" settings={{}} />)
      expect(screen.getByText('Ready to Scale Your Business?')).toBeInTheDocument()
      expect(screen.getByText('Schedule Free Assessment')).toBeInTheDocument()
    })

    it('banner variant falls back to defaults when settings is empty', () => {
      render(<BusinessAssessmentCTA variant="banner" settings={{}} />)
      expect(screen.getByText('Get Your Free Business Evaluation')).toBeInTheDocument()
      expect(screen.getByText(/Apply Now/)).toBeInTheDocument()
    })
  })
})
