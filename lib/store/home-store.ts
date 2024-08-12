import { create } from "zustand"
import { Piece } from "../db/schema/pieces"

interface HomeStore {
  isSelecting: boolean
  isInArchive: boolean
  setIsSelecting: (isSelecting: boolean, isInArchive?: boolean) => void
  selectedPieces: Piece[]
  setSelectedPieces: (pieces: Piece[]) => void
}

export const useHomeStore = create<HomeStore>((set) => ({
  isSelecting: false,
  selectedPieces: [],
  isInArchive: false,
  setIsSelecting: (isSelecting, isInArchive) => {
    if (isInArchive !== undefined) {
      set({ isSelecting, isInArchive })
    } else {
      set({ isSelecting })
    }
  },
  setSelectedPieces: (pieces) => set({ selectedPieces: pieces }),
}))
