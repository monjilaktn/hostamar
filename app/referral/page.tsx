'use client'

import { useState, useEffect } from 'react'
import { Copy, Check, Share2, Gift, Users } from 'lucide-react'

export default function ReferralPage() {
  const [data, setData] = useState({ referralCode: '', referralUrl: '', referralBonus: 0, referralCount: 0 })
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('/api/referral')
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.referralUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Hostamar - AI Video Platform',
          text: 'Join Hostamar and get 5 free video credits! Use my referral link:',
          url: data.referralUrl,
        })
      } catch {}
    } else {
      handleCopy()
    }
  }

  const bonusAmount = data.referralBonus || 0
  const completedReferrals = data.referralCount || 0

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-pink-500/20 flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-pink-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">বন্ধুদের আমন্ত্রণ জানান</h1>
          <p className="text-gray-400">প্রত্যেক বন্ধুর জন্য <strong className="text-pink-400">৫টি ফ্রি ক্রেডিট</strong></p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <Users className="w-5 h-5 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{completedReferrals}</p>
            <p className="text-xs text-gray-400">সফল রেফারেল</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <Gift className="w-5 h-5 text-pink-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-pink-400">{bonusAmount}</p>
            <p className="text-xs text-gray-400">বোনাস ক্রেডিট</p>
          </div>
        </div>

        {/* Referral Link */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
          <p className="text-sm text-gray-400 mb-2">আপনার রেফারেল লিংক</p>
          <div className="flex items-center gap-2 bg-white/5 rounded-lg border border-white/10 p-3">
            <code className="flex-1 text-sm text-white font-mono truncate">
              {loading ? '...' : data.referralUrl}
            </code>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded hover:bg-white/10 transition"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
            </button>
          </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-400 mb-1">অথবা রেফারেল কোড</label>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-lg text-center font-bold text-pink-400 bg-white/5 rounded-lg border border-white/10 py-2">
                {loading ? '...' : data.referralCode}
              </code>
              <button
                onClick={() => {
                  if (data.referralCode) {
                    navigator.clipboard.writeText(data.referralCode)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                  }
                }}
                className="p-2 rounded hover:bg-white/10 transition"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 mb-4"
        >
          <Share2 className="w-4 h-4" />
          শেয়ার করুন
        </button>

        {/* How it works */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-3">কিভাবে কাজ করে?</h3>
          <ol className="space-y-3 text-sm text-gray-400">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-pink-500/10 text-pink-400 flex items-center justify-center text-xs font-bold shrink-0">১</span>
              আপনার রেফারেল লিংক বন্ধুদের সাথে শেয়ার করুন
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-pink-500/10 text-pink-400 flex items-center justify-center text-xs font-bold shrink-0">২</span>
              তারা রেজিস্টার করলে <strong className="text-pink-400">৫টি ফ্রি ক্রেডিট</strong> পাবে
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-pink-500/10 text-pink-400 flex items-center justify-center text-xs font-bold shrink-0">৩</span>
              আপনিও <strong className="text-pink-400">৫টি ক্রেডিট</strong> বোনাস পাবেন
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-pink-500/10 text-pink-400 flex items-center justify-center text-xs font-bold shrink-0">৪</span>
              বন্ধু যখন প্রথম পেমেন্ট করবে, আপনি আরও <strong className="text-pink-400">১০টি ক্রেডিট</strong> পাবেন
            </li>
          </ol>
        </div>
      </div>
    </main>
  )
}
