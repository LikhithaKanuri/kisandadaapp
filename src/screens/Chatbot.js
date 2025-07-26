import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Image,
  SafeAreaView,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import { getLanguage } from '../database/localdb';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const TypingIndicator = () => {
  const dotAnims = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)])
    .current;

  useEffect(() => {
    const createAnimation = (anim, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 1, duration: 300, delay, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 300, useNativeDriver: true }),
        ])
      );
    };

    const animations = dotAnims.map((anim, i) => createAnimation(anim, i * 300));
    animations.forEach((anim) => anim.start());

    return () => animations.forEach((anim) => anim.stop());
  }, []);

  return (
    <View style={styles.typingContainer}>
      {dotAnims.map((anim, i) => (
        <Animated.View
          key={i}
          style={[
            styles.typingDot,
            { transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -5] }) }] }
          ]}
        />
      ))}
    </View>
  );
};

const AnimatedMessage = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const index = useRef(0);

  useEffect(() => {
    if (index.current < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text.charAt(index.current));
        index.current += 1;
      }, 50);
      return () => clearTimeout(timer);
    } else {
      onComplete && onComplete();
    }
  }, [displayedText, text, onComplete]);

  return <Text style={styles.messageText}>{displayedText}</Text>;
};

const Chatbot = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [image, setImage] = useState(null);
  const navigation = useNavigation();
  const flatListRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert(t('Sorry, we need camera permissions to make this work!'));
      }
    })();
  }, []);

  useEffect(() => {
    const getVoice = async () => {
      const voices = await Speech.getAvailableVoicesAsync();
      const voice = voices.find(v => v.language === 'en-GB' && v.name.includes('male')) ||
                    voices.find(v => v.language === 'en-US' && v.name.includes('male')) ||
                    null;
      setSelectedVoice(voice?.identifier);
    };
    getVoice();
  }, []);

  const handleFeedback = (messageId, feedbackType) => {
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === messageId ? { ...msg, feedback: msg.feedback === feedbackType ? null : feedbackType } : msg
      )
    );
  };

  const handleSelectQuestion = (question) => {
    setInputText(question);
  };

  const handleCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({ allowsEditing: false, quality: 1 });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleSend = async () => {
    if ((inputText.trim() === '' && !image) || isLoading) return;

    const newMessage = {
      id: Date.now(),
      text: inputText.trim(),
      sender: 'user',
      imageUri: image,
    };
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setImage(null);
    setIsLoading(true);

    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    const lang = await getLanguage();
    const url = `https://kissan-dada.kenpath.ai/chat/?query=${encodeURIComponent(newMessage.text)}&target_lang=${lang || 'en'}`;

    try {
      const response = await axios.get(url, { responseType: 'text' });
      let botResponse = response.data;
      if (botResponse.startsWith('"') && botResponse.endsWith('"')) {
        botResponse = botResponse.slice(1, -1);
      }

      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        feedback: null,
        animated: true,
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Axios error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Error: Could not connect to the server.',
        sender: 'bot',
        feedback: null,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = async (text) => {
    if (isSpeaking) {
      await Speech.stop();
    }
    Speech.speak(text, {
      voice: selectedVoice,
      pitch: 0.9,
      rate: 0.8,
      onStart: () => setIsSpeaking(true),
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const suggestedQuestions = [
    t('What are the best practices for growing wheat, from soil preparation to harvest?'),
    t('How do I manage common diseases like powdery mildew in crops like wheat?'),
    t('When and how should I fertilize sugarcane during the growing season?'),
  ];

  const renderSuggestedQuestion = ({ item }) => (
    <TouchableOpacity style={styles.suggestedQuestionButton} onPress={() => handleSelectQuestion(item)}>
      <Text style={styles.suggestedQuestionText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }) => (
    <View style={[styles.messageRow, item.sender === 'bot' ? styles.botRow : styles.userRow]}>
      <View style={[styles.message, item.sender === 'bot' ? styles.botMessage : styles.userMessage]}>
        {item.imageUri && <Image source={{ uri: item.imageUri }} style={styles.messageImage} />}
        {item.text.length > 0 && (
          item.animated ? (
            <AnimatedMessage
              text={item.text}
              onComplete={() => {
                const newMessages = messages.map(m => m.id === item.id ? { ...m, animated: false, sender:'bot' } : m);
                setMessages(newMessages);
              }}
            />
          ) : (
            <Text style={styles.messageText}>{item.text}</Text>
          )
        )}
      </View>
      {item.sender === 'bot' && (
        <View style={styles.iconActions}>
          <TouchableOpacity onPress={() => handleSpeak(item.text)}>
            <AntDesign name="sound" size={22} color={isSpeaking ? '#F7CB46' : '#E0E0E0'} style={styles.actionIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleFeedback(item.id, 'liked')}>
            <AntDesign name="like1" size={20} color={item.feedback === 'liked' ? '#F7CB46' : '#E0E0E0'} style={styles.actionIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleFeedback(item.id, 'disliked')}>
            <AntDesign name="dislike1" size={20} color={item.feedback === 'disliked' ? '#F7CB46' : '#E0E0E0'} style={styles.actionIcon} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerLogoContainer}>
            <Image style={styles.headerLogo} source={require('../../assets/applogo1.png')} />
            <Text style={styles.headerLogoText}>
              <Text style={styles.headerLogoTextMain}>{t('Kisan Dada')}</Text>
              <Text style={styles.headerLogoTextDot}>.ai</Text>
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Options')}>
            <Image style={styles.headerButtonImage} source={require('../../assets/settings.png')} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.contentArea}>
          {messages.length === 0 ? (
            <FlatList
              data={suggestedQuestions}
              renderItem={renderSuggestedQuestion}
              keyExtractor={(item, idx) => `sq-${idx}`}
              contentContainerStyle={styles.suggestedQuestionsContent}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.messagesContainer}
              ListFooterComponent={isLoading ? (
                <View style={[styles.messageRow, styles.botRow]}>
                  <View style={[styles.message, styles.botMessage, styles.loadingContainer]}>
                    <TypingIndicator />
                  </View>
                </View>
              ) : null}
            />
          )}
        </View>

        {image && (
          <View style={styles.previewContainer}>
            <Image source={{ uri: image }} style={styles.previewImage} />
            <TouchableOpacity style={styles.removeImageButton} onPress={() => setImage(null)}>
              <AntDesign name="closecircle" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.infoNote}>
          <Text style={{ fontSize: width * 0.027 }}>ⓘ </Text>
          {t('AI-generated content. Please verify information independently.')}
        </Text>

        {/* Input */}
        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder={t("Ask your question...")}
            placeholderTextColor="#C0C0C0"
          />
          <TouchableOpacity style={styles.inputIconButton} onPress={handleSend}>
            <Image style={styles.inputIcon} source={require('../../assets/send.png')} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.inputIconButton, { marginLeft: 8 }]} onPress={handleCamera}>
            <Image style={styles.inputIcon} source={require('../../assets/camera.png')} />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.tabArea}>
          <TouchableOpacity style={styles.tabAreaButton}>
            <Image style={styles.tabAreaButtonImage} source={require('../../assets/chat.png')} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabAreaButton} onPress={() => navigation.navigate('VoiceInteraction')}>
            <Image style={styles.tabAreaButtonImage} source={require('../../assets/profile.png')} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


const mainGreen = '#3E8577';
const darkGreen = '#367165';

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: mainGreen },
  container: { flex: 1, backgroundColor: mainGreen },
  header: {
    height: height * 0.1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    backgroundColor: darkGreen,
  },
  headerLogoContainer: { flexDirection: 'row', alignItems: 'center' },
  headerLogo: {
    width: width * 0.1,
    height: width * 0.1,
    resizeMode: 'contain',
    marginRight: width * 0.01,
  },
  headerLogoText: {
    fontWeight: 'bold',
    fontSize: width * 0.06,
    color: '#F7CB46',
  },
  headerLogoTextMain: { color: '#F7CB46', fontWeight: 'bold' },
  headerLogoTextDot: { color: '#ffffff', fontWeight: 'bold' },
  headerButtonImage: {
    width: width * 0.075,
    height: width * 0.075,
    tintColor: '#fff',
    resizeMode: 'contain',
  },
  contentArea: { flex: 1 },
  suggestedQuestionsContent: {
    paddingVertical: height * 0.02,
    alignItems: 'center',
  },
  suggestedQuestionButton: {
    width: width * 0.9,
    backgroundColor: darkGreen,
    borderRadius: width * 0.06,
    marginVertical: height * 0.012,
    paddingVertical: height * 0.025,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  suggestedQuestionText: {
    color: '#fff',
    fontSize: width * 0.035,
    textAlign: 'center',
    fontWeight: '500',
    paddingHorizontal: width * 0.05,
  },
  messagesContainer: { paddingHorizontal: 10, paddingVertical: 20 },
  messageRow: {
    marginVertical: 5,
    maxWidth: '75%',
  },
  userRow: {
    alignSelf: 'flex-end',
  },
  botRow: {
    alignSelf: 'flex-start',
  },
  message: {
    padding: 12,
    borderRadius: 18,
  },
  userMessage: {
    backgroundColor: '#367165',
    borderBottomRightRadius: 5,
  },
  botMessage: {
    backgroundColor: '#264a40',
    borderBottomLeftRadius: 5,
  },
  messageText: { color: '#fff', fontSize: 16 },
  messageImage: {
    width: width * 0.6,
    height: width * 0.45,
    borderRadius: 15,
    marginBottom: 5,
  },
  loadingContainer: {
    width: 80,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginHorizontal: 3,
  },
  iconActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 10,
    paddingLeft: 12,
  },
  actionIcon: {
    marginRight: 20,
    opacity: 0.9,
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: darkGreen,
  },
  previewImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  removeImageButton: {
    marginLeft: 10,
  },
  infoNote: {
    fontSize: width * 0.025,
    color: '#EEE',
    opacity: 0.8,
    textAlign: 'center',
    marginVertical: height * 0.01,
  },
  inputArea: {
    width: width * 0.93,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: mainGreen,
    borderRadius: width * 0.07,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.015,
    marginBottom: height * 0.02,
    borderWidth: 1.3,
    borderColor: '#264a40',
  },
  input: {
    flex: 1,
    fontSize: width * 0.043,
    color: '#fff',
    marginRight: width * 0.02,
  },
  inputIconButton: { marginHorizontal: width * 0.01 },
  inputIcon: {
    width: width * 0.06,
    height: width * 0.06,
    tintColor: '#fff',
  },
  tabArea: {
    height: height * 0.09,
    backgroundColor: darkGreen,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  tabAreaButton: { flex: 1, alignItems: 'center' },
  tabAreaButtonImage: {
    width: width * 0.1,
    height: width * 0.1,
    tintColor: '#fff',
    resizeMode: 'contain',
  },
});

export default Chatbot;
