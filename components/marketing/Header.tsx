'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function Header() {
  const t = useTranslations('Navigation')
  const locale = useLocale()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: t('home'), href: `/${locale}` },
    { name: t('about'), href: `/${locale}/about` },
    { name: t('programs'), href: `/${locale}/programs` },
    { name: t('services'), href: `/${locale}/services` },
    { name: t('ventures'), href: `/${locale}/ventures` },
    { name: t('community'), href: `/${locale}/community` },
    { name: t('contact'), href: `/${locale}/contact` },
  ]

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'fr' : 'en'
    const currentPath = window.location.pathname.replace(`/${locale}`, '')
    window.location.href = `/${newLocale}${currentPath}`
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-teal">kilalo</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-teal"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {/* Auth buttons - Desktop */}
          <div className="hidden md:flex md:items-center md:gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/${locale}/login`}>{t('login')}</Link>
            </Button>
            <Button size="sm" className="bg-orange hover:bg-orange/90" asChild>
              <Link href={`/${locale}/signup`}>{t('signup')}</Link>
            </Button>
          </div>

          {/* Language switcher */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLocale}
            className="hidden sm:flex"
            aria-label={locale === 'en' ? 'Switch to French' : 'Switch to English'}
            aria-current={locale === 'en' ? 'true' : 'false'}
          >
            {locale === 'en' ? 'FR' : 'EN'}
          </Button>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t md:hidden">
          <div className="container space-y-1 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col gap-2 border-t pt-4">
              <Button variant="ghost" size="sm" asChild className="w-full">
                <Link href={`/${locale}/login`} onClick={() => setMobileMenuOpen(false)}>
                  {t('login')}
                </Link>
              </Button>
              <Button size="sm" className="w-full bg-orange hover:bg-orange/90" asChild>
                <Link href={`/${locale}/signup`} onClick={() => setMobileMenuOpen(false)}>
                  {t('signup')}
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLocale}
                className="w-full"
                aria-label={locale === 'en' ? 'Switch to French' : 'Switch to English'}
                aria-current={locale === 'en' ? 'true' : 'false'}
              >
                {locale === 'en' ? 'Français' : 'English'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
