import { UserModel } from "../infrastructure/user.model";
import { CreateUserDto } from "../domain/user.types";

export const createUser = async (data: CreateUserDto) => {
  const user = new UserModel(data);
  return user.save();
};

export const getUserById = async (id: string) => {
  return UserModel.findById(id);
};
