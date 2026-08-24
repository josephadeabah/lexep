"use client";

import { create } from "zustand";
import { api, setToken } from "./api";
import type { User } from "./types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, fullName: string, password: string) => Promise<User>;
  logout: () => void;
  hydrate: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isInitialized: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await api.login({ email, password });
      setToken(res.access_token);
      set({ user: res.user, isLoading: false });
      return res.user;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  register: async (email, fullName, password) => {
    set({ isLoading: true });
    try {
      const res = await api.register({ email, full_name: fullName, password });
      setToken(res.access_token);
      set({ user: res.user, isLoading: false });
      return res.user;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  logout: () => {
    setToken(null);
    set({ user: null });
  },

  hydrate: async () => {
    const { getToken } = await import("./api");
    const token = getToken();
    if (!token) {
      set({ isInitialized: true });
      return;
    }
    try {
      const user = await api.me();
      set({ user, isInitialized: true });
    } catch {
      setToken(null);
      set({ user: null, isInitialized: true });
    }
  },

  setUser: (user) => set({ user }),
}));
