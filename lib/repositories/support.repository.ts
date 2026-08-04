import {
  executeDataRequest,
  type DataResult,
} from "@/lib/core";

export type SupportTicketRecord = {
  id: string;
  userId: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export class SupportRepository {
  async findAll(): Promise<
    DataResult<SupportTicketRecord[]>
  > {
    return executeDataRequest(
      async () => [],
    );
  }

  async findById(
    id: string,
  ): Promise<
    DataResult<SupportTicketRecord>
  > {
    return executeDataRequest(
      async () => ({
        id,
        userId: "",
        subject: "",
        category: "",
        priority: "normal",
        status: "open",
        createdAt: "",
        updatedAt: "",
      }),
    );
  }
}

export const supportRepository =
  new SupportRepository();
