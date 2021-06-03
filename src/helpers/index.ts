import { Role } from '../types';

export const isAdmin = (role: Role | null) => role === 'ADMIN' || role === 'SUPER_ADMIN';

export const isClient = (role: Role | null) => role === 'CLIENT';
