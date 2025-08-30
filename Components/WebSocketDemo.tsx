import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native';
import useWebSocket from './useWebSocket';

export default function WebSocketDemo() {
  const { connected, messages, start, disconnect, send } = useWebSocket();
  const styles = useStyles();

  const [text, setText] = useState('');
  const [myId, setMyId] = useState<number | null>(null);

  // detect welcome message to capture assigned client id
  useEffect(() => {
    if (messages.length === 0) return;
    // parse latest message to look for welcome
    try {
      const last = messages[messages.length - 1];
      const parsed = JSON.parse(last);
      if (parsed && parsed.type === 'welcome' && parsed.id) {
        setMyId(parsed.id);
      }
    } catch {
      /* ignore non-json messages */
    }
  }, [messages]);

  function sendPing() {
    send('Ping!');
  }

  function sendChat() {
    if (!text.trim() || !connected) return;
    send(text.trim()); // server will echo back and broadcast to others
    setText('');
  }

  // eslint-disable-next-line react/no-unstable-nested-components
  function CustomButton({
    title,
    onPress,
    disabled,
  }: {
    title: string;
    onPress: () => void;
    disabled?: boolean;
  }) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.button,
          disabled ? styles.buttonDisabled : styles.buttonActive,
          !disabled && pressed ? styles.buttonPressed : null,
        ]}
        accessibilityRole="button"
        accessibilityState={{ disabled: !!disabled }}
      >
        <Text
          style={[
            styles.buttonText,
            disabled ? styles.buttonTextDisabled : null,
          ]}
        >
          {title}
        </Text>
      </Pressable>
    );
  }

  function formatIncoming(raw: string) {
    try {
      const obj = JSON.parse(raw);
      switch (obj.type) {
        case 'welcome':
          return `System: Welcome — your id ${obj.id} (total ${obj.total})`;
        case 'echo':
          return obj.from === myId
            ? `You: ${obj.text}`
            : `User ${obj.from} (echo): ${obj.text}`;
        case 'broadcast':
        case 'broadcastAll':
          return `User ${obj.from}: ${obj.text}`;
        case 'clientDisconnected':
          return `System: Client ${obj.id} disconnected (total ${obj.total})`;
        default:
          return JSON.stringify(obj);
      }
    } catch {
      // not JSON — display raw text
      return raw;
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <CustomButton
          title="Start Connection"
          onPress={start}
          disabled={connected}
        />
      </View>

      <View style={styles.buttonRow}>
        <CustomButton
          title="Send Ping"
          onPress={sendPing}
          disabled={!connected}
        />
      </View>

      <View style={styles.buttonRow}>
        <CustomButton
          title="Disconnect"
          onPress={disconnect}
          disabled={!connected}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Type a message..."
        placeholderTextColor="#94a3b8"
        value={text}
        onChangeText={setText}
        editable={connected}
        onSubmitEditing={sendChat}
        returnKeyType="send"
      />

      <View style={styles.buttonRow}>
        <CustomButton
          title="Send Chat"
          onPress={sendChat}
          disabled={!connected || text.trim().length === 0}
        />
      </View>
      <Text style={styles.statusText}>
        Connected: {connected ? 'Yes' : 'No'} {myId ? `(id ${myId})` : ''}
      </Text>

      <ScrollView style={styles.messagesBox}>
        {messages.map((msg, index) => (
          <Text key={index} style={styles.messageItem}>
            {formatIncoming(msg)}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

const useStyles = () =>
  useMemo(
    () =>
      StyleSheet.create({
        container: {
          padding: 20,
        },
        buttonRow: {
          marginBottom: 8,
        },
        statusText: {
          marginVertical: 8,
        },
        messageText: {
          marginBottom: 4,
        },

        /* Button styles */
        button: {
          borderRadius: 8,
          paddingVertical: 12,
          paddingHorizontal: 16,
          alignItems: 'center',
          justifyContent: 'center',
        },
        buttonActive: {
          backgroundColor: '#0A84FF', // high-contrast blue
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 1.5,
          elevation: 2,
        },
        buttonPressed: {
          backgroundColor: '#0066cc', // slightly darker when pressed
        },
        buttonDisabled: {
          backgroundColor: '#1f2937', // darker grey for better contrast
        },
        buttonText: {
          color: '#ffffff',
          fontWeight: '600',
        },
        buttonTextDisabled: {
          color: '#9ca3af', // lighter disabled text for contrast
          fontWeight: '600',
        },

        /* input */
        input: {
          borderWidth: 1,
          borderColor: '#334155',
          backgroundColor: '#0b1220',
          color: '#e6eef8',
          paddingVertical: 10,
          paddingHorizontal: 12,
          borderRadius: 8,
          marginBottom: 8,
        },

        /* messages box */
        messagesBox: {
          marginTop: 12,

          color: 'black',
        },
        messageItem: {
          padding: 8,
          borderRadius: 6,
          marginBottom: 8,
        },
      }),
    [],
  );
