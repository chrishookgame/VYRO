import {
  executeDataRequest,
  type DataResult,
} from "@/lib/core";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
};

export class UserRepository {
  async findAll(): Promise<DataResult<UserRecord[]>> {
    return executeDataRequest(async () => {
      return [];
    });
  }

  async findById(
    id: string,
  ): Promise<DataResult<UserRecord>> {
    return executeDataRequest(async () => ({
      id,
      name: "",
      email: "",
    }));
  }
}

export const userRepository =
  new UserRepository();
