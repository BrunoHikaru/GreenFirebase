import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeAdmin from '../Administrador/HomeAdmin';
import AdminProjectScreen from '../Administrador/AdminProjectScreen';
import FontAwesome from '@expo/vector-icons/FontAwesome';


const Tab = createBottomTabNavigator();

export default function AdminTabs() {
  return (
    <Tab.Navigator initialRouteName='Home'>
      <Tab.Screen name="Home" component={HomeAdmin} options={{headerShown:false, tabBarIcon:({color,size})=>(<FontAwesome name="home" size={size} color={color} />)}}/>
      <Tab.Screen name='Projetos' component={AdminProjectScreen} options={{headerShown:false}}/>
     
    </Tab.Navigator>
  );
}
