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

        }
      }}
    >


      <Tabs.Screen 
        name="index" 
        options={{ title: "Inicio" }}
      />

     
      <Tabs.Screen 
        name="perfil/profile" 
        options={{ title: "Perfil" }}
      />

      <Tabs.Screen 
        name="configuration" 
        options={{ title: "Configuracion" }}
      />

    </Tabs>
  );
}
