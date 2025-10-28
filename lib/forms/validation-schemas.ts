/**
 * Form Validation Schemas
 *
 * Reusable Zod schemas for form validation across the application.
 * These schemas provide type-safe validation with localized error messages.
 */

import { z } from 'zod'

// ============================================================================
// CONTACT FORM SCHEMA
// ============================================================================

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(150, 'Subject must be at most 150 characters'),
  message: z
    .string()
    .min(20, 'Message must be at least 20 characters')
    .max(1000, 'Message must be at most 1000 characters'),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the privacy policy',
  }),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

// ============================================================================
// NEWSLETTER SIGNUP SCHEMA
// ============================================================================

export const newsletterSignupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z.string().min(2, 'First name must be at least 2 characters').optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to receive emails',
  }),
})

export type NewsletterSignupData = z.infer<typeof newsletterSignupSchema>

// ============================================================================
// BUSINESS ASSESSMENT FORM SCHEMA
// ============================================================================

export const businessAssessmentSchema = z.object({
  // Personal Information
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be at most 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .min(10, 'Please enter a valid phone number')
    .regex(/^[+]?[\d\s()-]+$/, 'Please enter a valid phone number'),
  location: z.string().min(2, 'Location is required'),

  // Business Information
  businessName: z
    .string()
    .min(2, 'Business name must be at least 2 characters')
    .max(150, 'Business name must be at most 150 characters'),
  industry: z.string().min(2, 'Please select an industry'),
  stage: z.enum(['idea', 'early', 'growth', 'scale'], {
    message: 'Please select a business stage',
  }),
  yearFounded: z
    .number()
    .min(1900, 'Invalid year')
    .max(new Date().getFullYear(), 'Year cannot be in the future')
    .optional(),
  teamSize: z.string().optional(),

  // Business Challenge
  mainChallenge: z
    .string()
    .min(50, 'Please provide at least 50 characters describing your challenge')
    .max(500, 'Description must be at most 500 characters'),
  goalDescription: z
    .string()
    .min(20, 'Please describe your goals in at least 20 characters')
    .max(500, 'Description must be at most 500 characters'),

  // Additional Info
  hearAboutUs: z.string().optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the privacy policy',
  }),
})

export type BusinessAssessmentData = z.infer<typeof businessAssessmentSchema>

// ============================================================================
// PARTNER INTEREST FORM SCHEMA
// ============================================================================

export const partnerInterestSchema = z.object({
  // Organization Information
  organizationName: z
    .string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(150, 'Organization name must be at most 150 characters'),
  organizationType: z.enum(['corporate', 'foundation', 'ngo', 'government', 'investor', 'other'], {
    message: 'Please select an organization type',
  }),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),

  // Contact Information
  contactName: z
    .string()
    .min(2, 'Contact name must be at least 2 characters')
    .max(100, 'Contact name must be at most 100 characters'),
  contactTitle: z.string().min(2, 'Title is required').max(100, 'Title must be at most 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .min(10, 'Please enter a valid phone number')
    .regex(/^[+]?[\d\s()-]+$/, 'Please enter a valid phone number'),

  // Partnership Interest
  partnershipType: z.array(z.string()).min(1, 'Please select at least one partnership type'),
  description: z
    .string()
    .min(50, 'Please provide at least 50 characters describing your interest')
    .max(1000, 'Description must be at most 1000 characters'),
  budget: z.string().optional(),
  timeline: z.string().optional(),

  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the privacy policy',
  }),
})

export type PartnerInterestData = z.infer<typeof partnerInterestSchema>

// ============================================================================
// MENTOR APPLICATION FORM SCHEMA
// ============================================================================

export const mentorApplicationSchema = z.object({
  // Personal Information
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be at most 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .min(10, 'Please enter a valid phone number')
    .regex(/^[+]?[\d\s()-]+$/, 'Please enter a valid phone number'),
  location: z.string().min(2, 'Location is required'),
  linkedIn: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),

  // Professional Background
  currentRole: z
    .string()
    .min(2, 'Current role is required')
    .max(150, 'Current role must be at most 150 characters'),
  organization: z
    .string()
    .min(2, 'Organization is required')
    .max(150, 'Organization must be at most 150 characters'),
  yearsOfExperience: z
    .number()
    .min(1, 'Years of experience must be at least 1')
    .max(60, 'Please enter a valid number of years'),
  expertiseAreas: z.array(z.string()).min(1, 'Please select at least one area of expertise'),

  // Mentorship Interest
  motivationDescription: z
    .string()
    .min(100, 'Please provide at least 100 characters describing your motivation')
    .max(1000, 'Description must be at most 1000 characters'),
  availability: z.enum(['1-2', '3-5', '5+'], {
    message: 'Please select your availability',
  }),
  preferredFormat: z.array(z.string()).min(1, 'Please select at least one format'),

  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the privacy policy',
  }),
})

export type MentorApplicationData = z.infer<typeof mentorApplicationSchema>

// ============================================================================
// EVENT REGISTRATION SCHEMA
// ============================================================================

export const eventRegistrationSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be at most 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .min(10, 'Please enter a valid phone number')
    .regex(/^[+]?[\d\s()-]+$/, 'Please enter a valid phone number')
    .optional(),
  organization: z.string().max(150, 'Organization must be at most 150 characters').optional(),
  role: z.string().max(100, 'Role must be at most 100 characters').optional(),
  questions: z.string().max(500, 'Questions must be at most 500 characters').optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the privacy policy',
  }),
})

export type EventRegistrationData = z.infer<typeof eventRegistrationSchema>
