"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  loadGiftPickerData,
  type LiveGiftCatalogItem,
  type LiveGiftCategory,
} from "@/lib/live";

export interface UseGiftCatalogResult {
  categories: LiveGiftCategory[];
  gifts: LiveGiftCatalogItem[];
  balance: number;
  loading: boolean;
  error: string;
  refreshCatalog: () => Promise<void>;
  updateBalance: (balance: number) => void;
  clearError: () => void;
}

export function useGiftCatalog(): UseGiftCatalogResult {
  const [categories, setCategories] =
    useState<LiveGiftCategory[]>([]);

  const [gifts, setGifts] =
    useState<LiveGiftCatalogItem[]>([]);

  const [balance, setBalance] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const clearError = useCallback(() => {
    setError("");
  }, []);

  const updateBalance = useCallback(
    (nextBalance: number) => {
      setBalance(
        Math.max(
          Number.isFinite(nextBalance)
            ? nextBalance
            : 0,
          0,
        ),
      );
    },
    [],
  );

  const refreshCatalog =
    useCallback(async () => {
      setLoading(true);

      try {
        const data =
          await loadGiftPickerData();

        setCategories(data.categories);
        setGifts(data.gifts);
        updateBalance(data.balance);
        setError("");
      } catch (catalogError) {
        setError(
          catalogError instanceof Error
            ? catalogError.message
            : "No se pudo cargar el catálogo de regalos.",
        );
      } finally {
        setLoading(false);
      }
    }, [updateBalance]);

  useEffect(() => {
    void refreshCatalog();
  }, [refreshCatalog]);

  return {
    categories,
    gifts,
    balance,
    loading,
    error,
    refreshCatalog,
    updateBalance,
    clearError,
  };
}
