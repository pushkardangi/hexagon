import { create } from "zustand";

export const useApiRefetch = create((set) => ({
  imageSaved: false,
  setImageSaved: (value) => set({ imageSaved: value }),
}));
