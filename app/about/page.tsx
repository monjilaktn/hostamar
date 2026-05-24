import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Cloud, Video, Users, Zap, Shield, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'আমাদের সম্পর্কে - Hostamar',
  description: 'Hostamar সম্পর্কে আরও জানুন - আপনার সর্ব-এক-ই প্ল্যাটফর্ম।',
};

export default function AboutPage() {
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

      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Hostamar সম্পর্কে
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-16">
          আমরা একটি সর্ব-এক-ই প্ল্যাটফর্ম তৈরি করছি যা ক্লাউড হোস্টিং, এআই মার্কেটিং, গেমিং এবং ডেভেলপমেন্ট টুলসকে এক ছাদের নিচে নিয়ে আসে।
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Cloud className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">ক্লাউড হোস্টিং</h3>
            <p className="text-gray-400">নির্ভরযোগ্য VPS, RDP এবং ওয়েব হোস্টিং ৯৯.৯% আপটাইম গ্যারান্টি সহ।</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">এআই মার্কেটিং</h3>
            <p className="text-gray-400">এআই-চালিত টুলস দিয়ে স্বয়ংক্রিয়ভাবে পেশাদার মার্কেটিং ভিডিও তৈরি করুন।</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">এআই টুলস</h3>
            <p className="text-gray-400">ফ্রি এআই চ্যাট, বুদ্ধিমান ব্রাউজার এবং ক্লাউড ডেভেলপমেন্ট এনভায়রনমেন্ট।</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-16">
          <h2 className="text-3xl font-bold mb-4">আমাদের লক্ষ্য</h2>
          <p className="text-lg opacity-90 mb-8">
            আমরা বিশ্বাস করি প্রত্যেকেরই তাদের অনলাইন উপস্থিতি তৈরি, কন্টেন্ট তৈরি এবং সফটওয়্যার ডেভেলপমেন্টের জন্য শক্তিশালী টুলস পাওয়ার অধিকার রয়েছে। Hostamar এটিকে সহজ, সাশ্রয়ী এবং অ্যাক্সেসযোগ্য করে তোলে।
          </p>
          <Link href="/signup" className="inline-block px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition">
            বিনামূল্যে শুরু করুন →
          </Link>
        </div>
      </section>

      <footer className="container mx-auto px-4 py-8 border-t border-white/10 text-center text-sm text-gray-500">
        <p>© ২০২৬ Hostamar.com. সর্বস্বত্ব সংরক্ষিত।</p>
      </footer>
    </div>
  );
}
