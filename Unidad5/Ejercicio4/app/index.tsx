import React from "react";
import { SafeAreaView } from "react-native";
import { PersonaLista } from "../app/presentation/view";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PersonaLista />
    </SafeAreaView>
  );
}

