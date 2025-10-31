'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import DeleteAccountModal from './DeleteAccountModal'

interface DangerZoneProps {
  locale: string
}

export default function DangerZone({ locale }: DangerZoneProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  return (
    <>
      <div className="rounded-lg border-2 border-red-200 bg-red-50 p-6">
        <h2 className="mb-2 text-xl font-semibold text-red-900">Danger Zone</h2>
        <p className="mb-4 text-sm text-red-700">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-red-900">Delete Account</p>
            <p className="text-xs text-red-600">
              Permanently remove your account and all associated data
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsDeleteModalOpen(true)}
            className="border-red-300 text-red-700 hover:bg-red-100 hover:text-red-900"
          >
            Delete Account
          </Button>
        </div>
      </div>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        locale={locale}
      />
    </>
  )
}
