"use client";

type Props = {
  title: string;
  text: string;
  url: string;
};

export default function ShareMemberCard({
  title,
  text,
  url,
}: Props) {

  async function handleShare() {

    if (navigator.share) {

      try {

        await navigator.share({
          title,
          text,
          url,
        });

      } catch {
        // El usuario canceló o ocurrió un error.
      }

      return;
    }

    await navigator.clipboard.writeText(
      url,
    );

    window.alert(
      "Enlace copiado al portapapeles.",
    );

  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="rounded-xl bg-violet-600 px-6 py-3 font-bold text-white transition hover:bg-violet-700"
    >
      Compartir Credencial
    </button>
  );

}
