'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, Copy, ExternalLink, Settings, Loader2 } from 'lucide-react'

export default function SetupPage() {
  const [copied, setCopied] = useState('')
  const [loading, setLoading] = useState('')

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(''), 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Hostamar Setup Guide 🚀</h1>
        <p className="text-gray-400 mb-8">Complete these steps to go live with all features</p>

        {/* Step 1: Resend */}
        <div className="bg-gray-800 rounded-xl p-6 mb-4 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">1</div>
            <h2 className="text-xl font-semibold">SMTP Email (Resend)</h2>
            <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded-full">Free: 100/day</span>
          </div>
          <ol className="space-y-2 text-gray-300 text-sm list-decimal ml-5">
            <li>Go to <a href="https://resend.com" className="text-blue-400 underline">resend.com</a> → Sign up</li>
            <li>Verify email → Dashboard → Create API key</li>
            <li>Copy the key (starts with <code className="bg-gray-700 px-1 rounded">re_</code>)</li>
          </ol>
          <div className="mt-3 flex items-center gap-2">
            <input readOnly value="re_" className="bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm flex-1" placeholder="re_xxxxxxxxxx" />
            <button onClick={() => copyToClipboard('re_', 'resend')} className="p-2 hover:bg-gray-700 rounded">
              {copied === 'resend' ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-gray-400" />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Add to .env.local: <code className="bg-gray-700 px-1 rounded">RESEND_API_KEY=re_xxxxxxxxx</code></p>
        </div>

        {/* Step 2: Google OAuth */}
        <div className="bg-gray-800 rounded-xl p-6 mb-4 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-sm font-bold">2</div>
            <h2 className="text-xl font-semibold">Google Social Login</h2>
            <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded-full">Free</span>
          </div>
          <ol className="space-y-2 text-gray-300 text-sm list-decimal ml-5">
            <li>Go to <a href="https://console.cloud.google.com/apis/credentials" className="text-blue-400 underline">Google Cloud Console</a></li>
            <li>Create project → "OAuth consent screen" → External</li>
            <li>Add <code className="bg-gray-700 px-1 rounded">https://hostamar.com</code> as Authorized domain</li>
            <li>"Credentials" → Create OAuth 2.0 Client ID → Web application</li>
            <li>Add redirect URI: <code className="bg-gray-700 px-1 rounded">https://hostamar.com/api/auth/callback/google</code></li>
            <li>Copy Client ID and Client Secret</li>
          </ol>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <input readOnly placeholder="Client ID" className="bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm" />
            <input readOnly placeholder="Client Secret" className="bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Add to .env.local: <code className="bg-gray-700 px-1 rounded">GOOGLE_CLIENT_ID=xxx</code> and <code className="bg-gray-700 px-1 rounded">GOOGLE_CLIENT_SECRET=xxx</code></p>
        </div>

        {/* Step 3: Facebook OAuth */}
        <div className="bg-gray-800 rounded-xl p-6 mb-4 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-sm font-bold">3</div>
            <h2 className="text-xl font-semibold">Facebook Social Login</h2>
            <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded-full">Free</span>
          </div>
          <ol className="space-y-2 text-gray-300 text-sm list-decimal ml-5">
            <li>Go to <a href="https://developers.facebook.com/apps" className="text-blue-400 underline">Facebook Developers</a></li>
            <li>Create app → "Authenticate and request data from users with Facebook Login"</li>
            <li>Settings → Basic → Copy App ID and App Secret</li>
            <li>Add redirect URIs: <code className="bg-gray-700 px-1 rounded">https://hostamar.com/api/auth/callback/facebook</code></li>
          </ol>
          <p className="text-xs text-gray-500 mt-2">Add to .env.local: <code className="bg-gray-700 px-1 rounded">FACEBOOK_CLIENT_ID=xxx</code> and <code className="bg-gray-700 px-1 rounded">FACEBOOK_CLIENT_SECRET=xxx</code></p>
        </div>

        {/* Step 4: Uploadthing */}
        <div className="bg-gray-800 rounded-xl p-6 mb-4 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold">4</div>
            <h2 className="text-xl font-semibold">Uploadthing (File Storage)</h2>
            <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded-full">Free: 2GB</span>
          </div>
          <ol className="space-y-2 text-gray-300 text-sm list-decimal ml-5">
            <li>Go to <a href="https://uploadthing.com" className="text-blue-400 underline">uploadthing.com</a> → Sign up (GitHub)</li>
            <li>Dashboard → Create app → "hostamar"</li>
            <li>Copy API keys</li>
          </ol>
          <p className="text-xs text-gray-500 mt-2">Add to .env.local: <code className="bg-gray-700 px-1 rounded">UPLOADTHING_SECRET=sk_live_xxx</code> and <code className="bg-gray-700 px-1 rounded">UPLOADTHING_APP_ID=xxx</code></p>
        </div>

        {/* Step 5: Vercel */}
        <div className="bg-gray-800 rounded-xl p-6 mb-4 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-sm font-bold">5</div>
            <h2 className="text-xl font-semibold">Vercel Environment Variables</h2>
            <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded-full">Auto</span>
          </div>
          <ol className="space-y-2 text-gray-300 text-sm list-decimal ml-5">
            <li>Go to <a href="https://vercel.com/monjilaktn/hostamar/settings/environment" className="text-blue-400 underline">Vercel Dashboard → Settings → Environment Variables</a></li>
            <li>Add these variables (from .env.local):</li>
          </ol>
          <pre className="mt-3 bg-gray-900 p-4 rounded-lg text-xs text-green-400 overflow-x-auto">
DATABASE_URL={process.env.NEXT_PUBLIC_SITE_URL ? 'postgresql://...' : 'postgresql://neondb_owner:luambAtuJXneMJgZm4V94HR5@ep-empty-firefly-apkx8hzh.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require'}
JWT_SECRET=Xe/4ias0GKKUv8zhEyctMRk+cbuPwlmWEXveKK1pfRk=
NEXTAUTH_SECRET=KW7zFeRJSmW0FCukzyOy06CE3zy/8h4YX+KgwwVWFBA=
NEXTAUTH_URL=https://hostamar.com
RESEND_API_KEY=re_xxxxx          ← after Resend signup
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com  ← after Google setup
GOOGLE_CLIENT_SECRET=xxxx        ← after Google setup
FACEBOOK_CLIENT_ID=xxxx          ← after Facebook setup
FACEBOOK_CLIENT_SECRET=xxxx      ← after Facebook setup
UPLOADTHING_SECRET=sk_live_xxx   ← after Uploadthing setup
UPLOADTHING_APP_ID=xxx           ← after Uploadthing setup
          </pre>
        </div>

        {/* Done */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-sm font-bold">✓</div>
            <h2 className="text-xl font-semibold">Next Steps After Setup</h2>
          </div>
          <ul className="text-gray-300 text-sm space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-0.5">→</span>
              Push your 400K Facebook group: share hostamar.com with referral link
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-0.5">→</span>
              Monitor earnings: each 10-credit pack = ৳299 via bKash
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-0.5">→</span>
              Check Vercel dashboard for usage limits
            </li>
          </ul>
        </div>

        {/* Quick copy */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              const text = `# Hostamar .env.local Template
DATABASE_URL=postgresql://neondb_owner:luambAtuJXneMJgZm4V94HR5@ep-empty-firefly-apkx8hzh.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=Xe/4ias0GKKUv8zhEyctMRk+cbuPwlmWEXveKK1pfRk=
NEXTAUTH_SECRET=KW7zFeRJSmW0FCukzyOy06CE3zy/8h4YX+KgwwVWFBA=
NEXTAUTH_URL=https://hostamar.com
NEXT_PUBLIC_SITE_URL=https://hostamar.com

# SMTP - Resend (get free key at resend.com)
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=resend
SMTP_PASS=re_xxx
EMAIL_FROM=noreply@hostamar.com
FROM_EMAIL=noreply@hostamar.com

# OAuth - Google (console.cloud.google.com)
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx

# OAuth - Facebook (developers.facebook.com)
FACEBOOK_CLIENT_ID=xxx
FACEBOOK_CLIENT_SECRET=xxx

# File Upload - Uploadthing (uploadthing.com)
UPLOADTHING_SECRET=sk_live_xxx
UPLOADTHING_APP_ID=xxx

# bKash Payment
BKASH_NUMBER=01822417463`;
              navigator.clipboard.writeText(text);
              setCopied('all');
              setTimeout(() => setCopied(''), 3000);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            {copied === 'all' ? '✓ Copied!' : '📋 Copy Complete .env Template'}
          </button>
        </div>
      </div>
    </div>
  )
}
