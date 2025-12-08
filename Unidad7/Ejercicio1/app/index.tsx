import { Text, View } from "react-native";
import Temporizador from "./componentes/Temporizador";

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Temporizador:</Text>

      <Temporizador />

    </View>


  );
}
