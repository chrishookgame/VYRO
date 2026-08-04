import {
  executeDataRequest,
  type DataResult,
} from "@/lib/core";

export type NotificationRecord = {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
};

export class NotificationRepository {
  async findByUserId(
    userId: string,
  ): Promise<
    DataResult<NotificationRecord[]>
  > {
    return executeDataRequest(
      async () => {
        void userId;
        return [];
      },
    );
  }
}

export const notificationRepository =
  new NotificationRepository();
