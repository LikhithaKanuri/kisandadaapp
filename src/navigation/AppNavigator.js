import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from '../screens/Welcome';
import SelectLanguage from '../screens/SelectLanguage';
import LoginScreen from '../screens/LoginScreen';
import Chatbot from '../screens/Chatbot';
import VoiceInteractionScreen from '../screens/VoiceInteractionScreen';
import OptionsScreen from '../screens/OptionsScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SelectLanguage" component={SelectLanguage} />
        <Stack.Screen name="Chatbot" component={Chatbot} />
        <Stack.Screen name="VoiceInteraction" component={VoiceInteractionScreen} />
        <Stack.Screen name="Options" component={OptionsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;