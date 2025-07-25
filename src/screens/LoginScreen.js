import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { width, height } = Dimensions.get('window');

  const handlePhoneSignIn = () => {
    navigation.navigate("SelectLanguage");
  };

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        {/* Logo */}
        <Image source={require('../../assets/applogo1.png')} style={styles.logo} />

        {/* Title */}
        <Text style={styles.title}>Login to Account</Text>

        {/* Phone Button */}
        <TouchableOpacity style={styles.button} onPress={handlePhoneSignIn} activeOpacity={0.85}>
          <Image source={require('../../assets/otp1.png')} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Login with Phone No.</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');
const buttonWidth = width * 0.8;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#3E8577', // Green background as per your screenshot
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  container: {
    width: '92%',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    paddingTop: 50,
    paddingBottom: 40,
  },
  logo: {
    width: width * 0.26,
    height: width * 0.26,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontSize: width * 0.065,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 40,
    fontFamily: 'serif', // Optional: use if you want that look
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#367167',
    width: buttonWidth,
    borderRadius: 32,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
  buttonIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    marginRight: 12,
    marginLeft: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: width * 0.045,
    fontWeight: '500',
    fontFamily: 'serif', // Optional
    letterSpacing: 0.5,
  },
});

export default LoginScreen;