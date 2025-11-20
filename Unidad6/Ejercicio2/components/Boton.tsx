import { Pressable, TouchableOpacity } from "react-native";
import { Text, StyleSheet } from "react-native";

interface BotonProps {
    title: string;
    onPress: () => void;
}

export default function Boton({ title, onPress }: BotonProps) {

    return (
        <Pressable style={styles.button} onPress={onPress} >

            <Text style={styles.buttonText}>{title}</Text>
            
        </Pressable>

    );

}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#830563ff",
        paddingVertical: 10,
        paddingHorizontal: 20,  
        borderRadius: 5,
        alignItems: "center",
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
    },
});