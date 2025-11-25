import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from "react-native";



const MaterialTopTabs = createMaterialTopTabNavigator();   // 👈 Faltaba esto

export default function TabsLayout() {
  return (

    

    <SafeAreaView style={{ flex: 1, backgroundColor: '#fcaad0ff' }} edges={['top']}>

      <MaterialTopTabs.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#ffffff',   // 👈 corregido
          tabBarIndicatorStyle: { backgroundColor: '#a72260ff', height: 3 },
          tabBarLabelStyle: { fontWeight: 'bold' }
        }}
      >

        <MaterialTopTabs.Screen
            name="galeria"
            component={Galeria}
            options={{ title: "Galería" }}
            />

        <MaterialTopTabs.Screen
            name="posts"
            component={Posts}
            options={{ title: "Posts" }}
        />


      </MaterialTopTabs.Navigator>

    </SafeAreaView>

  );
}

function Galeria() {
  return <Text>Página Galería</Text>;
}

function Posts() {
  return <Text>Página Posts</Text>;
}
