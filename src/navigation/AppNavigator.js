import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AuditoriaScreen  from '../screens/AuditoriaScreen';
import UltimasVendasScreen from '../screens/UltimaVendasScreen';
import VendasEditTab from '../components/Tabs/VendasEditTab';
import UltimasVendasTab from '../components/Tabs/UltimaVendasTab';
import UltimasPerdasScreen from '../screens/UltimaPerdasScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Auditoria" component={AuditoriaScreen} />   
        <Stack.Screen name="UltimasVendas" component={UltimasVendasTab} /> 
        <Stack.Screen name="UltimasPerdas" component={UltimasPerdasScreen} /> 
        <Stack.Screen name="VendasEditTab" component={VendasEditTab} options={{ title: 'Editar Venda' }} />
        

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
