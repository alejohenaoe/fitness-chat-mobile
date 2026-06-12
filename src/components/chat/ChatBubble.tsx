import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fontSize, borderRadius, spacing } from '../../constants/layout';
import type { ChatMessage } from '../../types';
import { MessageCard } from './MessageCard';

interface ChatBubbleProps {
  message: ChatMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <View style={[styles.wrapper, isUser ? styles.wrapperUser : styles.wrapperAssistant]}>
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
        <Text style={styles.text}>{message.content}</Text>
      </View>
      {message.extracted_data &&
        (message.extracted_data.extracted_foods?.length ||
          message.extracted_data.extracted_exercises?.length) ? (
        <MessageCard extractedData={message.extracted_data} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 4,
    marginHorizontal: spacing.md,
    maxWidth: '80%',
  },
  wrapperUser: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  wrapperAssistant: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  bubble: {
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  bubbleUser: {
    backgroundColor: colors.brand500,
    borderBottomRightRadius: 4,
  },
  bubbleAssistant: {
    backgroundColor: colors.surface800,
    borderBottomLeftRadius: 4,
  },
  text: {
    color: colors.white,
    fontSize: fontSize.md,
    lineHeight: 22,
  },
});
