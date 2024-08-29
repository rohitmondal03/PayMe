"use client"

import { useFormStatus } from 'react-dom'

import { Button } from '../ui/button'

export function GenerateQrCodeButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type='submit'
      className="w-full"
      disabled={pending}
    >
      {pending ? (
        <p>Generating...</p>
      ) : (
        <p>Generate QR Code</p>
      )}
    </Button>
  )
}
