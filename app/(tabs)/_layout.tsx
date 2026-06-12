import { Tabs } from 'expo-router';
import { MessageSquare, TrendingUp, History, User } from 'lucide-react-native';
import { colors } from '../../src/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.surface900,
          borderTopColor: 'rgba(255,255,255,0.05)',
          borderTopWidth: 1,
          paddingBottom: 4,
        },
        tabBarActiveTintColor: colors.brand400,
        tabBarInactiveTintColor: colors.surface100,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => <MessageSquare color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progreso',
          tabBarIcon: ({ color }) => <TrendingUp color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Historial',
          tabBarIcon: ({ color }) => <History color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <User color={color} size={22} />,
        }}
      />
    </Tabs>
  );
}
