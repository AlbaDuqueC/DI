import { Stack } from "expo-router";
import "reflect-metadata"; 

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#2196F3" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Inicio", headerShown: false }} />

      {/* ⚠️ CAMBIO: Los 'name' deben coincidir con los NOMBRES DE ARCHIVO en app/ */}
      <Stack.Screen 
        name="ListadoPersonas" 
        options={{ title: "Personas" }} 
      />
      
      <Stack.Screen 
        name="ListadoDepartamento" 
        options={{ title: "Departamentos" }} 
      />
      
      {/* Resto de pantallas... */}
    </Stack>
  );
}