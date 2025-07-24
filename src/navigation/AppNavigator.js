import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from '../screens/Welcome';
import SelectLanguage from '../screens/SelectLanguage';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Welcome"screenOptions={{ headerShown: false }} >
                <Stack.Screen name="Welcome" component={Welcome}/>
                <Stack.Screen name="SelectLanguage" component={SelectLanguage} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
