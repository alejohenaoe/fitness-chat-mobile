import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';
import type { User, DailyProgress, ChatMessage, MealLog, ExerciseLog, ChatSession } from '../types';

const DEFAULT_DAILY_PROGRESS: DailyProgress = {
  caloriesConsumed: 0,
  caloriesBurned: 0,
  netCalories: 0,
  calorieTarget: 2000,
  progressPct: 0,
  proteinG: 0,
  carbsG: 0,
  fatG: 0,
  mealsLogged: [],
  exercisesLogged: [],
};

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logout: () => Promise<void>;

  // Chat
  currentSessionId: number | null;
  currentSessionMessages: ChatMessage[];
  isAiTyping: boolean;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  setIsAiTyping: (v: boolean) => void;
  setCurrentSessionId: (id: number | null) => void;
  sessions: ChatSession[];
  setSessions: (sessions: ChatSession[]) => void;
  loadSessionMessages: (sessionId: number) => Promise<void>;

  // Daily progress
  dailyProgress: DailyProgress;
  setDailyProgress: (p: DailyProgress) => void;

  // Today's logs
  todayMeals: MealLog[];
  todayExercises: ExerciseLog[];
  setTodayMeals: (m: MealLog[]) => void;
  setTodayExercises: (e: ExerciseLog[]) => void;

  // UI
  showEntries: boolean;
  toggleEntries: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Auth
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  logout: async () => {
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('refresh_token');
    set({
      user: null,
      isAuthenticated: false,
      currentSessionId: null,
      currentSessionMessages: [],
      dailyProgress: DEFAULT_DAILY_PROGRESS,
      todayMeals: [],
      todayExercises: [],
    });
  },

  // Chat
  currentSessionId: null,
  currentSessionMessages: [],
  isAiTyping: false,
  setMessages: (messages) => set({ currentSessionMessages: messages }),
  addMessage: (message) =>
    set((state) => ({
      currentSessionMessages: [...state.currentSessionMessages, message],
    })),
  setIsAiTyping: (v) => set({ isAiTyping: v }),
  setCurrentSessionId: (id) => set({ currentSessionId: id }),
  sessions: [],
  setSessions: (sessions) => set({ sessions }),
  loadSessionMessages: async (sessionId) => {
    const { data } = await api.get(`/chat/sessions/${sessionId}/messages/`);
    set({ currentSessionMessages: data, currentSessionId: sessionId });
  },

  // Daily progress
  dailyProgress: DEFAULT_DAILY_PROGRESS,
  setDailyProgress: (p) => set({ dailyProgress: p }),

  // Today's logs
  todayMeals: [],
  todayExercises: [],
  setTodayMeals: (m) => set({ todayMeals: m }),
  setTodayExercises: (e) => set({ todayExercises: e }),

  // UI
  showEntries: false,
  toggleEntries: () => set((state) => ({ showEntries: !state.showEntries })),
}));
