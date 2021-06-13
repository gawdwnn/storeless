import { ProductCategory, Role } from "../types";

export const isAdmin = (role: Role | null) => role === "ADMIN" || role === "SUPER_ADMIN";

export const isClient = (role: Role | null) => role === "CLIENT";

export const categories: ProductCategory[] = [
  "Clothing",
  "Shoes",
  "Watches",
  "Accessories",
];

export const formatAmount = (amount: number) =>
  amount.toLocaleString("en", { minimumFractionDigits: 2 });

export const calculateTotalPages = (totalItems: number, perPage: number) =>
  Math.ceil(totalItems / perPage);
