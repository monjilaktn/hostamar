import Link from 'next/link'
import { Film, MessageSquare, Subtitles, Search, PlayCircle, CheckCircle, Star } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-white">Hostamar</span>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-300 hover:text-white text-sm">লগইন</Link>
            <Link
              href="/signup"
              className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
            >
              রেজিস্টার
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 py-24 text-center">
        <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
          AI দিয়ে <span className="text-pink-400">বাংলা ভিডিও</span> বানান
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          শুধু একটি আইডিয়া দিন — Hostamar AI আপনার জন্য পূর্ণাঙ্গ ভিডিও তৈরি করে দেবে। 
          বাংলা ভাষায়, পেশাদার মানের।
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/signup"
            className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition shadow-lg shadow-pink-500/25"
          >
            ফ্রিতে শুরু করুন
          </Link>
          <Link
            href="/editor"
            className="border border-white/20 hover:border-white/40 text-white px-8 py-3 rounded-lg font-semibold text-lg transition"
          >
            ভিডিও তৈরি করুন →
          </Link>
        </div>
        <p className="text-gray-500 text-sm mt-4">কোনো ক্রেডিট কার্ড প্রয়োজন নেই • ফ্রি ৩ ক্রেডিট</p>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">সবকিছুই AI-চালিত</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Film, title: 'AI ভিডিও জেনারেশন', desc: 'যে কোনো টপিকে হাই-কোয়ালিটি ভিডিও তৈরি করুন' },
            { icon: MessageSquare, title: 'AI চ্যাট সহায়ক', desc: 'ভিডিও আইডিয়া নিয়ে AI-এর সাথে চ্যাট করুন' },
            { icon: Subtitles, title: 'অটো সাবটাইটেল', desc: 'বাংলা সাবটাইটেল স্বয়ংক্রিয়ভাবে জেনারেট করুন' },
            { icon: Search, title: 'স্মার্ট সার্চ', desc: 'AI দিয়ে ভিডিও কন্টেন্ট সার্চ করুন' },
            { icon: PlayCircle, title: 'প্রিভিউ জেনারেশন', desc: 'রেন্ডার করার আগে প্রিভিউ দেখুন' },
            { icon: Star, title: 'বাংলা ভাষা', desc: 'পূর্ণ বাংলা UI + কন্টেন্ট জেনারেশন' },
          ].map((f, i) => {
            const Icon = f.icon
            return (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-pink-500/30 transition">
                <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-pink-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-4">সহজ মূল্য</h2>
        <p className="text-gray-400 text-center mb-10">bKash / Nagad পেমেন্ট — ব্যাংক কার্ড প্রয়োজন নেই</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'স্টার্টার', price: '২৯৯', credits: '১০', popular: false },
            { name: 'গ্রোথ', price: '৬৯৯', credits: '৩০', popular: true },
            { name: 'প্রো', price: '১,৯৯৯', credits: '১০০', popular: false },
          ].map((pkg, i) => (
            <div
              key={i}
              className={`relative rounded-xl border-2 p-6 ${
                pkg.popular ? 'border-pink-500 bg-pink-500/5' : 'border-white/10 bg-white/5'
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-3 left-4 bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  জনপ্রিয়
                </span>
              )}
              <h3 className="text-xl font-bold text-white mb-1">{pkg.name}</h3>
              <p className="text-3xl font-bold text-pink-400 mb-3">৳{pkg.price}</p>
              <p className="text-gray-400 mb-4">
                <span className="text-white font-bold">{pkg.credits}</span>টি ভিডিও
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-400" /> AI ভিডিও জেনারেশন
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-400" /> অটো সাবটাইটেল
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-400" /> বাংলা ভাষা
                </li>
              </ul>
              <Link
                href={pkg.popular ? '/payment' : '/signup'}
                className={`block text-center rounded-lg py-2.5 text-sm font-medium transition ${
                  pkg.popular
                    ? 'bg-pink-600 hover:bg-pink-700 text-white'
                    : 'border border-white/20 hover:border-white/40 text-white'
                }`}
              >
                {pkg.popular ? 'এখনই কিনুন' : 'ফ্রি ট্রায়াল'}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">Hostamar © 2026 — AI ভিডিও জেনারেশন প্ল্যাটফর্ম</p>
        </div>
      </footer>
    </div>
  )
}
