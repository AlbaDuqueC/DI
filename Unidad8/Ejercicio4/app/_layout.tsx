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
      <Stack.Screen 
        name="index" 
        options={{ title: "Inicio", headerShown: false }} 
      />
      
      <Stack.Screen 
        name="presentation/view/Persona/ListadoPersonas" 
        options={{ title: "Personas" }} 
      />
      
      <Stack.Screen 
        name="presentation/view/Departamento/ListadoDepartamento" 
        options={{ title: "Departamentos" }} 
      />
      
      <Stack.Screen 
        name="presentation/view/Persona/EditarInsertarPersonas" 
        options={{ title: "Editar/Insertar Persona" }} 
      />
      
      <Stack.Screen 
        name="presentation/view/Departamento/EditarInsertarDepartamentos" 
        options={{ title: "Editar/Insertar Departamento" }} 
      />
    </Stack>
  );
}