import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, MessageSquare } from 'lucide-react'
import AiChatClient from './client'

export const metadata: Metadata = {
  title: 'AI Chat - Hostamar',
  description: 'Chat with AI about your video content, scripts, and marketing ideas.',
}

export default function AiChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-white/5 rounded-lg transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">AI Chat</h1>
              <p className="text-xs text-gray-400">Powered by remote AI — ask about your videos</p>
            </div>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 pb-12">
        <AiChatClient />
      </main>
    </div>
  )
}
