import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { useAppStore } from '../stores/useAppStore';
import type { ChatMessage } from '../types';

export function useChat() {
  const queryClient = useQueryClient();
  const { addMessage, setIsAiTyping, currentSessionId } = useAppStore();

  const sendMessage = useCallback(
    async (content: string) => {
      const userMessage: ChatMessage = { role: 'user', content, created_at: new Date().toISOString() };
      addMessage(userMessage);
      setIsAiTyping(true);

      try {
        const body: Record<string, unknown> = { message: content };
        if (currentSessionId) {
          body.session_id = currentSessionId;
        }
        console.log('CHAT: sending message', JSON.stringify(body));
        const { data } = await api.post('/chat/message/', body);
        console.log('CHAT: response', JSON.stringify(data, null, 2));
        const { assistant_message } = data;
        const assistantMessage: ChatMessage = {
          id: assistant_message.id,
          role: 'assistant',
          content: assistant_message.content,
          message_type: assistant_message.message_type,
          created_at: assistant_message.created_at,
          extracted_data: assistant_message.extracted_data,
        };
        addMessage(assistantMessage);

        // Refresh progress & logs after new message (backend may have created logs)
        queryClient.invalidateQueries({ queryKey: ['dailyProgress'] });
        queryClient.invalidateQueries({ queryKey: ['todayLogs'] });
      } catch (err: any) {
        console.log('CHAT: error', err.message, err.response?.status, JSON.stringify(err.response?.data, null, 2));
        const detail = typeof err.response?.data === 'string'
          ? err.response?.data?.match(/<title>([^<]+)<\/title>/)?.[1]
          : undefined;
        const msg = detail || err.response?.data?.detail || err.response?.data?.error || err.message || 'Error al enviar mensaje';
        Alert.alert('Error', msg);
      } finally {
        setIsAiTyping(false);
      }
    },
    [addMessage, setIsAiTyping, queryClient, currentSessionId],
  );

  return { sendMessage };
}
