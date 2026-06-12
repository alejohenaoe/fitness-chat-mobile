import { useEffect, useRef, useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Menu, Sparkles } from 'lucide-react-native';
import { ChatBubble } from '../../src/components/chat/ChatBubble';
import { ChatInput } from '../../src/components/chat/ChatInput';
import { TypingIndicator } from '../../src/components/chat/TypingIndicator';
import { Drawer } from '../../src/components/Drawer';

import { useAppStore } from '../../src/stores/useAppStore';
import { useChat } from '../../src/hooks/useChat';
import api from '../../src/services/api';
import { colors } from '../../src/constants/colors';
import { fontSize, spacing } from '../../src/constants/layout';
import type { ChatMessage } from '../../src/types';

export default function ChatScreen() {
  const { currentSessionMessages, isAiTyping, setMessages, setCurrentSessionId } =
    useAppStore();
  const { sendMessage } = useChat();
  const flatListRef = useRef<FlatList>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const loadTodaySession = useCallback(async () => {
    try {
      const { data } = await api.get('/chat/sessions/today/');
      const sessionId = data.id ?? data[0]?.id;
      if (sessionId) {
        setCurrentSessionId(sessionId);
        const { data: messages } = await api.get(`/chat/sessions/${sessionId}/messages/`);
        setMessages(messages);
      } else {
        setMessages([]);
        setCurrentSessionId(null);
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setMessages([]);
        setCurrentSessionId(null);
      }
    }
  }, [setMessages, setCurrentSessionId]);

  useFocusEffect(
    useCallback(() => {
      loadTodaySession();
    }, [loadTodaySession]),
  );

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (currentSessionMessages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [currentSessionMessages.length, isAiTyping]);

  const renderItem = ({ item }: { item: ChatMessage }) => <ChatBubble message={item} />;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setDrawerOpen(true)} style={styles.headerBtn}>
          <Menu color={colors.white} size={24} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>✨ NutriCoach</Text>
          <Text style={styles.headerSubtitle}>{isAiTyping ? 'Escribiendo...' : 'En línea'}</Text>
        </View>

        <View style={{ width: 32 }} />
      </View>

      {/* Message list */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={currentSessionMessages}
          renderItem={renderItem}
          keyExtractor={(item, idx) => item.id?.toString() ?? idx.toString()}
          contentContainerStyle={styles.messageList}
          ListEmptyComponent={<EmptyChat />}
          ListFooterComponent={isAiTyping ? <TypingIndicator /> : null}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        <ChatInput onSend={sendMessage} disabled={isAiTyping} />
      </KeyboardAvoidingView>

      {/* Drawer */}
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </SafeAreaView>
  );
}

function EmptyChat() {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Sparkles color={colors.brand500} size={40} />
      </View>
      <Text style={styles.emptyTitle}>¡Hola! Soy NutriCoach</Text>
      <Text style={styles.emptyText}>
        Cuéntame qué comiste o qué ejercicio hiciste hoy y lo registro por ti.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface900,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  headerBtn: {
    padding: 4,
    position: 'relative',
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { color: colors.white, fontSize: fontSize.lg, fontWeight: '700' },
  headerSubtitle: { color: colors.surface100, fontSize: fontSize.xs, marginTop: 1 },
  messageList: { paddingVertical: spacing.md, flexGrow: 1 },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    marginTop: 80,
  },
  emptyIcon: { marginBottom: spacing.md },
  emptyTitle: {
    color: colors.white,
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    color: colors.surface100,
    fontSize: fontSize.md,
    textAlign: 'center',
    lineHeight: 22,
  },
});
