import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const selectedItem = <T extends Record<string, unknown>>(obj: T, keys: Array<keyof T>) => {
  return keys.reduce((acc, key) => {
    acc[key] = obj[key];
    return acc;
  }, {} as Partial<T>);
};

export const checkFileType = (file: File, allowedTypes = ["jpg", "jpeg", "png"]) => {
  if (!file?.name) return false;
  const fileType = file.name.split(".").pop()?.toLowerCase();
  return fileType ? allowedTypes.includes(fileType) : false;
};

export const generatePassword = (length = 12): string => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  const allChars = lowercase + uppercase + numbers + symbols;

  if (length < 8) throw new Error("Password length must be at least 8 characters");

  const requiredChars = [
    lowercase[Math.floor(Math.random() * lowercase.length)],
    uppercase[Math.floor(Math.random() * uppercase.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    symbols[Math.floor(Math.random() * symbols.length)]
  ];

  const remainingLength = length - requiredChars.length;
  const randomChars = Array.from({ length: remainingLength }, () =>
    allChars[Math.floor(Math.random() * allChars.length)]
  );

  return [...requiredChars, ...randomChars]
    .sort(() => Math.random() - 0.5)
    .join("");
};

export const calculatePercentageChange = (previous: number, current: number): number => {
  if (previous === 0) return current === 0 ? 0 : 100;
  return Number(((current - previous) / Math.abs(previous) * 100).toFixed(2));
};

export const formatCurrency = (
  amount: number, 
  currency: string = 'USD', 
  locale: string = 'en-US'
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(amount / 100);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${currency} ${(amount / 100).toFixed(2)}`;
  }
};

export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const formatDate = (date: Date | string, locale: string = 'en-US'): string => {
  try {
    return new Date(date).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(date);
  }
};
