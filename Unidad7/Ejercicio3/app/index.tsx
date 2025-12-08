import { Text, View } from "react-native";
import listaFAB from "./componentes/listaFAB";

export default function Index() {
  return (
    <View
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text>Lista con boton flotante:</Text>

      <listaFAB />
    </View>
  );
}
