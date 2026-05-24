import Link from 'next/link'
import { Calendar, Clock } from 'lucide-react'

const posts = [
  {
    slug: 'ai-video-bangladesh',
    title: 'AI দিয়ে বাংলা ভিডিও তৈরি: সম্পূর্ণ গাইড',
    excerpt: 'কীভাবে AI ব্যবহার করে পেশাদার মানের বাংলা ভিডিও তৈরি করবেন — টুলস, টিপস ও টেকনিক',
    date: '2026-05-20',
    readTime: '৫ মিনিট',
    category: 'টিউটোরিয়াল',
  },
  {
    slug: 'video-marketing-tips',
    title: 'ছোট ব্যবসার জন্য ভিডিও মার্কেটিং টিপস',
    excerpt: 'ফ্রি টুলস দিয়ে ভিডিও মার্কেটিং শুরু করুন এবং আপনার ব্যবসা বাড়ান',
    date: '2026-05-18',
    readTime: '৪ মিনিট',
    category: 'মার্কেটিং',
  },
  {
    slug: 'bkash-payment-guide',
    title: 'Hostamar-এ bKash দিয়ে পেমেন্ট করার নিয়ম',
    excerpt: 'স্টেপ বাই স্টেপ গাইড — কিভাবে bKash Personal দিয়ে ক্রেডিট কিনবেন',
    date: '2026-05-15',
    readTime: '৩ মিনিট',
    category: 'গাইড',
  },
]

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-3">হোস্টামার ব্লগ</h1>
          <p className="text-gray-400">AI ভিডিও, টিপস ও টিউটোরিয়াল</p>
        </div>

        <div className="grid gap-6">
          {posts.map(post => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block bg-white/5 border border-white/10 rounded-xl p-6 hover:border-pink-500/30 transition"
            >
              <span className="text-xs font-medium text-pink-400 bg-pink-500/10 px-2 py-1 rounded-full">
                {post.category}
              </span>
              <h2 className="text-xl font-bold text-white mt-3 mb-2">{post.title}</h2>
              <p className="text-sm text-gray-400 mb-4">{post.excerpt}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {post.readTime}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
