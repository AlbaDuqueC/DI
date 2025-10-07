import React, { useState } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';


const Index = () => {


  const [count, setCount] = useState(0);
    const handlePress = () => {
      setCount(count + 1);

      if(count%10==0){
        alert('Enhorabuena, llevas '+count+' clicks')
      }
    
    };
    const Decrementar = () => {

      setCount(count - 1);

      if(count%10==0){
        alert('Enhorabuena, llevas '+count+' clicks')
      }

    };
    
    

  return (
   <View style={styles.container}>
      <Text style={styles.title}>
        Contador: {count}
      </Text>
      <Pressable onPress={handlePress} style={styles.button}>
        <Text style={styles.buttonText}>Incrementar</Text>
        <Ionicons name="add-circle" size={24} color="white" />
      </Pressable>

       <Pressable onPress={Decrementar} style={styles.button}>
        <Text style={styles.buttonText}>Decrementar</Text>
        <Ionicons name="remove-circle" size={24} color="white" />
      </Pressable>
     
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffccfbff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6e1a59ff',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#c964afff',
    padding: 15,
    borderRadius: 8,
    margin: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    marginRight: 8,
  },
});


export default Index;

