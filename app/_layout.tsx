import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import { useAppStore } from '../src/stores/useAppStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function AuthGuard() {
  const { isAuthenticated, setUser } = useAppStore();
  const router = useRouter();
  const segments = useSegments();

  // On mount, check for stored tokens and restore session + fetch user profile
  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync('access_token');
      if (token && !isAuthenticated) {
        try {
          // Fetch user profile to restore full session state
          const { data } = await (await import('axios')).default.get(
            `${process.env.EXPO_PUBLIC_API_BASE_URL}/profile/`,
            { headers: { Authorization: `Bearer ${token}` } },
          );
          setUser({ id: data.id ?? 0, first_name: data.first_name ?? '', email: data.email ?? '', profile: data });
        } catch {
          // Token invalid — clear and force login
          await SecureStore.deleteItemAsync('access_token');
          await SecureStore.deleteItemAsync('refresh_token');
        }
      }
    })();
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments]);

  return null;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AuthGuard />
        <Stack screenOptions={{ headerShown: false }} />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
