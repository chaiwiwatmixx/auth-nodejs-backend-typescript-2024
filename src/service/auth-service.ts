import { prisma } from "../prisma";
import bcrypt from "bcryptjs";

export const checkExistMail = (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const registerUser = async (
  username: string,
  email: string,
  password: string
) => {
  const hashPass = await bcrypt.hash(password, 8);
  return prisma.user.create({
    data: { username, email, password: hashPass, role: "student" },
  });
};

export const checkUserExist = (id: number) => {
  return prisma.user.findUnique({
    where: { id },
  });
};


