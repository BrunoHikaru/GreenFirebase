import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeVolunteers from '../HomeVolunteers';
import ProfileVolunteers from '../ProfileVolunteers';

const Tab = createBottomTabNavigator();

export default function VolunteerTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeVolunteers} />
      <Tab.Screen name="Profile" component={ProfileVolunteers} />
    </Tab.Navigator>
  );
}
