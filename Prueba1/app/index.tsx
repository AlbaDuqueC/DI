import { Button } from "@react-navigation/elements";
import { Alert, Text, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Holiwisss</Text>
      <Text>Echa el freno madaleno</Text>
      <Button onPress={() => alert("Holiwis")}>AAAAAAAAA</Button>
    </View>
  );
}

const style= StyleSheet.create({

container: {

  

}

});
