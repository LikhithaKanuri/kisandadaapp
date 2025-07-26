import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { AntDesign } from '@expo/vector-icons';
import { Audio } from 'expo-av';

const { width, height } = Dimensions.get('window');

const VoiceInteractionScreen = () => {
  const { t } = useTranslation();
  const [message, setMessage] = useState(t('Calling Dadaji...'));
  const [timer, setTimer] = useState(0);
  const soundRef = useRef(new Audio.Sound());
  const timerIdRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    const setupAndPlaySound = async () => {
      try {
        await soundRef.current.loadAsync(require('../../assets/call-ring.mp3'));
        await soundRef.current.playAsync();
        
        timerIdRef.current = setTimeout(() => {
          soundRef.current.stopAsync();
          setMessage('00:00');
          setTimer(0);
        }, 4000);

      } catch (error) {
        console.error("Failed to play sound", error);
      }
    };

    setupAndPlaySound();

    return () => {
      soundRef.current.unloadAsync();
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let interval = null;
    if (message === '00:00') {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [message]);

  const formatTime = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    soundRef.current.stopAsync();
    navigation.navigate('Chatbot');
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <View style={styles.callingInterface}>
          <Text style={styles.callingText}>{message === t('Calling Dadaji...') ? message : formatTime()}</Text>
          <Image
            source={require('../../assets/profile.png')}
            style={styles.contactImage}
          />
          <Text style={styles.contactName}>{t('Dadaji')}</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.button}>
            <Image source={require('../../assets/mic.png')} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>{t('Mute')}</Text>
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