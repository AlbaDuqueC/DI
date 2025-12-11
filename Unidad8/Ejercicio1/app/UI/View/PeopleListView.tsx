import { observer } from "mobx-react-lite";
import React, { useRef } from "react";
import { FlatList, Pressable, StyleSheet, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInUp, FadeInDown, Layout, ZoomIn } from "react-native-reanimated";
import * as Animatable from "react-native-animatable";
import { container } from "../../core/container";
import { TYPES } from "../../core/types";
import { Persona } from "../../../app/domain/entities/Persona";
import { PeopleListVM } from "../ViewModel/PeopleListVM";

const PeopleList = observer(() => {
  const vmRef = useRef<PeopleListVM | null>(null);

  if (vmRef.current === null) {
    vmRef.current = container.get<PeopleListVM>(TYPES.IndexVM);
  }

  const viewModel = vmRef.current;

  const getRandomColor = (id: number) => {
    const colors = [
      '#FF6B9D', '#C44569', '#FFA07A', '#FFD93D', '#6BCF7F',
      '#4ECDC4', '#45B7D1', '#96CEB4', '#b7dd5eff', '#992c75ff',
      '#9B59B6', '#E84393', '#00B894', '#FDCB6E', '#6C5CE7',
      '#A29BFE', '#FD79A8', '#FFEAA7', '#55EFC4', '#74B9FF'
    ];
    return colors[id % colors.length];
  };

  const renderItem = ({ item, index }: { item: Persona; index: number }) => (
    
    <Animated.View
      entering={FadeInUp.delay(index * 80)}
      layout={Layout.springify()}
    >
      <Animatable.View animation="pulse" iterationCount={1}>
        <Pressable
          onPress={() => {
            viewModel.personaSeleccionada = item;
          }}
          style={({ pressed }) => [
            styles.item,
            {
              backgroundColor: getRandomColor(item.id),
              transform: [{ scale: pressed ? 0.95 : 1 }]
            },
          ]}
        >
          <View style={styles.itemContent}>
            <Image
              source={{ uri: item.foto }}
              style={styles.avatar}
            />
            <View style={styles.textContainer}>
              <Text style={styles.itemNombre}>{item.nombre}</Text>
              <Text style={styles.itemApellido}>{item.apellido}</Text>
            </View>
            <Text style={styles.emoji}>✨</Text>
          </View>
        </Pressable>
      </Animatable.View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      
      {/* HEADER ANIMADO */}
      <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
        <Text style={styles.titulo}>Listado de Personas</Text>

        <Animated.View entering={ZoomIn.delay(200)} style={styles.seleccionadoContainer}>
          <Text style={styles.seleccionadoLabel}>⭐ PERSONA SELECCIONADA ⭐</Text>

          <View style={styles.seleccionadoCard}>
            <Image 
              source={{ uri: viewModel.personaSeleccionada.foto }}
              style={styles.seleccionadoAvatar}
            />
            <View style={styles.seleccionadoInfo}>
              <Text style={styles.seleccionadoNombre}>
                {viewModel.personaSeleccionada.nombre}
              </Text>
              <Text style={styles.seleccionadoApellido}>
                {viewModel.personaSeleccionada.apellido}
              </Text>
            </View>
          </View>

        </Animated.View>
      </Animated.View>

      <FlatList
        data={viewModel.personasList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F7",
  },

  /* HEADER */
  header: {
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 28,
    backgroundColor: "#667eea",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },

  titulo: {
    fontSize: 34,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 26,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },

  /* PERSONA SELECCIONADA */
  seleccionadoContainer: {
    backgroundColor: "#FFFFFF",
    padding: 22,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },

  seleccionadoLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#667eea",
    textAlign: "center",
    letterSpacing: 1.8,
    marginBottom: 16,
  },

  seleccionadoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },

  seleccionadoAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: "#667eea",
  },

  seleccionadoInfo: {
    flex: 1,
  },

  seleccionadoNombre: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2D3436",
  },

  seleccionadoApellido: {
    fontSize: 16,
    fontWeight: "500",
    color: "#636E72",
    marginTop: 4,
  },

  /* LISTA */
  listContent: {
    padding: 30,
  },

  item: {
  padding: 16,
  borderRadius: 20,
  marginBottom: 26,   // ⬅ AQUI LA SEPARACIÓN ENTRE PERSONAS
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 10,
  elevation: 5,
},


  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },

  avatar: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },

  textContainer: {
    flex: 1,
  },

  itemNombre: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  itemApellido: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    opacity: 0.9,
    marginTop: 3,
  },

  emoji: {
    fontSize: 28,
  },

  separator: {
    height: 28,
  },

  /* LIST EMPTY */
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 100,
  },

  textoVacio: {
    fontSize: 90,
    marginBottom: 20,
  },

  textoVacioSubtitulo: {
    fontSize: 22,
    color: "#667eea",
    fontWeight: "700",
    marginBottom: 10,
  },

  textoVacioDescripcion: {
    fontSize: 17,
    color: "#B2BEC3",
    fontWeight: "500",
  },
});



export default PeopleList;