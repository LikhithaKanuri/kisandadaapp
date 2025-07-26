import React, { useState, useEffect } from 'react';
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

const { width, height } = Dimensions.get('window');

const VoiceInteractionScreen = () => {
  const { t } = useTranslation();
  const [message, setMessage] = useState(t('Calling Dadaji...'));
  const [timer, setTimer] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    const callingTimer = setTimeout(() => {
      setMessage('00:00');
      setTimer(0);
    }, 2000);

    return () => clearTimeout(callingTimer);
  }, []);

  useEffect(() => {
    let interval = null;
    if (message === '00:00') {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
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
    navigation.navigate('Chatbot');
  };

  const handleOptionsRoute = () => {
    console.log("OptionsOptions")
    navigation.navigate('Options');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Calling Interface */}
        <View style={styles.callingInterface}>
          <Text style={styles.callingText}>{message === t('Calling Dadaji...') ? message : formatTime()}</Text>
          <Image
            source={require('../../assets/profile.png')} // Replace with actual contact image
            style={styles.contactImage}
          />
          <Text style={styles.contactName}>{t('Dadaji')}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.button}>
            <Image source={require('../../assets/mic.png')} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>{t('Mute')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleEndCall}>
            <Image source={require('../../assets/chat.png')} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>{t('Chat')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}  onPress={handleOptionsRoute}>
            <Image source={require('../../assets/settings.png')} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>{t('Settings')}</Text>
          </TouchableOpacity>
        </View>

        {/* End Call Button */}
        <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
          <Text style={styles.endCallButtonText}>{t('End Call')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  callingInterface: {
    alignItems: 'center',
    marginTop: height * 0.1,
  },
  callingText: {
    fontSize: width * 0.05,
    color: '#888',
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
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    alignItems: 'center',
  },
  buttonIcon: {
    width: width * 0.1,
    height: width * 0.1,
    marginBottom: 5,
  },
  buttonText: {
    fontSize: width * 0.04,
    color: '#555',
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