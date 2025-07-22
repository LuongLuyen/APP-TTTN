import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import GEMINI_API_KEY from '../constants/chatGpt'; // Đổi tên file key nếu cần
import Header from '../components/Header';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + GEMINI_API_KEY;

export default function ChatGeminiScreen() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = { role: 'user', content: inputText };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: inputText }],
            },
          ],
        }),
      });

      const data = await response.json();

      if (
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts
      ) {
        const reply = data.candidates[0].content.parts
          .map((part) => part.text)
          .join('');
        const botMessage = { role: 'assistant', content: reply };
        setMessages((prev) => [...prev, botMessage]);
      } else if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `❌ Lỗi Gemini: ${data.error.message}` },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: '❌ Không có phản hồi từ Gemini.' },
        ]);
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '❌ Lỗi khi gọi Gemini API.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.role === 'user' ? styles.userMessage : styles.botMessage,
      ]}
    >
      <Text style={styles.messageText}>
        {item.role === 'user' ? '🧑 Bạn: ' : '🤖 Bot: '}
        {item.content}
      </Text>
    </View>
  );

  // Nếu đang loading thì thêm tin nhắn giả "Bot đang suy nghĩ..."
  const displayedMessages = isLoading
    ? [...messages, { role: 'assistant', content: '⏳ Bot đang suy nghĩ...' }]
    : messages;

  return (
    <>
    
     <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <SafeAreaView style={{ flex: 1 }}>
          <Header></Header>
        <View style={styles.inputContainer}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Nhập câu hỏi..."
            style={styles.input}
          />
          <Button title="Gửi" onPress={sendMessage} />
        </View>

        <FlatList
          data={displayedMessages}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.chatContainer}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  chatContainer: { padding: 10 },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 50,
    padding:10,
    marginRight: 10,
  },
  messageContainer: {
    padding: 10,
    marginVertical: 4,
    borderRadius: 6,
    maxWidth: '90%',
  },
  userMessage: {
    backgroundColor: '#d0e8ff',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#e6ffe6',
    alignSelf: 'flex-start',
  },
  messageText: { fontSize: 16 },
});
