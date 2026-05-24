'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const PACKAGES = [
  { id: 'starter', name: 'Starter', credits: 10, price: 299, popular: false },
  { id: 'growth', name: 'Growth', credits: 30, price: 699, popular: true },
  { id: 'pro', name: 'Professional', credits: 100, price: 1999, popular: false },
]

export default function BuyCreditsPage() {
  const router = useRouter()
  const [selected, setSelected] = useState('growth')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handlePurchase() {
    setLoading(true)
    setError('')
    try {
      const pkg = PACKAGES.find(p => p.id === selected)
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ package: selected, amount: pkg?.price }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Failed to create order')
      }
    } catch {
      setError('Payment service unavailable')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-3">Buy Credits</h1>
          <p className="text-gray-400">Purchase credits to generate AI videos</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {PACKAGES.map(pkg => (
            <button
              key={pkg.id}
              onClick={() => setSelected(pkg.id)}
              className={`relative rounded-xl border-2 p-6 text-left transition-all ${
                selected === pkg.id
                  ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                  : 'border-gray-700 bg-gray-800 hover:border-gray-600'
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-3 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  POPULAR
                </span>
              )}
              <h3 className="text-xl font-bold text-white mb-1">{pkg.name}</h3>
              <p className="text-3xl font-bold text-blue-400 mb-3">
                ৳{pkg.price}
              </p>
              <p className="text-gray-400">
                <span className="text-white font-semibold">{pkg.credits}</span> video credits
              </p>
              <p className="text-xs text-gray-500 mt-2">~{pkg.credits} videos</p>
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <div className="text-center">
          <button
            onClick={handlePurchase}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-10 py-3 rounded-lg transition text-lg"
          >
            {loading ? 'Redirecting to SSLCOMMERZ...' : `Buy Now — ৳${PACKAGES.find(p => p.id === selected)?.price}`}
          </button>
          <p className="text-xs text-gray-500 mt-3">
            Secure payment via SSLCOMMERZ (bKash, Nagad, Cards)
          </p>
        </div>
      </div>
    </main>
  )
}
