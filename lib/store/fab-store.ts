import { create } from "zustand"

interface FabStore {
  stage: "1" | "2" | "3"
  setStage: (stage: "1" | "2" | "3") => void
}

export const useFabStore = create<FabStore>((set) => ({
  stage: "1",
  setStage: (stage) => set({ stage }),
}))
