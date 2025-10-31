'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'

interface LanguagePreferenceProps {
  currentLocale: string
}

export default function LanguagePreference({ currentLocale }: LanguagePreferenceProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChanging, setIsChanging] = useState(false)

  const handleLanguageChange = async (newLocale: string) => {
    if (newLocale === currentLocale) return

    setIsChanging(true)

    // Replace locale in pathname
    const newPathname = pathname.replace(`/${currentLocale}`, `/${newLocale}`)

    // Navigate to new locale
    router.push(newPathname)
    router.refresh()
  }

  return (
    <div>
      <label htmlFor="language" className="block text-sm font-medium text-gray-700">
        Language
      </label>
      <select
        id="language"
        value={currentLocale}
        onChange={(e) => handleLanguageChange(e.target.value)}
        disabled={isChanging}
        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-teal focus:outline-none focus:ring-teal disabled:opacity-50 sm:text-sm"
      >
        <option value="en">English</option>
        <option value="fr">Français</option>
      </select>
      {isChanging && <p className="mt-1 text-xs text-gray-500">Switching language...</p>}
    </div>
  )
}
