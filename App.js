import React, { useEffect, useState } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import './src/locales/i18n';
import { init, getLanguage } from './src/database/localdb';
import { Text, View } from 'react-native';
import i18n from './src/locales/i18n';

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    init()
      .then(async () => {
        const savedLanguage = await getLanguage();
        if (savedLanguage) {
          i18n.changeLanguage(savedLanguage);
        }
        setDbInitialized(true);
        console.log('Database initialized');
      })
      .catch((err) => {
        console.error('Database initialization failed', err);
      });
  }, []);

  if (!dbInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Initializing database...</Text>
      </View>
    );
  }

  return <AppNavigator />;
}