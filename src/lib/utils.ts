import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const convertSelectOptions = (
  arr: [] = [],
  label?: string,
  value?: string
): SelectOptionType[] => {
  if (arr.map) {
    return arr.map((row) => ({
      text: row[label ?? "text"],
      value: row[value ?? "id"],
    }));
  } else {
    return [];
  }
  return [];
};
export interface SelectOptionType {
  text?: string | number | boolean;
  label?: string | number | boolean;
  value: string | number | boolean;
}
