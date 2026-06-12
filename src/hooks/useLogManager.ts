import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { useEffect } from 'react';
import api from '../services/api';
import { useAppStore } from '../stores/useAppStore';

export function useLogManager() {
  const queryClient = useQueryClient();
  const { setTodayMeals, setTodayExercises } = useAppStore();

  const mealsQuery = useQuery({
    queryKey: ['todayLogs', 'meals'],
    queryFn: async () => {
      const { data } = await api.get('/nutrition/meals/today/');
      return data;
    },
  });

  const exercisesQuery = useQuery({
    queryKey: ['todayLogs', 'exercises'],
    queryFn: async () => {
      const { data } = await api.get('/exercise/logs/today/');
      return data;
    },
  });

  // Sync query results into Zustand so the badge count in ChatScreen stays up to date
  useEffect(() => {
    if (mealsQuery.data) setTodayMeals(mealsQuery.data);
  }, [mealsQuery.data, setTodayMeals]);

  useEffect(() => {
    if (exercisesQuery.data) setTodayExercises(exercisesQuery.data);
  }, [exercisesQuery.data, setTodayExercises]);

  const deleteMeal = (id: number) => {
    Alert.alert('Eliminar comida', '¿Seguro que quieres eliminar esta entrada?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/nutrition/meal/${id}/`);
            queryClient.invalidateQueries({ queryKey: ['todayLogs'] });
            queryClient.invalidateQueries({ queryKey: ['dailyProgress'] });
          } catch {
            Alert.alert('Error', 'No se pudo eliminar la comida');
          }
        },
      },
    ]);
  };

  const deleteExercise = (id: number) => {
    Alert.alert('Eliminar ejercicio', '¿Seguro que quieres eliminar esta entrada?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/exercise/log/${id}/`);
            queryClient.invalidateQueries({ queryKey: ['todayLogs'] });
            queryClient.invalidateQueries({ queryKey: ['dailyProgress'] });
          } catch {
            Alert.alert('Error', 'No se pudo eliminar el ejercicio');
          }
        },
      },
    ]);
  };

  return {
    meals: mealsQuery.data ?? [],
    exercises: exercisesQuery.data ?? [],
    isLoading: mealsQuery.isLoading || exercisesQuery.isLoading,
    deleteMeal,
    deleteExercise,
    refetch: () => {
      mealsQuery.refetch();
      exercisesQuery.refetch();
    },
  };
}
