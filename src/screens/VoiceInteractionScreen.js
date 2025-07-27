import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { getLanguage, getSession } from '../database/localdb';

const { width, height } = Dimensions.get('window');

const VoiceInteractionScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  // Component State
  const [connectionStatus, setConnectionStatus] = useState('connecting'); // 'connecting', 'connected', 'disconnected'
  const [timer, setTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Refs for managing WebSocket, audio, and timers
  const ws = useRef(null);
  const soundRef = useRef(new Audio.Sound());
  const recordingRef = useRef(null);
  const callTimerIdRef = useRef(null);
  const recordingIntervalIdRef = useRef(null);
  const componentIsMounted = useRef(true);

  // Effect to handle component mounting and unmounting
  useEffect(() => {
    componentIsMounted.current = true;
    setupWebSocket();

    return () => {
      componentIsMounted.current = false;
      cleanup();
    };
  }, []);

  // Effect to manage the call timer
  useEffect(() => {
    let interval = null;
    if (connectionStatus === 'connected') {
      interval = setInterval(() => {
        if (componentIsMounted.current) {
          setTimer(prevTimer => prevTimer + 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [connectionStatus]);

  // Effect to handle disconnection
  useEffect(() => {
    if (connectionStatus === 'disconnected') {
      stopRingingSound();
      const redirectTimer = setTimeout(() => {
        if (componentIsMounted.current) {
          navigation.navigate('Chatbot');
        }
      }, 1500); // Wait 1.5s before redirecting

      return () => clearTimeout(redirectTimer);
    }
  }, [connectionStatus, navigation]);

  // --- WebSocket and Audio Setup ---
  const setupWebSocket = async () => {
    playRingingSound();

    const lang = await getLanguage() || 'en';
    const userId = await getSession() || '12345'; // fallback user_id
    const wsUrl = `wss://kissan-dada.kenpath.ai/audio/chat?user_id=${userId}&language=${lang}`;

    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      if (!componentIsMounted.current) return;
      console.log('WebSocket connected');
      stopRingingSound();
      setConnectionStatus('connected');
      startContinuousRecording();
    };

    ws.current.onmessage = (event) => {
      if (!componentIsMounted.current) return;
      // Server sends audio data as base64 encoded string.
      playAudioFromServer(event.data);
    };

    ws.current.onerror = (error) => {
      if (!componentIsMounted.current) return;
      console.error('WebSocket Error:', error);
      setConnectionStatus('disconnected');
    };

    ws.current.onclose = () => {
      if (!componentIsMounted.current) return;
      console.log('WebSocket disconnected');
      setConnectionStatus('disconnected');
    };
  };

  const playAudioFromServer = async (base64Data) => {
    try {
      // Stop any currently playing sound
      await soundRef.current.unloadAsync();
      
      const { sound } = await Audio.Sound.createAsync(
        { uri: `data:audio/mp3;base64,${base64Data}` },
        { shouldPlay: true }
      );
      soundRef.current = sound;
    } catch (error) {
      console.error('Failed to play audio from server', error);
    }
  };

  // --- Audio Recording and Streaming ---
  const startContinuousRecording = async () => {
    await requestMicrophonePermission();
    // This interval will create and send audio chunks continuously
    // NOTE: This is a workaround for the lack of true audio streaming in expo-av.
    // It records in short bursts, which may result in small gaps in the audio.
    recordingIntervalIdRef.current = setInterval(async () => {
      if (componentIsMounted.current && !isMuted) {
        await recordAndSendChunk();
      }
    }, 1000); // Sending a chunk every second
  };

  const recordAndSendChunk = async () => {
    try {
      if (recordingRef.current) {
        // If a recording is already in progress, this call might fail.
        // It's part of the hacky nature of this workaround.
        await recordingRef.current.stopAndUnloadAsync();
      }
      
      await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY_LOSSY
      );
      recordingRef.current = recording;

      await new Promise(resolve => setTimeout(resolve, 800)); // Record for 800ms

      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      
      if (uri) {
        const base64Data = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        if (ws.current?.readyState === WebSocket.OPEN) {
          ws.current.send(base64Data);
        }
      }
      recordingRef.current = null;
    } catch (error) {
      console.error('Error during recording chunk:', error);
    }
  };
  
  // --- UI and Sound Helpers ---
  const playRingingSound = async () => {
    try {
      await soundRef.current.loadAsync(require('../../assets/call-ring.mp3'));
      await soundRef.current.setIsLoopingAsync(true);
      await soundRef.current.playAsync();
    } catch (error) {
      console.error("Failed to play ringing sound", error);
    }
  };

  const stopRingingSound = () => {
    soundRef.current.stopAsync();
    soundRef.current.unloadAsync();
    if (callTimerIdRef.current) clearTimeout(callTimerIdRef.current);
  };
  
  const requestMicrophonePermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert(t('Sorry, we need microphone permissions to make this work!'));
      }
    }
  };
  
  const cleanup = () => {
    if (recordingIntervalIdRef.current) clearInterval(recordingIntervalIdRef.current);
    if (ws.current) ws.current.close();
    soundRef.current.unloadAsync();
    if(recordingRef.current) recordingRef.current.stopAndUnloadAsync();
  };

  const handleEndCall = () => {
    navigation.navigate('Chatbot');
  };

  const formatTime = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const getCallingText = () => {
      if (connectionStatus === 'connecting') return t('Calling Dadaji...');
      if (connectionStatus === 'disconnected') return t('Call Ended');
      return formatTime();
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <View style={styles.callingInterface}>
          <Text style={styles.callingText}>{getCallingText()}</Text>
          <Image source={require('../../assets/profile.png')} style={styles.contactImage} />
          <Text style={styles.contactName}>{t('Dadaji')}</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.button} onPress={() => setIsMuted(!isMuted)}>
            <Image source={require('../../assets/mic.png')} style={[styles.buttonIcon, isMuted && styles.mutedIcon]} />
            <Text style={styles.buttonText}>{isMuted ? t('Unmute') : t('Mute')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleEndCall}>
            <Image source={require('../../assets/chat.png')} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>{t('Chat')}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
          <Text style={styles.endCallButtonText}>{t('End Call')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const mainGreen = '#3E8577';
const darkGreen = '#367165';

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: mainGreen },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: mainGreen,
  },
  callingInterface: {
    alignItems: 'center',
    marginTop: height * 0.1,
  },
  callingText: {
    fontSize: width * 0.05,
    color: '#fff',
    marginBottom: 20,
  },
  contactImage: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    marginBottom: 10,
  },
  contactName: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#fff',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  button: {
    alignItems: 'center',
  },
  buttonIcon: {
    width: width * 0.1,
    height: width * 0.1,
    marginBottom: 5,
    tintColor: '#fff',
  },
  mutedIcon: {
    tintColor: 'red',
  },
  buttonText: {
    fontSize: width * 0.04,
    color: '#fff',
  },
  endCallButton: {
    backgroundColor: 'red',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginBottom: height * 0.05,
  },
  endCallButtonText: {
    color: 'white',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
});

export default VoiceInteractionScreen;
