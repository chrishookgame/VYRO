"use client";

import { QRCodeSVG } from "qrcode.react";

type Props = {
  memberId: string;
};

export default function MemberQr({
  memberId,
}: Props) {

  const verifyUrl =
    `https://vyro.com/verify/${memberId}`;

  return (

    <div className="flex flex-col items-center gap-3">

      <QRCodeSVG
        value={verifyUrl}
        size={160}
        bgColor="transparent"
        fgColor="#06b6d4"
      />

      <p className="text-sm text-slate-400 text-center">
        Escanea para verificar la identidad
      </p>

    </div>

  );

}
