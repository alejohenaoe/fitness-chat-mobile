import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { useAppStore } from '../stores/useAppStore';
import type { DailyProgress } from '../types';

function mapApiToDailyProgress(data: any): DailyProgress {
  return {
    caloriesConsumed: data.calories_consumed ?? 0,
    caloriesBurned: data.calories_burned ?? 0,
    netCalories: data.net_calories ?? 0,
    calorieTarget: data.calorie_target ?? 2000,
    progressPct: data.progress_pct ?? 0,
    proteinG: data.protein_g ?? 0,
    carbsG: data.carbs_g ?? 0,
    fatG: data.fat_g ?? 0,
    mealsLogged: data.meals_logged ?? [],
    exercisesLogged: data.exercises_logged ?? [],
  };
}

export function useDailyProgress() {
  const setDailyProgress = useAppStore((s) => s.setDailyProgress);

  const query = useQuery({
    queryKey: ['dailyProgress'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/today/');
      return mapApiToDailyProgress(data);
    },
    refetchInterval: 30_000,
  });

  useEffect(() => {
    if (query.data) {
      setDailyProgress(query.data);
    }
  }, [query.data, setDailyProgress]);

  return query;
}
