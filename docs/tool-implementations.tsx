// app/tools/json-formatter/page.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Alert } from '@/components/ui/Alert'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Copy, Check, Download } from 'lucide-react'
import toast from 'react-hot-toast'

export default function JSONFormatterPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [indentSize, setIndentSize] = useState(2)

  const formatJSON = () => {
    try {
      setError('')
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, indentSize)
      setOutput(formatted)
      toast.success('JSON formatted successfully')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON')
      setOutput('')
    }
  }

  const minifyJSON = () => {
    try {
      setError('')
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
      toast.success('JSON minified successfully')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON')
      setOutput('')
    }
  }

  const copyToClipboard = async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      toast.success('Copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  const downloadJSON = () => {
    if (!output) return
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(output))
    element.setAttribute('download', 'formatted.json')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success('JSON downloaded')
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <div className="section-py border-b border-slate-200 dark:border-slate-800">
        <div className="container-md mx-auto section-px space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">JSON Formatter</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Format, validate, and minify JSON in seconds
            </p>
          </div>
          <Badge variant="success">Free Tool</Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="section-py">
        <div className="container-md mx-auto section-px">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Input</h2>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={'{\n  "name": "John",\n  "age": 30\n}'}
                className="font-mono h-96"
              />
              {error && <Alert type="error">{error}</Alert>}
            </div>

            {/* Output */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Output</h2>
              <Textarea
                value={output}
                readOnly
                placeholder="Formatted output will appear here"
                className="font-mono h-96"
              />
              {output && (
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    onClick={copyToClipboard}
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Download className="w-4 h-4" />}
                    onClick={downloadJSON}
                  >
                    Download
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="number"
                label="Indent Size"
                value={indentSize}
                onChange={(e) => setIndentSize(parseInt(e.target.value) || 2)}
                min="1"
                max="8"
              />
            </div>

            <div className="flex gap-4">
              <Button onClick={formatJSON} variant="primary">
                Format JSON
              </Button>
              <Button onClick={minifyJSON} variant="secondary">
                Minify JSON
              </Button>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-12 space-y-4">
            <h2 className="text-2xl font-bold">FAQ</h2>
            {[
              {
                q: 'Is my JSON data stored?',
                a: 'No, all processing happens in your browser. Your data never leaves your device.',
              },
              {
                q: 'What is JSON?',
                a: 'JSON (JavaScript Object Notation) is a lightweight data format used for data exchange between systems.',
              },
              {
                q: 'Can I use this offline?',
                a: 'Yes! You can save this page and use it offline in your browser.',
              },
            ].map((faq, i) => (
              <details key={i} className="card p-4 cursor-pointer">
                <summary className="font-semibold">{faq.q}</summary>
                <p className="mt-3 text-slate-600 dark:text-slate-400">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// app/tools/image-compressor/page.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { Badge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/Select'
import { formatBytes } from '@/lib/utils/format'
import { Upload, Download } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ImageCompressorPage() {
  const [file, setFile] = useState<File | null>(null)
  const [quality, setQuality] = useState(80)
  const [format, setFormat] = useState('webp')
  const [compressed, setCompressed] = useState<string | null>(null)
  const [originalSize, setOriginalSize] = useState(0)
  const [compressedSize, setCompressedSize] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      toast.error('File size must be less than 50MB')
      return
    }

    setFile(selectedFile)
    setOriginalSize(selectedFile.size)
    setCompressed(null)
  }

  const compressImage = async () => {
    if (!file) {
      toast.error('Please select an image first')
      return
    }

    setIsProcessing(true)
    try {
      // Read file as data URL
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = document.createElement('img')
        img.onload = () => {
          // Create canvas
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          if (!ctx) return

          // Set canvas dimensions
          canvas.width = img.width
          canvas.height = img.height

          // Draw and compress
          ctx.drawImage(img, 0, 0)

          // Convert to blob
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                toast.error('Failed to compress image')
                setIsProcessing(false)
                return
              }

              setCompressedSize(blob.size)
              const url = URL.createObjectURL(blob)
              setCompressed(url)
              setIsProcessing(false)
              toast.success('Image compressed successfully!')
            },
            `image/${format}`,
            quality / 100
          )
        }
        img.src = event.target?.result as string
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Compression error:', error)
      toast.error('Failed to compress image')
      setIsProcessing(false)
    }
  }

  const downloadCompressed = () => {
    if (!compressed) return

    const link = document.createElement('a')
    link.href = compressed
    link.download = `compressed.${format}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Image downloaded')
  }

  const savings = originalSize && compressedSize
    ? (((originalSize - compressedSize) / originalSize) * 100).toFixed(1)
    : 0

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <div className="section-py border-b border-slate-200 dark:border-slate-800">
        <div className="container-md mx-auto section-px space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Image Compressor</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Compress images without losing quality
            </p>
          </div>
          <Badge variant="success">Free Tool</Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="section-py">
        <div className="container-md mx-auto section-px">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* File Upload */}
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg p-8 text-center cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="block cursor-pointer space-y-3">
                <Upload className="w-12 h-12 mx-auto text-slate-400" />
                <div>
                  <p className="font-semibold">Drop your image here</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    or click to select (max 50MB)
                  </p>
                </div>
              </label>
            </div>

            {/* File Info */}
            {file && (
              <Alert type="info">
                <p className="font-semibold">{file.name}</p>
                <p className="text-sm mt-1">
                  Size: {formatBytes(originalSize)}
                </p>
              </Alert>
            )}

            {/* Settings */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="range"
                  label={`Quality: ${quality}%`}
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  min="10"
                  max="100"
                  step="10"
                />
                <Select
                  label="Format"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  options={[
                    { value: 'webp', label: 'WebP (Recommended)' },
                    { value: 'jpeg', label: 'JPEG' },
                    { value: 'png', label: 'PNG' },
                  ]}
                />
              </div>

              <Button
                onClick={compressImage}
                variant="primary"
                disabled={!file || isProcessing}
                isLoading={isProcessing}
              >
                {isProcessing ? 'Compressing...' : 'Compress Image'}
              </Button>
            </div>

            {/* Results */}
            {compressed && (
              <div className="space-y-4">
                <Alert type="success">
                  <p className="font-semibold">Compression Complete!</p>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>Original: {formatBytes(originalSize)}</p>
                    <p>Compressed: {formatBytes(compressedSize)}</p>
                    <p className="font-semibold text-green-700 dark:text-green-300">
                      Saved {savings}%
                    </p>
                  </div>
                </Alert>

                <img
                  src={compressed}
                  alt="Compressed preview"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800"
                />

                <Button
                  onClick={downloadCompressed}
                  variant="primary"
                  icon={<Download className="w-4 h-4" />}
                >
                  Download Compressed Image
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
