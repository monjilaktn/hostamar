'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Trash2, Eye, Download } from 'lucide-react'

interface Video {
  id: string
  title: string
  status: string
  language: string
  duration: number
  url: string | null
  downloads: number
  views: number
  createdAt: string
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetch('/api/dashboard/videos')
      .then(r => r.json())
      .then(data => setVideos(Array.isArray(data.videos) ? data.videos : []))
      .catch(() => setVideos([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = videos.filter(v => {
    if (search && !v.title.toLowerCase().includes(search.toLowerCase())) return false
    if (statusFilter !== 'all' && v.status !== statusFilter) return false
    return true
  })

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this video?')) return
    try {
      const res = await fetch(`/api/dashboard/videos?id=${id}`, { method: 'DELETE' })
      if (res.ok) setVideos(v => v.filter(x => x.id !== id))
    } catch {}
  }

  const statusColors: Record<string, string> = {
    completed: 'text-green-400 bg-green-500/10',
    processing: 'text-yellow-400 bg-yellow-500/10',
    pending: 'text-gray-400 bg-gray-500/10',
    failed: 'text-red-400 bg-red-500/10',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">My Videos</h1>
        <Link
          href="/editor"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          + New Video
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search videos..."
            className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg text-sm text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="processing">Processing</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Title</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Duration</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Views</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Created</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-500">
                  {search ? 'No videos match your search.' : 'No videos yet. Create one!'}
                </td>
              </tr>
            ) : (
              filtered.map(v => (
                <tr key={v.id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="px-4 py-3">
                    <p className="text-white text-sm font-medium truncate max-w-[250px]">{v.title}</p>
                    <span className="text-xs text-gray-500">{v.language?.toUpperCase()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[v.status] || 'text-gray-400'}`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{v.duration}s</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{v.views}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(v.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {v.url && (
                        <a
                          href={v.url}
                          target="_blank"
                          className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(v.id)}
                        className="p-1.5 rounded hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
