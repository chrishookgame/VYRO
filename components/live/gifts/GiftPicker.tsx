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

interface BattleGiftRecipient {
  id: string;
  name: string;
}

interface BattleGiftRecipients {
  left: BattleGiftRecipient;
  right: BattleGiftRecipient;
}

interface GiftPickerProps {
  roomId: string;
  battleRecipients?: BattleGiftRecipients | null;
}

export default function GiftPicker({
  roomId,
  battleRecipients = null,
}: GiftPickerProps) {
  const {
    categories,
    gifts,
    balance,
    loading,
    error: catalogError,
    updateBalance,
  } = useGiftCatalog();

  const {
    sending,
    error: giftError,
    sendGift,
  } = useLiveGifts(
    roomId,
    (result) => {
      updateBalance(
        result.senderBalance,
      );
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

  const [
    selectedReceiverId,
    setSelectedReceiverId,
  ] = useState<string | null>(null);

  const resolvedReceiverId =
    battleRecipients &&
    selectedReceiverId &&
    (
      selectedReceiverId ===
        battleRecipients.left.id ||
      selectedReceiverId ===
        battleRecipients.right.id
    )
      ? selectedReceiverId
      : null;

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

    if (
      battleRecipients &&
      !resolvedReceiverId
    ) {
      return;
    }

    const result =
      await sendGift(
        selectedGift,
        resolvedReceiverId,
      );

    if (result) {
      setConfirmOpen(false);
      setSelectedGift(null);
    }
  }

  return (
    <section className="rounded-[2rem] border border-cyan-300/20 bg-[#07111D]/25 p-6 shadow-[0_16px_50px_rgba(0,0,0,0.18)] backdrop-blur-[3px]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">
            VYRO GIFTS
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            Envía una experiencia
          </h2>
        </div>

        <WalletBalance
          balance={balance}
        />
      </div>

      {battleRecipients ? (
        <div className="mt-6 rounded-3xl border border-cyan-300/20 bg-black/20 p-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
            Battle Gift
          </p>

          <p className="mt-2 text-sm text-gray-300">
            Elige el creador que quieres apoyar.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              {
                id: battleRecipients.left.id,
                name: battleRecipients.left.name,
                side: "LEFT",
              },
              {
                id: battleRecipients.right.id,
                name: battleRecipients.right.name,
                side: "RIGHT",
              },
            ].map((recipient) => (
              <button
                key={recipient.id}
                type="button"
                onClick={() => {
                  setSelectedReceiverId(
                    recipient.id,
                  );
                }}
                className={[
                  "rounded-2xl border px-4 py-4 text-left transition",
                  resolvedReceiverId ===
                  recipient.id
                    ? "border-cyan-300 bg-cyan-300/15 text-white"
                    : "border-white/10 bg-white/5 text-gray-300 hover:border-cyan-300/40 hover:bg-white/10",
                ].join(" ")}
              >
                <span className="block text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                  {recipient.side}
                </span>

                <span className="mt-1 block font-black">
                  {recipient.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

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
        <GiftPreview
          gift={selectedGift}
        />

        <button
          type="button"
          disabled={
            !selectedGift ||
            sending ||
            Boolean(
              battleRecipients &&
              !resolvedReceiverId,
            )
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
