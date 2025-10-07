import { Text, View,StyleSheet, Image } from "react-native";

export default function Index() {
  return (
    <View
      style={styles.container}
    >
      <View style={styles.sobre}>
      <Image source={require('../assets/images/abuelete.png')} style = {styles.avatar}></Image>
      <Text style= {styles.text}>Federico Blazquez</Text>
      </View>
    </View>

    

  );
}
const styles = StyleSheet.create({
      container:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
      avatar:{

        borderBlockColor: 'black',
        width: 160,
        height: 160,
        alignItems: 'center',
        borderWidth: 1,
        borderBottomWidth: 1,
        borderRadius: 100,



      },
      text:{

        alignContent: 'center',

      },
      sobre:{

        borderBlockColor: 'black',
        borderWidth: 4,
        borderBottomWidth: 4,
        width: 300,
        height: 250,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 30,

      }
    })