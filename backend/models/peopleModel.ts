import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createUser = async (data: any) => {
	return prisma.people.create({ data });
};


export const getUserById = async (id: number) => {
	return prisma.people.findUnique({ where: { id } });
};

export const getUserByUsername = async (username: string) => {
	return prisma.people.findFirst({ where: { username } });
};

export const getAllUsers = async () => {
	return prisma.people.findMany();
};

export const updateUserById = async (id: number, data: any) => {
  return prisma.people.update({ where: { id }, data });
};

export const findUserByRefreshToken = async (refreshToken: string) => {
  return prisma.people.findFirst({ where: { refreshToken } });
};

export const clearUserRefreshToken = async (id: number) => {
  return prisma.people.update({ where: { id }, data: { refreshToken: null } });
};
