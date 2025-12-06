'use client'

import { useLogStore } from '@/store/useLogStore'
import { useEffect, useRef } from 'react'
import { Terminal, Cpu } from 'lucide-react'

export default function LogConsole() {
  const logs = useLogStore((state) => state.logs)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  const getLogColor = (type: string) => {
    switch (type) {
      case 'API_REQ':
        return 'text-yellow-400'
      case 'API_RES':
        return 'text-cyan-400'
      case 'ERROR':
        return 'text-red-400'
      case 'USER_ACTION':
        return 'text-purple-400'
      case 'DATA':
        return 'text-blue-400'
      case 'SYSTEM':
        return 'text-green-500'
      default:
        return 'text-green-400'
    }
  }

  const formatApiLog = (message: string, type: 'API_REQ' | 'API_RES') => {
    try {
      // Try to extract JSON from message
      const jsonMatch = message.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const jsonData = JSON.parse(jsonMatch[0])
        const header = type === 'API_REQ' ? 'REQUEST' : 'RESPONSE'
        const headerColor = type === 'API_REQ' ? 'text-yellow-400' : 'text-cyan-400'

        // Extract endpoint if present
        const endpointMatch = message.match(/(POST|GET|PUT|DELETE)\s+([^\n]+)/)
        const endpoint = endpointMatch ? `${endpointMatch[1]} ${endpointMatch[2]}` : ''

        return (
          <div className="mt-2 mb-2">
            {endpoint && (
              <div className={`font-bold ${headerColor} mb-1`}>
                {endpoint}
              </div>
            )}
            <div className={`font-bold ${headerColor} text-sm`}>{header}</div>
            <div className="bg-gray-900 rounded p-3 mt-1 overflow-x-auto">
              <pre className="text-gray-300 text-xs leading-relaxed">
                {JSON.stringify(jsonData, null, 2)}
              </pre>
            </div>
          </div>
        )
      }
    } catch (e) {
      // If parsing fails, return original message
    }
    return <span className="text-gray-300">{message}</span>
  }

  const renderLogMessage = (log: any) => {
    if (log.type === 'API_REQ' || log.type === 'API_RES') {
      return formatApiLog(log.message, log.type)
    }
    return <span className="text-gray-300">{log.message}</span>
  }

  return (
    <div className="fixed right-0 top-0 h-screen w-full md:w-[35%] bg-black text-green-400 p-4 font-mono text-xs overflow-y-auto border-l border-gray-800 z-50">
      {/* Header */}
      <div className="mb-4 border-b border-gray-700 pb-3">
        <div className="flex items-center gap-2 mb-2">
          <Terminal className="w-5 h-5 text-green-500" />
          <h3 className="font-bold text-white text-sm">F.O.C.U.S AI CORE</h3>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Cpu className="w-4 h-4 animate-pulse" />
          <p className="text-xs">Live AI Terminal // Gemini 2.5 Flash</p>
        </div>
        <div className="mt-2 flex gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
        </div>
      </div>

      {/* Logs */}
      <div className="space-y-1">
        {logs.map((log) => (
          <div key={log.id} className="break-words hover:bg-gray-900 px-2 py-1 rounded transition-colors">
            <span className="text-gray-600">[{log.timestamp}]</span>{' '}
            <span className={`font-bold ${getLogColor(log.type)}`}>
              [{log.type}]
            </span>{' '}
            {renderLogMessage(log)}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Footer */}
      <div className="fixed bottom-4 right-4 text-[10px] text-gray-600">
        <p>AI500 Hackathon 2024 // Task 2</p>
      </div>
    </div>
  )
}
