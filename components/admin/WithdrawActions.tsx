"use client";

import {
  approveWithdraw,
  rejectWithdraw,
  markWithdrawPaid,
} from "@/lib/admin";

type Props = {
  withdrawId: string;
  status: string;
  onUpdated: () => void;
};

export default function WithdrawActions({
  withdrawId,
  status,
  onUpdated,
}: Props) {

  async function handleApprove() {
    await approveWithdraw(withdrawId);
    onUpdated();
  }

  async function handleReject() {
    await rejectWithdraw(withdrawId);
    onUpdated();
  }

  async function handlePaid() {
    await markWithdrawPaid(withdrawId);
    onUpdated();
  }

  return (

    <div className="flex flex-wrap gap-3">

      {status === "pending" && (

        <>
          <button
            onClick={handleApprove}
            className="rounded-xl bg-green-500 px-4 py-2 font-bold text-black"
          >
            Aprobar
          </button>

          <button
            onClick={handleReject}
            className="rounded-xl bg-red-500 px-4 py-2 font-bold text-white"
          >
            Rechazar
          </button>
        </>

      )}

      {status === "approved" && (

        <button
          onClick={handlePaid}
          className="rounded-xl bg-cyan-500 px-4 py-2 font-bold text-black"
        >
          Marcar como Pagado
        </button>

      )}

    </div>

  );

}
