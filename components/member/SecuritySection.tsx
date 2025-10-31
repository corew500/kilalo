'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import ChangePasswordModal from './ChangePasswordModal'

export default function SecuritySection() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

  return (
    <>
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Security</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Password</p>
            <p className="text-xs text-gray-500">Change your account password</p>
          </div>
          <Button variant="outline" onClick={() => setIsPasswordModalOpen(true)}>
            Change Password
          </Button>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </>
  )
}
