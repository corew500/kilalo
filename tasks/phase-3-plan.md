# Member Portal Phase 3: Profile & Settings Pages

## Overview

Build profile management and settings pages for member portal, allowing users to edit their information and preferences.

## Goals

1. Users can view and edit their profile information
2. Role-specific fields appear based on user type
3. Settings page for account preferences
4. All changes saved to Supabase profiles table
5. Proper validation and error handling
6. Full test coverage (unit + E2E)

---

## 1. Profile Page (`/[locale]/profile`)

### UI Structure

```
┌─────────────────────────────────────────┐
│ Profile Management                       │
├─────────────────────────────────────────┤
│                                          │
│ ┌────────┐  Basic Information           │
│ │ Avatar │  Full Name: [input]          │
│ │  [J]   │  Bio: [textarea]             │
│ │ Upload │  Location: [input]           │
│ └────────┘  Languages: [select]         │
│                                          │
│ Contact Information                      │
│   Email: [input] (read-only)            │
│   Phone: [input]                        │
│   ☑ Show email publicly                 │
│   ☑ Show phone publicly                 │
│                                          │
│ Social Links                             │
│   LinkedIn: [input]                     │
│   Twitter: [input]                      │
│   Website: [input]                      │
│                                          │
│ --- Role-Specific Section ---           │
│                                          │
│ [Entrepreneur only]                      │
│   Company Name: [input]                 │
│   Company Stage: [select]               │
│   Industry: [input]                     │
│                                          │
│ [Mentor only]                            │
│   Expertise Areas: [multi-select]       │
│   Years Experience: [input]             │
│   Availability: [select]                │
│                                          │
│ Privacy                                  │
│   Profile Visibility: [select]          │
│   • Public                               │
│   • Members Only                         │
│   • Private                              │
│                                          │
│ [Cancel] [Save Changes]                 │
└─────────────────────────────────────────┘
```

### Fields to Implement

**Common (all users):**

- `full_name` (required)
- `bio` (optional)
- `avatar_url` (optional, future: file upload)
- `location` (optional)
- `languages` (array, default: ['en'])
- `phone` (optional)
- `linkedin_url` (optional)
- `twitter_url` (optional)
- `website` (optional)
- `show_email` (boolean, default: false)
- `show_phone` (boolean, default: false)
- `profile_visibility` (enum: 'public', 'members_only', 'private')

**Entrepreneur-specific:**

- `company_name`
- `company_stage` (enum: 'idea', 'early', 'growth', 'established')
- `industry`

**Mentor-specific:**

- `expertise_areas` (array)
- `years_experience` (number)
- `mentor_availability` (enum: 'available', 'limited', 'unavailable')

### Implementation Steps

1. Create `app/[locale]/(member)/profile/page.tsx` (server component)
2. Create `components/member/ProfileForm.tsx` (client component)
3. Create server action `app/[locale]/(member)/profile/actions.ts`
4. Add form validation with Zod
5. Write unit tests for ProfileForm
6. Write E2E test for profile edit flow

---

## 2. Settings Page (`/[locale]/settings`)

### UI Structure

```
┌─────────────────────────────────────────┐
│ Account Settings                         │
├─────────────────────────────────────────┤
│                                          │
│ Account Information (read-only)          │
│   Email: user@example.com               │
│   Member since: Jan 15, 2024            │
│   User Type: Entrepreneur               │
│                                          │
│ Preferences                              │
│   Language: [English ▾]                 │
│   • English                              │
│   • Français                             │
│                                          │
│ Security                                 │
│   Password: ********                     │
│   [Change Password]                     │
│                                          │
│ Danger Zone                              │
│   Delete Account                         │
│   This action cannot be undone.         │
│   [Delete My Account]                   │
└─────────────────────────────────────────┘
```

### Features

1. **Account Info (read-only)**
   - Display email, created_at, user_type
2. **Language Preference**
   - Dropdown to switch locale
   - Updates user preference in profile
   - Redirects to new locale

3. **Password Change**
   - Modal/section with:
     - Current password (if we implement)
     - New password
     - Confirm new password
   - Uses Supabase auth API

4. **Account Deletion**
   - Confirmation modal
   - Requires password confirmation
   - Soft delete (mark as deleted) or hard delete

### Implementation Steps

1. Create `app/[locale]/(member)/settings/page.tsx`
2. Create `components/member/SettingsForm.tsx`
3. Create `components/member/ChangePasswordModal.tsx`
4. Create `components/member/DeleteAccountModal.tsx`
5. Create server actions for password change and account deletion
6. Write unit tests for all components
7. Write E2E test for settings flow

---

## 3. Server Actions

### `app/[locale]/(member)/profile/actions.ts`

```typescript
'use server'

export async function updateProfile(formData: FormData) {
  // 1. Get authenticated user
  // 2. Validate data with Zod
  // 3. Update profiles table
  // 4. Return success/error
}
```

### `app/[locale]/(member)/settings/actions.ts`

```typescript
'use server'

export async function updateLanguage(locale: string) {
  // Update user preference
}

export async function changePassword(newPassword: string) {
  // Use Supabase auth.updateUser()
}

export async function deleteAccount() {
  // Soft delete or cascade delete
}
```

---

## 4. Validation Schemas

### Profile Schema

```typescript
const profileSchema = z.object({
  full_name: z.string().min(2).max(100),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  linkedin_url: z.string().url().optional().or(z.literal('')),
  twitter_url: z.string().url().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  languages: z.array(z.string()),
  show_email: z.boolean(),
  show_phone: z.boolean(),
  profile_visibility: z.enum(['public', 'members_only', 'private']),

  // Entrepreneur fields (conditional)
  company_name: z.string().max(100).optional(),
  company_stage: z.enum(['idea', 'early', 'growth', 'established']).optional(),
  industry: z.string().max(100).optional(),

  // Mentor fields (conditional)
  expertise_areas: z.array(z.string()).optional(),
  years_experience: z.number().int().min(0).max(100).optional(),
  mentor_availability: z.enum(['available', 'limited', 'unavailable']).optional(),
})
```

---

## 5. Testing Strategy

### Unit Tests

- [ ] ProfileForm component (15-20 tests)
  - Renders all fields correctly
  - Shows/hides role-specific fields
  - Form validation works
  - Submit handling
  - Error display
- [ ] SettingsForm component (10 tests)
  - Renders account info
  - Language switching
  - Modal interactions
- [ ] ChangePasswordModal (5 tests)
- [ ] DeleteAccountModal (5 tests)

### E2E Tests

- [ ] Profile edit flow (e2e/profile-edit.spec.ts)
  - Login → Navigate to profile
  - Edit basic info → Save
  - Edit role-specific fields → Save
  - Verify changes persist
- [ ] Settings flow (e2e/settings.spec.ts)
  - Navigate to settings
  - Change language preference
  - Change password
  - Account deletion (with test user)

---

## 6. Implementation Order

**Simple to Complex:**

1. Settings page (read-only account info) - simplest
2. Language preference switch
3. Profile page - basic fields
4. Profile page - role-specific fields
5. Password change modal
6. Account deletion modal
7. All tests
8. i18n translations

**Estimated Time:** 4-6 hours

---

## Success Criteria

- ✅ Users can edit all profile fields
- ✅ Role-specific fields show/hide correctly
- ✅ All changes save to database
- ✅ Form validation prevents invalid data
- ✅ Settings page allows language switching
- ✅ Password change works
- ✅ Account deletion works (with confirmation)
- ✅ 30+ unit tests passing
- ✅ 2 E2E tests passing
- ✅ TypeScript strict mode passing
- ✅ All components follow existing patterns
