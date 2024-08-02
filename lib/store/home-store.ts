import { create } from "zustand"
import { Piece } from "../db/schema/pieces"

interface HomeStore {
  isSelecting: boolean
  setIsSelecting: (isSelecting: boolean) => void
  selectedPieces: Piece[]
  setSelectedPieces: (pieces: Piece[]) => void
}

export const useHomeStore = create<HomeStore>((set) => ({
  isSelecting: false,
  selectedPieces: [],
  setIsSelecting: (isSelecting) => set({ isSelecting }),
  setSelectedPieces: (pieces) => set({ selectedPieces: pieces }),
}))
