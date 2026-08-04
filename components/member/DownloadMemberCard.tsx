"use client";

type Props = {
  memberId: string;
};

export default function DownloadMemberCard({
  memberId,
}: Props) {

  function handleDownload() {
    window.alert(
      `La descarga de la credencial ${memberId} estará disponible en el siguiente sprint.`,
    );
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="rounded-xl bg-cyan-500 px-6 py-3 font-bold text-black transition hover:bg-cyan-400"
    >
      Descargar Credencial
    </button>
  );
}
