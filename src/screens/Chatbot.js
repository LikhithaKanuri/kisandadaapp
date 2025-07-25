import React, { useState } from 'react';
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const navigation = useNavigation();

  const handleSend = () => {
    if (inputText.trim() !== '') {
      const newMessage = { text: inputText.trim(), sender: 'user' };
      setMessages([...messages, newMessage]);
      setInputText('');
      // Simulate bot response
      setTimeout(() => {
        const botMessage = { text: `Echo: ${inputText.trim()}`, sender: 'bot' };
        setMessages([...messages, newMessage, botMessage]);
      }, 500);
    }
  };

  const suggestedQuestions = [
    'What are the best practices for growing wheat, from soil preparation to harvest?',
    'How do I manage common diseases like powdery mildew in crops like wheat?',
    'When and how should I fertilize sugarcane during the growing season?',
  ];

  const renderSuggestedQuestion = ({ item }) => (
    <TouchableOpacity style={styles.suggestedQuestionButton}>
      <Text style={styles.suggestedQuestionText}>{item}</Text>
    </TouchableOpacity>
  );

  const styles = createStyles();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: styles.container.backgroundColor }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerButton}>
              <Image style={styles.headerButtonImage} source={require('../../src/assets/list.png')} />
            </TouchableOpacity>
            <View style={styles.headerLogoContainer}>
              <Image style={styles.headerLogo} source={require('../../src/assets/applogo1.png')} />
              <Text style={styles.headerLogoText}>
                <Text style={styles.headerLogoTextMain}>KrishiSaarathi</Text>
                <Text style={styles.headerLogoTextDot}>.ai</Text>
              </Text>
            </View>
            <TouchableOpacity style={styles.headerButton}>
              <Image style={styles.headerButtonImage} source={require('../../src/assets/settings.png')} />
            </TouchableOpacity>
          </View>

          {/* Suggested questions */}
          <FlatList
            data={suggestedQuestions}
            renderItem={renderSuggestedQuestion}
            keyExtractor={(item, idx) => idx.toString()}
            style={styles.suggestedQuestionsList}
            contentContainerStyle={styles.suggestedQuestionsContent}
            showsVerticalScrollIndicator={false}
          />

          {/* Info note */}
          <Text style={styles.infoNote}>
            <Text style={{ fontSize: width * 0.027 }}>ⓘ </Text>
            AI-generated content. Please verify information independently.
          </Text>

          {/* Input area */}
          <View style={styles.inputWrapper}>
            <View style={styles.inputArea}>
              <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ask your question..."
                placeholderTextColor="#C0C0C0"
              />
              <TouchableOpacity style={styles.inputIconButton} onPress={handleSend}>
                <Image style={styles.inputIcon} source={require('../../src/assets/send.png')} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.inputIconButton}>
                <Image style={styles.inputIcon} source={require('../../src/assets/camera.png')} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.inputIconButton}>
                <Image style={styles.inputIcon} source={require('../../src/assets/mic.png')} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer bar */}
          <View style={styles.tabArea}>
            <TouchableOpacity style={styles.tabAreaButton}>
              <Image style={styles.tabAreaButtonImage} source={require('../../src/assets/chat.png')} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabAreaButton} onPress={() => navigation.navigate('VoiceInteraction')}>
              <Image style={styles.tabAreaButtonImage} source={require('../../src/assets/profile.png')} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = () => {
  const mainGreen = '#3E8577';
  const darkGreen = '#367165';
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: mainGreen,
      borderRadius: width * 0.06,
    },
    header: {
      height: height * 0.12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: width * 0.05,
      marginBottom: height * 0.01,
      marginTop: height * 0.015,
      backgroundColor: '#367165'
    },
    headerLogoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerLogo: {
      width: width * 0.10,
      height: width * 0.10,
      resizeMode: 'contain',
      marginRight: width * 0.01,
    },
    headerLogoText: {
      flexDirection: 'row',
      fontWeight: 'bold',
      fontSize: width * 0.06,
      color: '#F7CB46',
    },
    headerLogoTextMain: {
      color: '#F7CB46',
      fontWeight: 'bold',
      fontSize: width * 0.06,
    },
    headerLogoTextDot: {
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: width * 0.055,
    },
    headerButton: {
      padding: width * 0.02,
      borderRadius: width * 0.03,
    },
    headerButtonImage: {
      width: width * 0.075,
      height: width * 0.075,
      tintColor: '#fff',
      resizeMode: 'contain',
    },
    suggestedQuestionsList: {
      flexGrow: 0,
    },
    suggestedQuestionsContent: {
      paddingTop: height * 0.02,
      paddingHorizontal: width * 0.01,
      alignItems: 'center',
    },
    suggestedQuestionButton: {
      width: width * 0.87,
      backgroundColor: darkGreen,
      borderRadius: width * 0.06,
      marginVertical: height * 0.012,
      paddingVertical: height * 0.025,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 7,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.13,
      shadowRadius: 8,
    },
    suggestedQuestionText: {
      color: '#fff',
      fontSize: width * 0.044,
      textAlign: 'center',
      fontWeight: '500',
      lineHeight: width * 0.06,
    },
    infoNote: {
      fontSize: width * 0.022,
      color: '#EEE',
      opacity: 0.7,
      textAlign: 'center',
      marginTop: height * 0.12,
      marginBottom: height * 0.01,
    },
    inputWrapper: {
      width: '100%',
      alignItems: 'center',
      position: 'absolute',
      bottom: height * 0.11,
      left: 0,
      zIndex: 10,
    },
    inputArea: {
      width: width * 0.93,
      backgroundColor: mainGreen,
      borderRadius: width * 0.07,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: width * 0.04,
      paddingVertical: height * 0.015,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 7,
      elevation: 5,
      borderWidth: 1.3,
      borderColor: '#264a40',
    },
    input: {
      flex: 1,
      fontSize: width * 0.043,
      color: '#fff',
      paddingVertical: 0,
      marginRight: width * 0.02,
    },
    inputIconButton: {
      marginHorizontal: width * 0.01,
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputIcon: {
      width: width * 0.06,
      height: width * 0.06,
      tintColor: '#fff',
    },
    tabArea: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      height: height * 0.09,
      backgroundColor: '#367165',
      borderBottomLeftRadius: width * 0.06,
      borderBottomRightRadius: width * 0.06,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.10,
      shadowRadius: 8,
      elevation: 12,
    },
    tabAreaButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabAreaButtonImage: {
      width: width * 0.10,
      height: width * 0.10,
      tintColor: '#fff',
      resizeMode: 'contain',
    },
  });
};

export default Chatbot;