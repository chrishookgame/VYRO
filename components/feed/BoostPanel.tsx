"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { Rocket } from "lucide-react";

import { supabase } from "@/lib/supabase";
import Modal from "@/components/ui/modal/Modal";

type BoostPackage = {
  code: string;
  name: string;
  description: string | null;
  price: number;
  duration_hours: number;
  priority_boost: number;
};

type BoostActivationRow = {
  remaining_balance: number | string | null;
};

type BoostPanelProps = {
  postId: string;
  open: boolean;
  onClose: () => void;
  onActivated?: (
    priorityBoost: number,
  ) => void;
};

export default function BoostPanel({
  postId,
  open,
  onClose,
  onActivated,
}: BoostPanelProps) {
  const [packages, setPackages] =
    useState<BoostPackage[]>([]);

  const [selectedCode, setSelectedCode] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [activating, setActivating] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  const [walletBalance, setWalletBalance] =
    useState<number | null>(null);

  const [loadingWallet, setLoadingWallet] =
    useState(false);

  const loadWallet = useCallback(async () => {
    setLoadingWallet(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setWalletBalance(null);
      setLoadingWallet(false);
      return;
    }

    const { data, error } = await supabase
      .from("wallets")
      .select("available_balance")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error(
        "VYRO Boost wallet load error:",
        error,
      );
      setWalletBalance(null);
      setLoadingWallet(false);
      return;
    }

    setWalletBalance(
      Number(data?.available_balance ?? 0),
    );

    setLoadingWallet(false);
  }, []);

  const loadPackages = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    const { data, error } = await supabase
      .from("post_boost_catalog")
      .select(
        "code,name,description,price,duration_hours,priority_boost",
      )
      .eq("active", true)
      .order("display_order", {
        ascending: true,
      });

    if (error) {
      setPackages([]);
      setSelectedCode(null);
      setErrorMessage(
        "No se pudieron cargar los paquetes Boost.",
      );
      setLoading(false);
      return;
    }

    const nextPackages =
      (data ?? []) as BoostPackage[];

    setPackages(nextPackages);

    setSelectedCode((current) => {
      if (
        current &&
        nextPackages.some(
          (item) => item.code === current,
        )
      ) {
        return current;
      }

      return nextPackages[0]?.code ?? null;
    });

    setLoading(false);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    void loadPackages();
    void loadWallet();
  }, [open, loadPackages, loadWallet]);

  const selectedPackage =
    packages.find(
      (item) => item.code === selectedCode,
    ) ?? null;

  const balanceAfterBoost =
    selectedPackage &&
    walletBalance !== null
      ? walletBalance -
        Number(selectedPackage.price)
      : null;

  const insufficientBalance =
    balanceAfterBoost !== null &&
    balanceAfterBoost < 0;

  const activateBoost = useCallback(async () => {
    if (!selectedPackage || activating) {
      return;
    }

    setActivating(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const { data, error } = await supabase.rpc(
      "activate_post_boost",
      {
        target_post_id: postId,
        target_package_code: selectedPackage.code,
      },
    );

    if (error) {
      setErrorMessage(
        error.message ||
          "No se pudo activar VYRO Boost.",
      );
      setActivating(false);
      return;
    }

    const activationRows =
      (data ?? []) as BoostActivationRow[];

    const remainingBalance =
      activationRows[0]?.remaining_balance;

    if (
      remainingBalance !== null &&
      remainingBalance !== undefined
    ) {
      setWalletBalance(
        Number(remainingBalance),
      );
    } else {
      void loadWallet();
    }

    setSuccessMessage(
      `Boost ${selectedPackage.name} activado correctamente.`,
    );

    onActivated?.(
      selectedPackage.priority_boost,
    );

    setActivating(false);
  }, [
    activating,
    loadWallet,
    onActivated,
    postId,
    selectedPackage,
  ]);

  return (
    <Modal
      open={open}
      title="Boost your post"
      onClose={onClose}
      footer={
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-slate-400">
            {selectedPackage
              ? `$${Number(
                  selectedPackage.price,
                ).toFixed(2)} · ${
                  selectedPackage.duration_hours
                }h`
              : "Selecciona un paquete"}
          </div>

          <button
            type="button"
            onClick={() => void activateBoost()}
            disabled={
              !selectedPackage ||
              activating ||
              insufficientBalance
            }
            className="rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
            title={
              activating
                ? "Activando VYRO Boost..."
                : "Activar VYRO Boost"
            }
          >
            {activating ? "Activating..." : "Continue"}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {successMessage ? (
          <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4">
            <p className="text-sm font-semibold text-emerald-200">
              {successMessage}
            </p>
          </div>
        ) : null}

        <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                VYRO Wallet
              </p>

              <p className="mt-1 text-lg font-bold text-white">
                {loadingWallet
                  ? "Cargando saldo..."
                  : walletBalance !== null
                    ? `$${walletBalance.toFixed(2)}`
                    : "Saldo no disponible"}
              </p>
            </div>

            {balanceAfterBoost !== null ? (
              <div className="text-right">
                <p className="text-xs text-slate-500">
                  Después del Boost
                </p>

                <p
                  className={`mt-1 font-bold ${
                    insufficientBalance
                      ? "text-red-300"
                      : "text-emerald-300"
                  }`}
                >
                  ${Math.max(
                    0,
                    balanceAfterBoost,
                  ).toFixed(2)}
                </p>
              </div>
            ) : null}
          </div>

          {insufficientBalance ? (
            <p className="mt-3 text-sm font-semibold text-red-300">
              Saldo insuficiente para este paquete.
            </p>
          ) : null}
        </div>

        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4">
          <div className="flex items-center gap-3">
            <Rocket
              size={26}
              className="text-cyan-300"
            />

            <div>
              <p className="font-semibold text-cyan-100">
                VYRO Boost
              </p>

              <p className="text-sm text-slate-400">
                Aumenta temporalmente la prioridad
                de distribución de tu publicación.
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="py-6 text-center text-sm text-slate-400">
            Cargando paquetes Boost...
          </p>
        ) : null}

        {!loading && errorMessage ? (
          <div className="rounded-xl border border-red-400/30 bg-red-400/10 p-4">
            <p className="text-sm text-red-200">
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={() => void loadPackages()}
              className="mt-3 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
            >
              Intentar nuevamente
            </button>
          </div>
        ) : null}

        {!loading &&
        !errorMessage &&
        packages.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">
            No hay paquetes Boost disponibles.
          </p>
        ) : null}

        {!loading &&
        !errorMessage &&
        packages.length > 0 ? (
          <div className="space-y-3">
            {packages.map((item) => {
              const selected =
                selectedCode === item.code;

              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() =>
                    setSelectedCode(item.code)
                  }
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selected
                      ? "border-cyan-300 bg-cyan-400/10 shadow-[0_0_25px_rgba(34,211,238,.12)]"
                      : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold text-white">
                        {item.name}
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        {item.description ??
                          "VYRO Boost"}
                      </p>
                    </div>

                    <span className="font-bold text-cyan-300">
                      $
                      {Number(
                        item.price,
                      ).toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-3 flex gap-4 text-xs text-slate-400">
                    <span>
                      {item.duration_hours}h
                    </span>

                    <span>
                      Priority +
                      {item.priority_boost}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : null}

        <p className="text-xs text-slate-500">
          Post: {postId}
        </p>
      </div>
    </Modal>
  );
}