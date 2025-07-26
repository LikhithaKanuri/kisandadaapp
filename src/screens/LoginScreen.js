import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ImageBackground,
  Alert,
} from 'react-native';

import { auth } from '../database/firebase';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { signInWithPhoneNumber } from 'firebase/auth';
import { saveSession } from '../database/localdb';
import { useTranslation } from 'react-i18next';

const LoginScreen = () => {
  const { t } = useTranslation();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmResult, setConfirmResult] = useState(null);
  const [user, setUser] = useState(null);

  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
  const navigation = useNavigation();
  const { width } = Dimensions.get('window');
  const buttonWidth = width * 0.8;

  const sendOtp = async () => {
    try {
      if(phone){
        let formattedPhone = phone.trim();
        if (!formattedPhone.startsWith('+')) {
          formattedPhone = `+91${formattedPhone}`; // default to India country code
        }
        const confirmation = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
        console.log('Verification ID:', confirmation.verificationId);
        setConfirmResult(confirmation);
      }else{
        Alert.alert(t('Please enter a valid phone number'));
      }
    } catch (err) {
      console.log('OTP send error: ', err);
    }
  };

  const verifyOtp = async () => {
    try {
      if(otp){
      const result = await confirmResult.confirm(otp);
      await saveSession(result.user.uid); // Use user's UID for a persistent session
      setUser(auth.currentUser);
      navigation.navigate('SelectLanguage');
      }else{
        Alert.alert(t('Please enter a valid OTP'));
      }
    } catch (err) {
      console.log('OTP verify error: ', err);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/farming2.jpeg')}
      style={styles.backgroundImage}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.root}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <FirebaseRecaptchaVerifierModal
              ref={(ref) => setRecaptchaVerifier(ref)}
              firebaseConfig={auth.app.options}
            />

            <View style={styles.container}>
              <Image source={require('../../assets/applogo1.png')} style={styles.logo} />
              <Text style={styles.title}>{t('Login to Account')}</Text>

              {user ? (
                <Text style={styles.successText}>{t('Welcome')} {user.phoneNumber}</Text>
              ) : confirmResult ? (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder={t('Enter OTP')}
                    placeholderTextColor="#fff"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="numeric"
                  />
                  
                  <TouchableOpacity style={styles.button} onPress={verifyOtp} activeOpacity={0.85}>
                    <Text style={styles.buttonText}>{t('Verify OTP')}</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder={t('Enter Phone No.')}
                    placeholderTextColor="#fff"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                  <TouchableOpacity style={styles.button} onPress={sendOtp} activeOpacity={0.85}>
                    <Image source={require('../../assets/otp1.png')} style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>{t('Continue with Phone no.')}</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const { width } = Dimensions.get('window');
const buttonWidth = width * 0.8;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  errMsg: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
  },
  root: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  container: {
    width: '92%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    paddingBottom: 60,
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    resizeMode: 'contain',
  },
  title: {
    fontSize: width * 0.065,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  input: {
    width: buttonWidth,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 32,
    padding: 15,
    marginBottom: 20,
    color: 'white',
    fontSize: 18,
    backgroundColor: 'rgba(139, 94, 60, 0.8)',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 94, 60, 0.8)',
    borderColor: '#fff',
    borderWidth: 1,
    width: buttonWidth,
    borderRadius: 32,
    paddingVertical: 15,
    paddingHorizontal: 24,
    marginBottom: 28,
    elevation: 8,
  },
  buttonIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    marginRight: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: width * 0.045,
    fontWeight: '500',
    fontFamily: 'serif',
    letterSpacing: 0.5,
  },
  successText: {
    fontSize: 18,
    color: 'white',
    marginTop: 20,
  },
});

export default LoginScreen;