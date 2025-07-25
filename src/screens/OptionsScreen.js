import React, { useState } from 'react';
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { deleteSession } from '../database/localdb';
import { AntDesign } from '@expo/vector-icons';


if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const OptionsScreen = () => {
  const [isWarehouseOpen, setIsWarehouseOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

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

  const toggleWarehouse = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsWarehouseOpen(!isWarehouseOpen);
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
            <Text style={styles.loadingText}>Logging out...</Text>
          </View>
        </View>
      </Modal>

      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>

        <TouchableOpacity style={styles.optionButton} onPress={toggleWarehouse}>
          <Text style={styles.optionText}>Warehouses</Text>
          <AntDesign name={isWarehouseOpen ? 'down' : 'right'} size={20} color="#fff" />
        </TouchableOpacity>

        {isWarehouseOpen && (
          <View style={styles.subMenu}>
            <TouchableOpacity style={styles.subOptionButton}>
              <Text style={styles.subOptionText}>Nearby Warehouses</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.subOptionButton}>
              <Text style={styles.subOptionText}>Analyzed Warehouses</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>Nearby Gov. Fertilize shop</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>Sale Mandi by predicting</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>Crop Analysis</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.optionButton, styles.logoutButton]} onPress={handleLogout} disabled={isLoading}>
          <Text style={[styles.optionText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#3E8577',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#3E8577',
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
  subOptionText: {
    fontSize: 16,
    color: '#fff',
  },
  logoutButton: {
    backgroundColor: '#c0392b',
    marginTop: 20,
  },
  logoutText: {
    textAlign: 'center',
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