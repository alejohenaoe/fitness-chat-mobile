import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MessageSquare, LogOut, X, Plus, Sparkles } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';
import { useAppStore } from '../stores/useAppStore';
import api from '../services/api';
import { colors } from '../constants/colors';
import { fontSize, spacing, borderRadius } from '../constants/layout';
import type { ChatSession } from '../types';

const DRAWER_WIDTH = Dimensions.get('window').width * 0.75;

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Drawer({ isOpen, onClose }: DrawerProps) {
  const router = useRouter();
  const { user, sessions, setSessions, currentSessionId, loadSessionMessages, logout } = useAppStore();
  const [loading, setLoading] = useState(false);
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: isOpen ? 0 : -DRAWER_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: isOpen ? 0.5 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && sessions.length === 0) {
      loadSessions();
    }
  }, [isOpen]);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/chat/sessions/');
      setSessions(data);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout/');
    } catch {
      // Continue logout even if API call fails
    }
    await logout();
    onClose();
  };

  const handleSelectSession = async (session: ChatSession) => {
    onClose();
    await loadSessionMessages(session.id);
  };

  const handleNewChat = () => {
    onClose();
    const store = useAppStore.getState();
    store.setMessages([]);
    store.setCurrentSessionId(null);
    router.replace('/(tabs)');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Hoy';
    if (date.toDateString() === yesterday.toDateString()) return 'Ayer';

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getSessionTitle = (session: ChatSession) => {
    const msg = session.messages?.[0]?.content;
    if (msg) {
      return msg.length > 40 ? msg.slice(0, 40) + '…' : msg;
    }
    return `Sesión ${session.id}`;
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={isOpen ? 'auto' : 'none'}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.overlay, { opacity: overlayOpacity }]} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.drawer, { transform: [{ translateX }] }]}>
        <View style={styles.drawerHeader}>
          <View style={styles.logoRow}>
            <Sparkles color={colors.brand500} size={20} />
            <Text style={styles.appName}>FitnessChat</Text>
          </View>
          <TouchableOpacity onPress={onClose}>
            <X color={colors.surface100} size={20} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.newChatBtn} onPress={handleNewChat} activeOpacity={0.7}>
          <Plus color={colors.white} size={18} />
          <Text style={styles.newChatText}>Nuevo chat</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {(() => {
          const nonEmpty = sessions.filter(s => s.messages && s.messages.length > 0);
          if (loading) {
            return <ActivityIndicator color={colors.brand500} style={{ marginTop: spacing.xl }} />;
          }
          if (nonEmpty.length === 0) {
            return <Text style={styles.emptyText}>Sin conversaciones aún</Text>;
          }
          return (
            <ScrollView style={styles.sessionList} showsVerticalScrollIndicator={false}>
              {nonEmpty.map((session) => {
              const active = session.id === currentSessionId;
              return (
                <TouchableOpacity
                  key={session.id}
                  style={[styles.sessionItem, active && styles.sessionItemActive]}
                  onPress={() => handleSelectSession(session)}
                  activeOpacity={0.7}
                >
                  <MessageSquare color={active ? colors.brand500 : colors.surface100} size={16} />
                  <View style={styles.sessionText}>
                    <Text style={[styles.sessionTitle, active && styles.sessionTitleActive]} numberOfLines={1}>
                      {getSessionTitle(session)}
                    </Text>
                    <Text style={styles.sessionDate}>{formatDate(session.date)}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          );
        })()}

        <View style={styles.divider} />

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
          <LogOut color={colors.red400} size={18} />
          <Text style={[styles.logoutText]}>Cerrar sesión</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: '#000',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: colors.surface900,
    padding: spacing.lg,
    paddingTop: 60,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.06)',
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  appName: { color: colors.white, fontSize: fontSize.xl, fontWeight: '700' },
  newChatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    marginBottom: spacing.sm,
  },
  newChatText: { color: colors.white, fontSize: fontSize.sm, fontWeight: '500' },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    marginVertical: spacing.sm,
  },
  sessionList: {
    flex: 1,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 10,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
  },
  sessionItemActive: {
    backgroundColor: 'rgba(34,197,94,0.1)',
  },
  sessionText: {
    flex: 1,
  },
  sessionTitle: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  sessionTitleActive: {
    color: colors.brand500,
  },
  sessionDate: {
    color: colors.surface100,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  emptyText: {
    color: colors.surface100,
    fontSize: fontSize.sm,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 10,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
  },
  logoutText: {
    color: colors.red400,
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
});
