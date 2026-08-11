"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  Gem,
  Heart,
  MessageCircle,
  Rocket,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import TalkPanel from "./TalkPanel";
import BoostPanel from "./BoostPanel";

type ActionButtonProps = {
  icon: ReactNode;
  label: string;
  count?: string;
  onClick?: () => void;
  disabled?: boolean;
};

function ActionButton({
  icon,
  label,
  count,
  onClick,
  disabled = false,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group flex flex-col items-center disabled:cursor-not-allowed disabled:opacity-60"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/30 bg-white/10 shadow-[0_0_25px_rgba(34,211,238,.20)] backdrop-blur-xl transition-all duration-300 group-hover:scale-110 group-hover:border-cyan-300">
        {icon}
      </div>

      <span className="mt-2 text-xs font-semibold tracking-wide text-cyan-200">
        {label}
      </span>

      {count !== undefined ? (
        <span className="text-[11px] text-zinc-400">
          {count}
        </span>
      ) : null}
    </button>
  );
}

type ActionBarProps = {
  postId: string;
  initialLikes: number;
};

function formatCount(value: number) {
  return new Intl.NumberFormat("es", {
    notation:
      value >= 1000
        ? "compact"
        : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

export default function ActionBar({
  postId,
  initialLikes,
}: ActionBarProps) {
  const [liked, setLiked] =
    useState(false);

  const [likes, setLikes] =
    useState(initialLikes);

  const [loadingLike, setLoadingLike] =
    useState(true);

  const [talkOpen, setTalkOpen] =
    useState(false);

  const [boostOpen, setBoostOpen] =
    useState(false);

  const [vaulted, setVaulted] =
    useState(false);

  const [loadingVault, setLoadingVault] =
    useState(true);

  const [commentCount, setCommentCount] =
    useState(0);

  const updateCommentCount =
    useCallback((count: number) => {
      setCommentCount(count);
    }, []);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const {
          data,
          error,
        } = await supabase
          .from("post_likes")
          .select("id")
          .eq("post_id", postId)
          .eq("user_id", user.id)
          .maybeSingle();

        if (
          mounted &&
          !error
        ) {
          setLiked(Boolean(data));
        }
      }

      const {
        count,
        error: countError,
      } = await supabase
        .from("post_comments")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("post_id", postId);

      if (
        mounted &&
        !countError
      ) {
        setCommentCount(
          count ?? 0,
        );
      }

      if (user) {
        const {
          data: vaultData,
          error: vaultError,
        } = await supabase
          .from("post_vault")
          .select("id")
          .eq("post_id", postId)
          .eq("user_id", user.id)
          .maybeSingle();

        if (
          mounted &&
          !vaultError
        ) {
          setVaulted(Boolean(vaultData));
        }

        if (
          mounted &&
          vaultError
        ) {
          console.error(
            "VYRO vault load error:",
            vaultError,
          );
        }
      }

      if (mounted) {
        setLoadingLike(false);
        setLoadingVault(false);
      }
    }

    void loadData();

    return () => {
      mounted = false;
    };
  }, [postId]);

  async function toggleLike() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.alert(
        "Debes iniciar sesión para dar Me gusta.",
      );

      return;
    }

    setLoadingLike(true);

    if (liked) {
      const { error } =
        await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);

      if (!error) {
        setLiked(false);
        setLikes((value) =>
          Math.max(0, value - 1),
        );
      }
    } else {
      const { error } =
        await supabase
          .from("post_likes")
          .insert({
            post_id: postId,
            user_id: user.id,
          });

      if (!error) {
        setLiked(true);
        setLikes(
          (value) => value + 1,
        );
      }
    }

    setLoadingLike(false);
  }

  async function toggleVault() {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      window.alert(
        "Debes iniciar sesión para usar Vault.",
      );

      return;
    }

    setLoadingVault(true);

    if (vaulted) {
      const { error } = await supabase
        .from("post_vault")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);

      if (error) {
        console.error(
          "VYRO vault remove error:",
          error,
        );
      } else {
        setVaulted(false);
      }
    } else {
      const { error } = await supabase
        .from("post_vault")
        .insert({
          post_id: postId,
          user_id: user.id,
        });

      if (error) {
        console.error(
          "VYRO vault save error:",
          error,
        );
      } else {
        setVaulted(true);
      }
    }

    setLoadingVault(false);
  }

  return (
    <>
      <div className="absolute right-5 bottom-24 z-30 flex flex-col items-center gap-5">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-2 border-cyan-300 bg-gradient-to-br from-cyan-400 via-cyan-500 to-violet-600 shadow-[0_0_35px_rgba(34,211,238,.65)]" />

          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-cyan-300 bg-black px-3 py-1 text-[10px] font-bold tracking-widest text-cyan-300">
            AI
          </div>
        </div>

        <ActionButton
          icon={
            <Heart
              size={30}
              className={
                liked
                  ? "fill-red-500 text-red-500"
                  : "text-cyan-300"
              }
            />
          }
          label={
            liked
              ? "Liked"
              : "Pulse"
          }
          count={formatCount(likes)}
          onClick={() =>
            void toggleLike()
          }
          disabled={loadingLike}
        />

        <ActionButton
          icon={
            <MessageCircle
              size={30}
              className="text-cyan-300"
            />
          }
          label="Talk"
          count={formatCount(
            commentCount,
          )}
          onClick={() =>
            setTalkOpen(true)
          }
        />

        <ActionButton
          icon={
            <Rocket
              size={30}
              className="text-cyan-300"
            />
          }
          label="Boost"
          count="0"
          onClick={() =>
            setBoostOpen(true)
          }
        />

        <ActionButton
          icon={
            <Gem
              size={30}
              className={
                vaulted
                  ? "fill-cyan-300 text-cyan-300"
                  : "text-cyan-300"
              }
            />
          }
          label={
            vaulted
              ? "Vaulted"
              : "Vault"
          }
          onClick={() =>
            void toggleVault()
          }
          disabled={loadingVault}
        />
      </div>

      {boostOpen ? (
        <BoostPanel
          postId={postId}
          open={boostOpen}
          onClose={() =>
            setBoostOpen(false)
          }
        />
      ) : null}

      {talkOpen ? (
        <TalkPanel
          postId={postId}
          onClose={() =>
            setTalkOpen(false)
          }
          onCountChange={
            updateCommentCount
          }
        />
      ) : null}
    </>
  );
}
