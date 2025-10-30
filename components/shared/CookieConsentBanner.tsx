'use client'

import CookieConsent, { getCookieConsentValue } from 'react-cookie-consent'
import { useEffect, useState } from 'react'

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const consentValue = getCookieConsentValue('kilalo-sw-consent')

    if (consentValue === 'true') {
      // User accepted - register service worker
      registerServiceWorker()
      setShowBanner(false)
    } else if (consentValue === 'false') {
      // User declined - make sure SW is not registered
      unregisterServiceWorker()
      setShowBanner(false)
    } else {
      // No choice made - show banner
      setShowBanner(true)
    }
  }, [])

  const handleAccept = () => {
    console.log('User accepted caching')
    registerServiceWorker()
    setShowBanner(false)
  }

  const handleDecline = () => {
    console.log('User declined caching')
    unregisterServiceWorker()
    setShowBanner(false)
  }

  if (!showBanner) return null

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
            We use caching to make the site faster for users on slow connections. This improves
            your experience but is not required.{' '}
            <a href="/legal/privacy" className="underline hover:text-foreground">
              Learn more
            </a>
          </p>
        </div>
      </div>
    </CookieConsent>
  )
}

// Service Worker registration functions
async function registerServiceWorker() {
  if (typeof window === 'undefined') return
  if (!('serviceWorker' in navigator)) return

  try {
    const registration = await navigator.serviceWorker.register('/sw.js')
    console.log('Service Worker registered successfully:', registration.scope)

    // Optional: Check for updates
    registration.addEventListener('updatefound', () => {
      console.log('Service Worker update found')
    })
  } catch (error) {
    console.error('Service Worker registration failed:', error)
  }
}

async function unregisterServiceWorker() {
  if (typeof window === 'undefined') return
  if (!('serviceWorker' in navigator)) return

  try {
    const registrations = await navigator.serviceWorker.getRegistrations()
    for (const registration of registrations) {
      const success = await registration.unregister()
      if (success) {
        console.log('Service Worker unregistered successfully')
      }
    }

    // Clear caches
    const cacheNames = await caches.keys()
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))
    console.log('Service Worker caches cleared')
  } catch (error) {
    console.error('Service Worker unregistration failed:', error)
  }
}
