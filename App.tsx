import React from 'react';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NativeMathDemo from './Components/NativeMathDemo';
import WebSocketDemo from './Components/WebSocketDemo';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Native Math" component={NativeMathDemo} />
          <Tab.Screen name="WebSocket" component={WebSocketDemo} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}
