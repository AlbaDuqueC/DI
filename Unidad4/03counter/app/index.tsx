import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View
      style={styles.container}
    >

      <View style={styles.vista1}>

        <Text >HEADE</Text>

      </View>


      <View style={styles.vista2}>




        <Text ></Text>

      

      </View>

      <View style={styles.vista5}>

        <Text >FOOTER</Text>

      </View>
      
    </View>

    
  );
  
}
const styles= StyleSheet.create({

      container: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",

      } , 

      vista1:{

        backgroundColor: '#ff3535',
        height: '10%',
        width: '100%',
        alignItems: "center",
          justifyContent: "center",
        


      },
      vista2:{

         backgroundColor: '#3aff8c',
        alignItems: "center",
          justifyContent: "center",
         height: '80%',
         width: '80%',
     
      },
     
      vista5:{

         backgroundColor: '#ffe868',
         alignItems: "center",
          justifyContent: "center",
         height: '10%',
         width: '100%',
         

        
      }

    })