import { Tabs } from "expo-router";
import React from "react";

export default function TabsLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,        
        tabBarShowLabel: false,
        tabBarStyle:{
          backgroundColor: '#fcaad0ff',
          borderTopColor: '#a72260ff',
          height: 60,
        }
      }}
    >


      <Tabs.Screen 
        name="index" 
        options={{ title: "Home" }}
      />

     
      <Tabs.Screen 
        name="search" 
        options={{ title: "Búsqueda" }}
      />

      <Tabs.Screen 
        name="profile" 
        options={{ title: "Perfil" }}
      />

    </Tabs>
  );
}
