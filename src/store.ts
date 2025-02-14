import create from 'zustand'

interface State {
  mousePosition: { x: number; y: number }
  userName: string
  setMousePosition: (position: { x: number; y: number }) => void
  setUserName: (name: string) => void
}

export const useStore = create<State>((set) => ({
  mousePosition: { x: 0, y: 0 },
  userName: '',
  setMousePosition: (position) => set({ mousePosition: position }),
  setUserName: (name) => set({ userName: name })
}))
