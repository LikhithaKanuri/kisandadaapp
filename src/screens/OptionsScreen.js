import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  LayoutAnimation,
  Platform,
  UIManager,
  ActivityIndicator,
  Modal,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { deleteSession, saveLanguage, getLanguage } from '../database/localdb';
import { AntDesign } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import i18n from '../locales/i18n';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width, height } = Dimensions.get('window');

const OptionsScreen = () => {
  const { t } = useTranslation();
  const [isWarehouseOpen, setIsWarehouseOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchLanguage = async () => {
      const lang = await getLanguage();
      if (lang) {
        setSelectedLanguage(lang);
      }
    };
    fetchLanguage();
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await deleteSession();
      setTimeout(() => {
        setIsLoading(false);
        navigation.replace('Welcome');
      }, 2000);
    } catch (error) {
      console.error('Failed to logout:', error);
      setIsLoading(false);
    }
  };

  const handleLanguageChange = async (lang) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedLanguage(lang);
    await saveLanguage(lang);
    i18n.changeLanguage(lang);
    setIsLanguageOpen(false);
  };

  const toggleWarehouse = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsWarehouseOpen(!isWarehouseOpen);
  };

  const toggleLanguage = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsLanguageOpen(!isLanguageOpen);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Modal
        transparent={true}
        animationType="none"
        visible={isLoading}
        onRequestClose={() => {}}
      >
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>{t('Logging out...')}</Text>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerLogoContainer}>
          <Image style={styles.headerLogo} source={require('../../assets/applogo1.png')} />
          <Text style={styles.headerLogoText}>
            <Text style={styles.headerLogoTextMain}>KisanDada</Text>
            <Text style={styles.headerLogoTextDot}>.ai</Text>
          </Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>{t('Settings')}</Text>

        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>{t('Crop Analysis')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.optionButton, styles.logoutButton]} onPress={handleLogout} disabled={isLoading}>
          <Text style={[styles.optionText, styles.logoutText]}>{t('Logout')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton} onPress={toggleLanguage}>
          <Text style={styles.optionText}>{t('Language')}</Text>
          <AntDesign name={isLanguageOpen ? 'down' : 'right'} size={20} color="#fff" />
        </TouchableOpacity>

        {isLanguageOpen && (
          <View style={styles.subMenu}>
            <TouchableOpacity 
              style={[styles.subOptionButton, selectedLanguage === 'en' && styles.selectedSubOption]} 
              onPress={() => handleLanguageChange('en')}
            >
              <Text style={styles.subOptionText}>English</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.subOptionButton, selectedLanguage === 'hi' && styles.selectedSubOption]} 
              onPress={() => handleLanguageChange('hi')}
            >
              <Text style={styles.subOptionText}>Hindi</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const mainGreen = '#3E8577';
const darkGreen = '#367165';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: mainGreen,
  },
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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: mainGreen,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#fff',
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#367165',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '500',
  },
  subMenu: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  subOptionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedSubOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderColor: '#fff',
    borderWidth: 1,
  },
  subOptionText: {
    fontSize: 16,
    color: '#fff',
  },
  logoutButton: {
    backgroundColor: '#c0392b',
    marginTop: 20,
  },
  logoutText: {
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  activityIndicatorWrapper: {
    backgroundColor: '#333',
    height: 120,
    width: 200,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  }
});

export default OptionsScreen;