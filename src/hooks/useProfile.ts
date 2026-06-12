import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import api from '../services/api';
import { useAppStore } from '../stores/useAppStore';
import type { UserProfile } from '../types';

export function useProfile() {
  const queryClient = useQueryClient();
  const { setUser, user } = useAppStore();

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await api.get('/profile/');
      return data as UserProfile;
    },
  });

  const statsQuery = useQuery({
    queryKey: ['profileStats'],
    queryFn: async () => {
      const { data } = await api.get('/profile/stats/');
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: Partial<UserProfile>) => {
      const { data } = await api.put('/profile/', values);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      if (user) {
        setUser({ ...user, profile: data });
      }
    },
    onError: () => {
      Alert.alert('Error', 'No se pudieron guardar los cambios');
    },
  });

  return {
    profile: profileQuery.data,
    stats: statsQuery.data,
    isLoading: profileQuery.isLoading,
    updateProfile: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}
