'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteAccount } from '@/app/[locale]/(member)/settings/actions'
import { Button } from '@/components/ui/button'
import { X, AlertTriangle } from 'lucide-react'

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
  locale: string
}

export default function DeleteAccountModal({ isOpen, onClose, locale }: DeleteAccountModalProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  if (!isOpen) return null

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      setMessage({ type: 'error', text: 'Please type DELETE to confirm' })
      return
    }

    setIsDeleting(true)
    setMessage(null)

    try {
      const result = await deleteAccount()

      if (result.success) {
        setMessage({ type: 'success', text: 'Account deleted successfully' })
        // Redirect to home page after short delay
        setTimeout(() => {
          router.push(`/${locale}`)
        }, 1500)
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to delete account' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-900">Delete Account</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isDeleting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 space-y-3">
          <p className="text-sm text-gray-700">
            This action <strong>cannot be undone</strong>. This will permanently delete your account
            and remove all your data from our servers.
          </p>

          <div className="rounded-md bg-red-50 p-3">
            <p className="text-sm font-medium text-red-800">Warning:</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-red-700">
              <li>Your profile will be permanently deleted</li>
              <li>All your connections and enrollments will be removed</li>
              <li>You will be immediately signed out</li>
            </ul>
          </div>

          <div>
            <label htmlFor="confirmText" className="block text-sm font-medium text-gray-700">
              Type <strong>DELETE</strong> to confirm
            </label>
            <input
              type="text"
              id="confirmText"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              disabled={isDeleting}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 disabled:opacity-50 sm:text-sm"
            />
          </div>
        </div>

        {message && (
          <div
            className={`mb-4 rounded-lg p-3 text-sm ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting || confirmText !== 'DELETE'}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? 'Deleting...' : 'Delete Account'}
          </Button>
        </div>
      </div>
    </div>
  )
}
