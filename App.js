import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import VolunteerTabs from './screens/tabs/VolunteerTabs';
import CompanyTabs from './screens/tabs/CompanyTabs';
import AdminTabs from './screens/tabs/AdminTabs';
import RegisterCompanyScreen from './screens/RegisterCompanyScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen}  options={{headerShown:false}}/>
        <Stack.Screen name="Register" component={RegisterScreen}  options={{headerShown:false}}/>
        <Stack.Screen name="RegisterCompany" component={RegisterCompanyScreen}  options={{headerShown:false}}/>
        <Stack.Screen name="Volunteer" component={VolunteerTabs}  options={{headerShown:false}}/>
        <Stack.Screen name="Company" component={CompanyTabs} options={{headerShown:false}}/>
        <Stack.Screen name="Admin" component={AdminTabs}  options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
