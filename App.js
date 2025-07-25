import React, { useEffect, useState } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { init } from './src/database/localdb';
import { ActivityIndicator, View } from 'react-native';

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    init()
      .then(() => {
        setDbInitialized(true);
      })
      .catch((err) => {
        console.log('Database initialization failed');
        console.log(err);
      });
  }, []);

  if (!dbInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <AppNavigator />;
}