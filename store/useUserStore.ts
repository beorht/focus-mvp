import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserState {
  userId: string | null
  firstName: string | null
  lastName: string | null
  setUserData: (userId: string, firstName: string, lastName: string) => void
  clearUserData: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: null,
      firstName: null,
      lastName: null,
      setUserData: (userId, firstName, lastName) =>
        set({ userId, firstName, lastName }),
      clearUserData: () =>
        set({ userId: null, firstName: null, lastName: null }),
    }),
    {
      name: 'focus-user-storage', // localStorage key
    }
  )
)
