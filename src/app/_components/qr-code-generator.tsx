"use client"

import Image from 'next/image'
import { useState, useRef, useCallback } from 'react'
import { Copy, Download } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QrCodeWithLogo from 'qrcode-with-logos'

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"


export default function QrCodeGenerator() {
  const [qrCode, setQrCode] = useState<string>()
  const [error, setError] = useState<string>()
  const [payment, setPayment] = useState({
    upiId: "",
    amount: ""
  })
  const [darkMode, setDarkMode] = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLImageElement | undefined>();


  const generateQRCode = useCallback(() => {
    const { amount, upiId } = payment;

    if (!upiId || !amount) {
      setError('Please enter both UPI ID and amount.')
      setQrCode('')
      return
    }

    if (!/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiId)) {
      setError('Invalid UPI ID format.')
      setQrCode('')
      return
    }

    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount.')
      setQrCode('')
      return
    }

    const upiUrl = `upi://pay?pa=${upiId}&am=${amount}&cu=INR`

    const qrcode = new QrCodeWithLogo({
      content: upiUrl,
      width: 380,
      image: ref.current,
      // logo: {
      //   src: 'https://avatars1.githubusercontent.com/u/rohitmondal03?s=460&v=4'
      // },
      cornersOptions: {
        radius: 15,
        type: "rounded"
      },
      dotsOptions: {
        type: "rounded"
      }
    })

    void qrcode.getCanvas().then((canvas) => {
      const src = canvas.toDataURL()
      setQrCode(src);
    })

    setError('');

    console.log("rendered")
  }, [payment])

  const copyToClipboard = () => {
    void navigator.clipboard.writeText(qrCode ?? "").then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code') as unknown as SVGElement
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new window.Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.download = 'upi-qr-code.png'
      downloadLink.href = pngFile
      downloadLink.click()
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }


  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${darkMode ? 'from-gray-900 to-gray-800' : 'from-blue-100 to-purple-200'} p-4`}>
      <Card className="w-full max-w-md">
        <CardHeader className="relative">
          <div className="absolute right-4 top-4">
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
              className="data-[state=checked]:bg-slate-700"
            />
            <span className="sr-only">Toggle dark mode</span>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">UPI QR Code Generator</CardTitle>
          <CardDescription>Generate a QR code for UPI payments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="upi-id">UPI ID</Label>
            <Input
              id="upi-id"
              placeholder="yourname@upi"
              value={payment.upiId}
              onChange={(e) => setPayment(prev => ({
                ...prev,
                upiId: e.target.value,
              }))}
              autoComplete='off'
              className="bg-transparent border-gray-300 dark:border-gray-700"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (INR)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={payment.amount}
              onChange={(e) => setPayment(prev => ({
                ...prev,
                amount: e.target.value,
              }))}
              autoComplete='off'
              className="bg-transparent border-gray-300 dark:border-gray-700"
            />
          </div>
          <Button
            onClick={generateQRCode}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
          >
            Generate QR Code
          </Button>
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-500 text-sm"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <AnimatePresence>
            {qrCode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center"
              >
                <Image
                  // @ts-expect-error "giving null error of ref"
                  ref={ref}
                  width={200}
                  height={200}
                  alt='qr code'
                  src={qrCode}
                  className='mx-auto'
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  Scan this QR code with any UPI to pay
                </p>
                <div className="mt-4 flex space-x-2">
                  <Button onClick={copyToClipboard} variant="outline" size="sm">
                    {copied ? 'Copied!' : 'Copy Link'}
                    <Copy className="ml-2 h-4 w-4" />
                  </Button>
                  <Button onClick={downloadQRCode} variant="outline" size="sm">
                    Download QR
                    <Download className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardFooter>
      </Card>
    </div>
  )
}