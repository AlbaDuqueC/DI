import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
} from 'react-native';

// Modelo
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

// ViewModel simple
const products: Product[] = [
  {
    id: '1',
    name: 'Camisa',
    description: 'Una camisa de algodón, manga larga, varios colores.',
    price: 29.99,
  },
  {
    id: '2',
    name: 'Pantalones',
    description: 'Pantalones vaqueros cómodos para uso diario.',
    price: 49.5,
  },
  {
    id: '3',
    name: 'Zapatos',
    description: 'Zapatos deportivos cómodos para correr.',
    price: 89.0,
  },
];

const App = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setModalVisible(false);
  };

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.item} onPress={() => openModal(item)}>
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedProduct && (
                <>
                  <Text style={styles.modalTitle}>{selectedProduct.name}</Text>
                  <Text style={styles.modalDescription}>{selectedProduct.description}</Text>
                  <Text style={styles.modalPrice}>
                    Precio: ${selectedProduct.price.toFixed(2)}
                  </Text>
                </>
              )}
              <Button title="Cerrar" onPress={closeModal} />
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
};

export default App;

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  item: {
    padding: 16,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    backgroundColor: '#f9f9f9',
  },
  itemText: {
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalPrice: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 20,
  },
});

