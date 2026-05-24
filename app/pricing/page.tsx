import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'মূল্য তালিকা - Hostamar',
  description: 'আপনার সব প্রয়োজন অনুযায়ী সহজ এবং স্বচ্ছ মূল্য তালিকা।',
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-white/5 rounded-lg transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Hostamar.com
          </div>
        </nav>
      </header>

      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            সহজ মূল্য তালিকা
          </h1>
          <p className="text-xl text-gray-400">৭ দিনের ফ্রি ট্রায়াল। ক্রেডিট কার্ডের প্রয়োজন নেই।</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="text-sm font-semibold text-blue-400 mb-2">স্টার্টার</div>
            <div className="text-4xl font-bold mb-4">৳2,000<span className="text-lg text-gray-500">/মাস</span></div>
            <ul className="space-y-3 mb-8 text-sm text-gray-300">
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-400 mt-0.5" /> ওয়েব হোস্টিং (৫ জিবি)</li>
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-400 mt-0.5" /> ১০টি ভিডিও/মাস</li>
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-400 mt-0.5" /> ফ্রি SSL</li>
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-400 mt-0.5" /> ইমেইল সাপোর্ট</li>
            </ul>
            <Link href="/signup?plan=starter" className="block w-full py-3 text-center bg-white/10 text-white rounded-lg hover:bg-white/20 transition">
              ট্রায়াল শুরু করুন
            </Link>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-8 rounded-2xl shadow-xl transform scale-105 border border-purple-400/20">
            <div className="text-sm font-semibold mb-2 opacity-90">বিজনেস</div>
            <div className="text-4xl font-bold mb-4">৳3,500<span className="text-lg opacity-75">/মাস</span></div>
            <ul className="space-y-3 mb-8 text-sm">
              <li className="flex items-start gap-2"><Check className="w-4 h-4 mt-0.5" /> VPS (২ CPU, ৪ জিবি RAM)</li>
              <li className="flex items-start gap-2"><Check className="w-4 h-4 mt-0.5" /> ২০টি ভিডিও/মাস</li>
              <li className="flex items-start gap-2"><Check className="w-4 h-4 mt-0.5" /> কাস্টম টপিক</li>
              <li className="flex items-start gap-2"><Check className="w-4 h-4 mt-0.5" /> অগ্রাধিকার সাপোর্ট</li>
              <li className="flex items-start gap-2"><Check className="w-4 h-4 mt-0.5" /> সোশ্যাল শিডিউলার</li>
            </ul>
            <Link href="/signup?plan=business" className="block w-full py-3 text-center bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition font-semibold">
              ট্রায়াল শুরু করুন →
            </Link>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="text-sm font-semibold text-purple-400 mb-2">এন্টারপ্রাইজ</div>
            <div className="text-4xl font-bold mb-4">৳6,000<span className="text-lg text-gray-500">/মাস</span></div>
            <ul className="space-y-3 mb-8 text-sm text-gray-300">
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-400 mt-0.5" /> VPS (৪ CPU, ৮ জিবি RAM)</li>
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-400 mt-0.5" /> আনলিমিটেড ভিডিও</li>
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-400 mt-0.5" /> কাস্টম ব্র্যান্ডিং</li>
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-400 mt-0.5" /> ২৪/৭ সাপোর্ট</li>
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-400 mt-0.5" /> আমরা আপনার জন্য পোস্ট করি</li>
            </ul>
            <Link href="/signup?plan=enterprise" className="block w-full py-3 text-center bg-white/10 text-white rounded-lg hover:bg-white/20 transition">
              ট্রায়াল শুরু করুন
            </Link>
          </div>
        </div>
      </section>

      <footer className="container mx-auto px-4 py-8 border-t border-white/10 text-center text-sm text-gray-500">
        <p>© ২০২৬ Hostamar.com. সর্বস্বত্ব সংরক্ষিত।</p>
      </footer>
    </div>
  );
}
