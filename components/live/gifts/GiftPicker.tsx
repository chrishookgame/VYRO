"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  useGiftCatalog,
  useLiveGifts,
} from "@/hooks";
import type {
  LiveGiftCatalogItem,
} from "@/lib/live";

import ConfirmGiftModal from "./ConfirmGiftModal";
import GiftCard from "./GiftCard";
import GiftCategoryTabs from "./GiftCategoryTabs";
import GiftPreview from "./GiftPreview";
import WalletBalance from "./WalletBalance";

interface GiftPickerProps {
  roomId: string;
}

export default function GiftPicker({
  roomId,
}: GiftPickerProps) {
  const {
    categories,
    gifts,
    balance,
    loading,
    error: catalogError,
    refreshCatalog,
  } = useGiftCatalog();

  const {
    sending,
    error: giftError,
    sendGift,
  } = useLiveGifts(
    roomId,
    async () => {
      await refreshCatalog();
    },
  );

  const [selectedCategory, setSelectedCategory] =
    useState<string | null>(null);

  const [selectedGift, setSelectedGift] =
    useState<LiveGiftCatalogItem | null>(
      null,
    );

  const [confirmOpen, setConfirmOpen] =
    useState(false);

  const activeCategory =
    selectedCategory ??
    categories[0]?.code ??
    null;

  const visibleGifts = useMemo(
    () =>
      gifts.filter(
        (gift) =>
          gift.categoryCode ===
          activeCategory,
      ),
    [
      activeCategory,
      gifts,
    ],
  );

  async function handleConfirm() {
    if (!selectedGift) {
      return;
    }

    const result =
      await sendGift(selectedGift);

    if (result) {
      setConfirmOpen(false);
    }
  }

  return (
    <section className="rounded-[2rem] border border-cyan-400/15 bg-[#07111D] p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">
            VYRO GIFTS
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            Envía una experiencia
          </h2>
        </div>

        <WalletBalance balance={balance} />
      </div>

      <div className="mt-6">
        <GiftCategoryTabs
          categories={categories}
          selectedCategory={activeCategory}
          onSelectCategory={(categoryCode) => {
            setSelectedCategory(categoryCode);
            setSelectedGift(null);
          }}
        />
      </div>

      {catalogError || giftError ? (
        <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {catalogError || giftError}
        </div>
      ) : null}

      {loading ? (
        <div className="mt-6 rounded-3xl border border-white/10 p-10 text-center text-gray-400">
          Cargando regalos...
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {visibleGifts.map((gift) => (
            <GiftCard
              key={gift.code}
              gift={gift}
              selected={
                selectedGift?.code ===
                gift.code
              }
              onSelect={setSelectedGift}
            />
          ))}
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto]">
        <GiftPreview gift={selectedGift} />

        <button
          type="button"
          disabled={
            !selectedGift ||
            sending
          }
          onClick={() => {
            setConfirmOpen(true);
          }}
          className="min-w-44 rounded-3xl bg-cyan-300 px-6 py-4 font-black text-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          Seleccionar regalo
        </button>
      </div>

      <ConfirmGiftModal
        gift={selectedGift}
        open={confirmOpen}
        sending={sending}
        onCancel={() => {
          setConfirmOpen(false);
        }}
        onConfirm={() => {
          void handleConfirm();
        }}
      />
    </section>
  );
}
