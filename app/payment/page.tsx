'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Copy, Check, Loader2, ExternalLink } from 'lucide-react'

const BKASH_NUMBER = '01822417463'
const BKASH_REF = 'HOSTAMAR'

const PACKAGES = [
  { id: 'starter', name: 'স্টার্টার', credits: 10, price: 299 },
  { id: 'growth', name: 'গ্রোথ', credits: 30, price: 699, popular: true },
  { id: 'pro', name: 'প্রো', credits: 100, price: 1999 },
]

export default function BuyCreditsPage() {
  const router = useRouter()
  const [selected, setSelected] = useState('growth')
  const [trxId, setTrxId] = useState('')
  const [senderNumber, setSenderNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [copied, setCopied] = useState(false)

  const pkg = PACKAGES.find(p => p.id === selected)!

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!trxId.trim()) {
      setError('bKash TrxID দিন')
      return
    }
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/payment/bkash-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package: selected,
          amount: pkg.price,
          bkashNumber: BKASH_NUMBER,
          trxId: trxId.trim(),
          senderNumber: senderNumber.trim(),
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess(true)
        setTrxId('')
        setSenderNumber('')
      } else {
        setError(data.error || 'পেমেন্ট যাচাই করতে সমস্যা হয়েছে')
      }
    } catch {
      setError('সার্ভার সংযোগ ব্যর্থ')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-xl border border-green-500/30 bg-gray-800 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">✅</div>
          <h1 className="text-2xl font-bold text-white mb-2">পেমেন্ট সাবমিট হয়েছে!</h1>
          <p className="text-gray-400 mb-2">
            <span className="text-green-400 font-bold">{pkg.credits}</span> ক্রেডিট যোগ হবে
          </p>
          <p className="text-gray-500 text-sm mb-6">
            অ্যাডমিন যাচাই করার পর স্বয়ংক্রিয়ভাবে ক্রেডিট যোগ হবে (২৪ ঘন্টার মধ্যে)
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            ড্যাশবোর্ডে যান
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">ক্রেডিট কিনুন</h1>
          <p className="text-gray-400">bKash Personal-এর মাধ্যমে পেমেন্ট করুন</p>
        </div>

        {/* Package Selection */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {PACKAGES.map(pkg => (
            <button
              key={pkg.id}
              onClick={() => setSelected(pkg.id)}
              className={`relative rounded-xl border-2 p-5 text-left transition-all ${
                selected === pkg.id
                  ? 'border-pink-500 bg-pink-500/10 shadow-lg shadow-pink-500/20'
                  : 'border-gray-700 bg-gray-800 hover:border-gray-600'
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-3 left-4 bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  জনপ্রিয়
                </span>
              )}
              <h3 className="text-lg font-bold text-white mb-1">{pkg.name}</h3>
              <p className="text-2xl font-bold text-pink-400 mb-2">৳{pkg.price}</p>
              <p className="text-gray-400 text-sm">
                <span className="text-white font-semibold">{pkg.credits}</span> ভিডিও ক্রেডিট
              </p>
            </button>
          ))}
        </div>

        {/* bKash Instructions */}
        <div className="rounded-xl border-2 border-pink-500/30 bg-pink-500/5 p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">💳</span> bKash Personal-এ পেমেন্ট করুন
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10">
              <div>
                <p className="text-xs text-gray-400">bKash Agent Number</p>
                <p className="text-xl font-bold text-white">{BKASH_NUMBER}</p>
              </div>
              <button
                onClick={() => handleCopy(BKASH_NUMBER)}
                className="p-2 rounded-lg hover:bg-white/10 transition"
              >
                {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-gray-400" />}
              </button>
            </div>

            <div className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10">
              <div>
                <p className="text-xs text-gray-400">রেফারেন্স</p>
                <p className="text-lg font-bold text-white">{BKASH_REF}</p>
              </div>
              <button
                onClick={() => handleCopy(BKASH_REF)}
                className="p-2 rounded-lg hover:bg-white/10 transition"
              >
                {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-gray-400" />}
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              আপনার bKash অ্যাপ থেকে <strong className="text-white">Send Money</strong> → উপরের নম্বরে টাকা পাঠান।
              রেফারেন্স হিসেবে <strong className="text-white">{BKASH_REF}</strong> লিখুন। তারপর নিচে TrxID দিন।
            </p>
          </div>
        </div>

        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">প্যাকেজ</p>
              <p className="text-lg font-bold text-white">{pkg.name}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">পরিমাণ</p>
              <p className="text-lg font-bold text-pink-400">৳{pkg.price}</p>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              bKash TrxID <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={trxId}
              onChange={e => setTrxId(e.target.value)}
              required
              placeholder="TrxID উদাহরণ: A7B8C9D0E1F2G3H4"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              আপনার bKash নম্বর (ঐচ্ছিক)
            </label>
            <input
              type="text"
              value={senderNumber}
              onChange={e => setSenderNumber(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !trxId.trim()}
            className="w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                যাচাই হচ্ছে...
              </>
            ) : (
              `পেমেন্ট সাবমিট করুন — ৳${pkg.price}`
            )}
          </button>

          <p className="text-xs text-gray-500 text-center">
            অ্যাডমিন manually TrxID যাচাই করার পর ক্রেডিট যোগ হবে (সাধারণত ২৪ ঘন্টার মধ্যে)
          </p>
        </form>
      </div>
    </main>
  )
}
