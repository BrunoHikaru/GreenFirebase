import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Perfil_empresas from '../empresas/Profile_empresa';
import Home_empresas from '../empresas/Home_empresas';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import CreateProjectScreen from '../empresas/CreateProjectScreen';


const Tab = createBottomTabNavigator();

export default function CompanyTabs() {
  return (
    <Tab.Navigator initialRouteName='Home'>
      <Tab.Screen name="Home" component={Home_empresas} options={{headerShown:false, tabBarIcon:({color,size})=>(<FontAwesome name="home" size={size} color={color} />)}}/>
      <Tab.Screen name="Criar" component={CreateProjectScreen} options={{headerShown:false, tabBarIcon:({color,size})=>(<FontAwesome name="user" size={size} color={color} />)}}/>
      <Tab.Screen name="Perfil" component={Perfil_empresas} options={{headerShown:false, tabBarIcon:({color,size})=>(<FontAwesome name="user" size={size} color={color} />)}}/>
    </Tab.Navigator>
  );
}
