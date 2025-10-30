# Cookie Consent Tools Comparison

**Date**: 2025-10-30
**Context**: Research on cookie consent management libraries for implementing Service Worker consent

---

## Executive Summary

### Recommendation: `react-cookie-consent`

**Why**:
- ✅ Free and open-source
- ✅ Simple React integration (perfect for Next.js)
- ✅ Lightweight (~15KB)
- ✅ Built-in accept/decline logic
- ✅ Stores user preference automatically
- ✅ Works perfectly for Service Worker use case

**Installation**: `npm install react-cookie-consent`

**Estimated Time**: 30-45 minutes to implement

---

## Comparison Matrix

| Feature | react-cookie-consent | vanilla-cookieconsent | CookieYes | Custom Build |
|---------|---------------------|----------------------|-----------|--------------|
| **Price** | Free | Free | Free tier limited | Free |
| **Bundle Size** | ~15KB | ~20KB | ~50KB + external | Minimal |
| **React Native** | ✅ Yes | ❌ Framework-agnostic | ✅ Yes | ✅ Yes |
| **Next.js App Router** | ✅ Works | ⚠️ Needs setup | ✅ Works | ✅ Works |
| **Accept/Decline** | ✅ Built-in | ✅ Built-in | ✅ Built-in | ❌ Build yourself |
| **Cookie Storage** | ✅ Automatic | ✅ Automatic | ✅ Automatic | ❌ Build yourself |
| **Customization** | ⭐⭐⭐⭐ High | ⭐⭐⭐⭐⭐ Very High | ⭐⭐⭐ Medium | ⭐⭐⭐⭐⭐ Unlimited |
| **Setup Time** | 30 mins | 1 hour | 20 mins | 2-3 hours |
| **GDPR Compliant** | ✅ Yes | ✅ Yes | ✅ Yes | ⚠️ Your responsibility |
| **Documentation** | ⭐⭐⭐⭐ Good | ⭐⭐⭐ Okay | ⭐⭐⭐⭐⭐ Excellent | N/A |
| **Community** | ⭐⭐⭐⭐ Active | ⭐⭐⭐⭐ Active | ⭐⭐⭐⭐⭐ Commercial | N/A |

---

## Option 1: react-cookie-consent (RECOMMENDED)

### Overview

- **Package**: `react-cookie-consent`
- **Size**: ~15KB
- **Maintained**: ✅ Active (last updated 2024)
- **Stars**: 500+ on GitHub
- **Downloads**: 100K+/week on npm

### Pros

✅ **Simple Integration**:
```jsx
import CookieConsent from "react-cookie-consent";

<CookieConsent
  location="bottom"
  buttonText="Accept"
  declineButtonText="Decline"
  enableDeclineButton
  onAccept={() => registerServiceWorker()}
  onDecline={() => unregisterServiceWorker()}
>
  We use caching to improve performance.
</CookieConsent>
```

✅ **Automatic Cookie Management**:
- Stores user choice in cookie automatically
- Remembers preference across sessions
- Provides helper functions to check consent

✅ **Built-in Features**:
- Accept and Decline buttons
- Customizable text and styling
- Multiple placement options (top, bottom, none)
- Callback functions for user actions
- Cookie expiration settings
- Debug mode for development

✅ **Helper Functions**:
```javascript
import { Cookies, getCookieConsentValue } from "react-cookie-consent";

// Check if user has consented
const consentValue = getCookieConsentValue();
if (consentValue === "true") {
  registerServiceWorker();
}

// Reset consent (for settings page)
import { resetCookieConsentValue } from "react-cookie-consent";
resetCookieConsentValue();
```

✅ **Highly Customizable**:
- Custom styles
- Custom button text
- Custom container classes
- Accept on scroll option
- Custom cookie name

### Cons

❌ Some users report the styling is opinionated (but can be overridden)
❌ No built-in cookie category management (only accept/decline)

### Best For

✅ Your use case! Simple consent for Service Worker caching
✅ Projects that need basic accept/decline
✅ Teams that want fast implementation
✅ Apps that don't need granular cookie categories

---

## Option 2: vanilla-cookieconsent

### Overview

- **Package**: `vanilla-cookieconsent`
- **Size**: ~20KB
- **Framework**: Agnostic (works with any JS framework)
- **Maintained**: ✅ Active

### Pros

✅ **Framework Agnostic**: Not tied to React
✅ **Cookie Categories**: Built-in support for analytics, marketing, etc.
✅ **Advanced Features**: Modal dialogs, revision management
✅ **Highly Configurable**: Extensive customization options

### Cons

❌ **More Complex Setup**: Requires more configuration
❌ **Overkill for Simple Use**: Too feature-rich for just Service Worker consent
❌ **React Integration**: Requires wrapper component for React

### Example Integration

```javascript
import * as CookieConsent from 'vanilla-cookieconsent';

CookieConsent.run({
  categories: {
    necessary: {
      enabled: true,  // always enabled
      readOnly: true
    },
    performance: {
      enabled: false,  // Service Worker category
      autoClear: {
        cookies: [],
      }
    }
  },

  onAccept: (cookie) => {
    if (cookie.categories.includes('performance')) {
      registerServiceWorker();
    }
  }
});
```

### Best For

✅ Projects needing multiple cookie categories
✅ Complex consent management (analytics, marketing, etc.)
✅ Non-React projects
❌ Not ideal for your simple use case

---

## Option 3: CookieYes (Hosted Service)

### Overview

- **Type**: Hosted SaaS + Widget
- **Price**: Free tier (under 25K pageviews/month)
- **Setup**: Script injection

### Pros

✅ **Zero Code**: Just add a script tag
✅ **Auto Cookie Scanning**: Detects cookies automatically
✅ **Compliance Dashboard**: Audit logs and reports
✅ **Support**: Professional customer service
✅ **Google Consent Mode**: Built-in integration

### Cons

❌ **Monthly Cost**: Free tier very limited
❌ **External Dependency**: Relies on their servers
❌ **Privacy Concerns**: Third-party tracking
❌ **Overkill**: Too enterprise for simple Service Worker consent
❌ **Bundle Size**: Larger footprint

### Pricing

- **Free**: Under 100 pages, under 25K pageviews/month
- **Basic**: $10/month (up to 100K pageviews)
- **Pro**: $25/month (up to 500K pageviews)

### Best For

✅ Enterprise sites with complex compliance needs
✅ Teams without developer resources
✅ Sites using Google Analytics, GTM, ads
❌ Not recommended for your use case (overkill + external dependency)

---

## Option 4: Custom Build

### Overview

Build your own consent banner from scratch.

### Pros

✅ **Full Control**: Exactly what you need
✅ **Minimal Bundle**: Smallest possible footprint
✅ **No Dependencies**: No external libraries
✅ **Perfect Fit**: Tailored to your needs

### Cons

❌ **Time Investment**: 2-3 hours to build properly
❌ **Testing Required**: Need to test all edge cases
❌ **Maintenance**: You own the code
❌ **Compliance Risk**: Easy to miss GDPR requirements

### Implementation Effort

```typescript
// You'd need to build:
1. Banner UI component
2. Cookie storage logic
3. Cookie retrieval logic
4. Accept/Decline handlers
5. Expiration management
6. "Remember preference" logic
7. "Revoke consent" feature
8. Mobile responsive design
9. Accessibility features
10. Testing

Estimated: 2-3 hours for basic implementation
```

### Best For

❌ Not recommended - `react-cookie-consent` already does this perfectly

---

## Answering Your Questions

### Q1: "Do we need to store responses?"

**Answer**: Yes, but the library handles it automatically.

**How it works**:
```javascript
// react-cookie-consent stores in a cookie like:
// Name: CookieConsent
// Value: "true" (accepted) or "false" (declined)
// Expires: 365 days (configurable)

// You can customize:
<CookieConsent
  cookieName="kilalo-service-worker-consent"  // Custom name
  expires={365}  // Days until expiration
>
```

**Storage location**: Browser cookie (ironically, it uses a cookie to store cookie consent!)

**Why this is okay**: "Strictly necessary" cookies (like consent preference storage) don't require consent themselves.

### Q2: "What if they decline, how do we make sure we don't do it?"

**Answer**: Check the consent value before registering Service Worker.

**Implementation**:

```typescript
// components/CookieConsentBanner.tsx
'use client';

import CookieConsent, { getCookieConsentValue } from "react-cookie-consent";
import { useEffect } from "react";

export function CookieConsentBanner() {
  // On mount, check if consent already given
  useEffect(() => {
    const consentValue = getCookieConsentValue("kilalo-sw-consent");

    if (consentValue === "true") {
      // User previously accepted - register SW
      registerServiceWorker();
    }
    // If declined or not set, do nothing
  }, []);

  const handleAccept = () => {
    registerServiceWorker();
  };

  const handleDecline = () => {
    // Ensure Service Worker is NOT registered
    unregisterServiceWorker();
  };

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      declineButtonText="Decline"
      cookieName="kilalo-sw-consent"
      enableDeclineButton
      expires={365}
      onAccept={handleAccept}
      onDecline={handleDecline}
      style={{ background: "#2B373B" }}
      buttonStyle={{
        background: "#4CAF50",
        color: "white",
        fontSize: "13px"
      }}
      declineButtonStyle={{
        background: "#f44336",
        color: "white",
        fontSize: "13px"
      }}
    >
      We use caching to improve site performance for users on slow connections.
      {" "}
      <a href="/privacy" style={{ color: "#4CAF50" }}>
        Learn more
      </a>
    </CookieConsent>
  );
}

// Service Worker functions
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  }
}

function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister();
        });
      });
  }
}
```

**Key Points**:
1. ✅ Consent stored in cookie automatically
2. ✅ Check consent on app load (useEffect)
3. ✅ Only register SW if consent = "true"
4. ✅ Unregister SW if user declines
5. ✅ Banner only shows once (until expiration)

---

## Implementation Checklist

### Phase 1: Install & Basic Setup (15 mins)

- [ ] Install package: `npm install react-cookie-consent`
- [ ] Create `components/CookieConsentBanner.tsx` component
- [ ] Add banner to root layout (`app/layout.tsx`)
- [ ] Test banner appears on first visit

### Phase 2: Service Worker Integration (15 mins)

- [ ] Add `registerServiceWorker()` function
- [ ] Add `unregisterServiceWorker()` function
- [ ] Connect to `onAccept` callback
- [ ] Connect to `onDecline` callback
- [ ] Test SW registers only when accepted

### Phase 3: Persistence Check (10 mins)

- [ ] Add `useEffect` to check existing consent
- [ ] Register SW if consent previously given
- [ ] Test consent persists across page reloads
- [ ] Test consent persists across browser sessions

### Phase 4: Polish (10 mins)

- [ ] Customize banner text
- [ ] Style to match site theme
- [ ] Add link to privacy policy
- [ ] Test mobile responsive
- [ ] Test accessibility (keyboard navigation)

**Total Time**: ~50 minutes

---

## Example: Complete Implementation

Here's a complete, production-ready implementation:

```typescript
// components/CookieConsentBanner.tsx
'use client';

import CookieConsent, { getCookieConsentValue, Cookies } from "react-cookie-consent";
import { useEffect, useState } from "react";

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consentValue = getCookieConsentValue("kilalo-sw-consent");

    if (consentValue === "true") {
      // User accepted - register service worker
      registerServiceWorker();
      setShowBanner(false);
    } else if (consentValue === "false") {
      // User declined - make sure SW is not registered
      unregisterServiceWorker();
      setShowBanner(false);
    } else {
      // No choice made - show banner
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    console.log("User accepted caching");
    registerServiceWorker();
    setShowBanner(false);
  };

  const handleDecline = () => {
    console.log("User declined caching");
    unregisterServiceWorker();
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      declineButtonText="Decline"
      cookieName="kilalo-sw-consent"
      cookieValue="true"
      declineCookieValue="false"
      setDeclineCookie={true}
      enableDeclineButton
      flipButtons
      expires={365}
      onAccept={handleAccept}
      onDecline={handleDecline}
      containerClasses="fixed bottom-0 left-0 right-0 z-50"
      contentClasses="container py-4"
      buttonClasses="rounded-md bg-teal px-4 py-2 text-sm font-medium text-white hover:bg-teal/90"
      declineButtonClasses="rounded-md border border-muted-foreground px-4 py-2 text-sm font-medium hover:bg-muted"
      disableStyles={true}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">
            We use caching to make the site faster for users on slow connections.
            This improves your experience but is not required.
            {" "}
            <a href="/legal/privacy" className="underline">
              Learn more
            </a>
          </p>
        </div>
      </div>
    </CookieConsent>
  );
}

// Service Worker registration functions
async function registerServiceWorker() {
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered successfully:', registration.scope);

    // Optional: Check for updates
    registration.addEventListener('updatefound', () => {
      console.log('Service Worker update found');
    });
  } catch (error) {
    console.error('Service Worker registration failed:', error);
  }
}

async function unregisterServiceWorker() {
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      const success = await registration.unregister();
      if (success) {
        console.log('Service Worker unregistered successfully');
      }
    }

    // Clear caches
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('Service Worker caches cleared');
  } catch (error) {
    console.error('Service Worker unregistration failed:', error);
  }
}
```

```typescript
// app/layout.tsx
import { CookieConsentBanner } from '@/components/CookieConsentBanner'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <CookieConsentBanner />
      </body>
    </html>
  )
}
```

---

## Recommendation Summary

### Use: `react-cookie-consent`

**Why it's perfect for your use case**:

1. ✅ **Handles storage automatically** - No need to manually manage cookies
2. ✅ **Prevents action if declined** - Built-in callbacks for accept/decline
3. ✅ **Simple React integration** - Works perfectly with Next.js
4. ✅ **Free and lightweight** - No external dependencies or costs
5. ✅ **Well-maintained** - Active community and updates
6. ✅ **Fast implementation** - 30-45 minutes total
7. ✅ **GDPR compliant** - When used correctly

**Don't use**:
- ❌ CookieYes (overkill, costs money, external dependency)
- ❌ vanilla-cookieconsent (too complex for simple use case)
- ❌ Custom build (reinventing the wheel)

---

## Next Steps

Ready to implement? Here's what to do:

1. **Install package**:
   ```bash
   npm install react-cookie-consent
   ```

2. **Create banner component** (use example above)

3. **Add to root layout**

4. **Test the flow**:
   - Banner appears on first visit ✅
   - Accept registers Service Worker ✅
   - Decline prevents Service Worker ✅
   - Preference persists ✅
   - Banner doesn't show again ✅

5. **Add privacy policy section** (optional but recommended)

**Estimated total time**: 45-60 minutes including testing

Let me know when you're ready to implement!
