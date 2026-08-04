"use client";

import { useState } from "react";

import WithdrawAdminPanel, {
  type WithdrawAdminItem,
} from "@/components/admin/WithdrawAdminPanel";

export default function AdminWithdrawsPage() {
  const [
    requests,
    setRequests,
  ] = useState<WithdrawAdminItem[]>([]);

  function updateStatus(
    id: string,
    status: WithdrawAdminItem["status"],
  ) {
    setRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === id
          ? {
              ...request,
              status,
            }
          : request,
      ),
    );
  }

  return (
    <section className="space-y-8">
      <WithdrawAdminPanel
        requests={requests}
        onApprove={(id) => {
          updateStatus(
            id,
            "approved",
          );
        }}
        onReject={(id) => {
          updateStatus(
            id,
            "rejected",
          );
        }}
        onPay={(id) => {
          updateStatus(
            id,
            "paid",
          );
        }}
      />
    </section>
  );
}
