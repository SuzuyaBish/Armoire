import clsx, { ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { DialogTypes } from "./types/dialog-types"
import { FontType } from "./types/font-types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function assignFontFamily(family: FontType) {
  let fontFamily = "favoritRegular"

  switch (family) {
    case "light":
      fontFamily = "favoritLight"
      break
    case "regular":
      fontFamily = "favoritRegular"
      break
    case "medium":
      fontFamily = "favoritMedium"
      break
    case "bold":
      fontFamily = "favoritBold"
      break
    case "fancy":
      fontFamily = "gtSuper"
      break
  }

  return fontFamily
}

export const timestamps: { createdAt: true; updatedAt: true } = {
  createdAt: true,
  updatedAt: true,
}

export const capitalize = (s: string) => {
  if (typeof s !== "string") return ""
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export const calculateTranslation = (index: number, length: number) => {
  const isBottom = index === length - 1 || index === length - 2
  const isLeft = index % 2 === 0
  const isRight = index % 2 !== 0

  if (isLeft) {
    return {
      first: {
        translateX: 35,
        translateY: -65,
      },
      second: {
        translateX: 48 * 2,
        translateY: 0,
      },
      third: {
        translateX: 35,
        translateY: 65,
      },
    }
  }

  if (isRight) {
    return {
      first: {
        translateX: 30,
        translateY: -55,
      },
      second: {
        translateX: 48 + 24,
        translateY: 0,
      },
      third: {
        translateX: 30,
        translateY: 55,
      },
    }
  }

  if (isBottom) {
    return {
      first: {
        translateX: 30,
        translateY: -55,
      },
      second: {
        translateX: 48 + 24,
        translateY: 0,
      },
      third: {
        translateX: 30,
        translateY: 55,
      },
    }
  }

  return {
    first: {
      translateX: 30,
      translateY: -55,
    },
    second: {
      translateX: 48 + 24,
      translateY: 0,
    },
    third: {
      translateX: 30,
      translateY: 55,
    },
  }
}

export const arrayItemInArray = (array1: string[], array2: string[]) => {
  return array1.some((item) => array2.includes(item))
}

export const generateDialogText = (type: DialogTypes) => {
  if (type === "delete") {
    return {
      title: "Delete Photo",
      body: "Deleting this photo cannot be undone. Make sure you have it saved to your gallery before deleting.",
    }
  }

  if (type === "deleteMultiple") {
    return {
      title: "Delete Photos",
      body: "Deleting these photos cannot be undone. Make sure you have them saved to your gallery before deleting.",
    }
  }

  return {
    title: "Delete Photo",
    body: "Deleting the photo cannot be undone. Make sure you have it saved to your gallery before deleting.",
  }
}

export const removeDuplicatesFromArrays = (
  array1: string[],
  array2: string[]
) => {
  const combined = [...array1, ...array2]
  const unique = Array.from(new Set(combined))

  return unique
}
