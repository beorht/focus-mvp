import { create } from 'zustand'

export type LogType = 'INFO' | 'API_REQ' | 'API_RES' | 'ERROR' | 'SYSTEM' | 'USER_ACTION' | 'DATA'

export type LogEntry = {
  id: string;
  timestamp: string;
  type: LogType;
  message: string;
}

interface LogStore {
  logs: LogEntry[];
  addLog: (type: LogType, message: string) => void;
  clearLogs: () => void;
}

export const useLogStore = create<LogStore>((set) => ({
  logs: [
    {
      id: '1',
      timestamp: new Date().toLocaleTimeString(),
      type: 'SYSTEM',
      message: 'F.O.C.U.S AI System initialized...'
    },
    {
      id: '2',
      timestamp: new Date().toLocaleTimeString(),
      type: 'SYSTEM',
      message: 'Gemini AI connection established'
    },
    {
      id: '3',
      timestamp: new Date().toLocaleTimeString(),
      type: 'INFO',
      message: 'Waiting for user input...'
    }
  ],
  addLog: (type: LogType, message: string) => set((state) => ({
    logs: [...state.logs, {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message
    }]
  })),
  clearLogs: () => set({ logs: [] })
}))
