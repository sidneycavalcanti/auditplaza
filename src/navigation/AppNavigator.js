import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AuditoriaScreen  from '../screens/AuditoriaScreen';


import VendasEditTab from '../components/Tabs/VendasEditTab';
import PerdasEditTab from '../components/Tabs/PerdasEditTab';
import AvaliacaoEditTab from '../components/Tabs/PerdasEditTab';

import UltimasVendasTab from '../components/Tabs/UltimaVendasTab';
import UltimasPerdasTab from '../components/Tabs/UltimaPerdasTab';
import UltimasPausaTab from '../components/Tabs/UltimaPausaTab';
import UltimasAvaliacaoTab from '../components/Tabs/UltimaAvaliacaoTab';

 
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
        <Stack.Screen name="UltimasPerdas" component={UltimasPerdasTab} /> 
        <Stack.Screen name="UltimasPausa" component={UltimasPausaTab} /> 
        <Stack.Screen name="UltimasAvaliacoes" component={UltimasAvaliacaoTab} /> 

        <Stack.Screen name="VendasEditTab" component={VendasEditTab} options={{ title: 'Editar Venda' }} />
        <Stack.Screen name="PerdasEditTab" component={PerdasEditTab} options={{ title: 'Editar Perda' }} />
        <Stack.Screen name="AvaliacaoEditTab" component={AvaliacaoEditTab} options={{ title: 'Editar Avaliacao' }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
