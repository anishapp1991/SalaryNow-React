import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import HTTPRequest from '../utils/HTTPRequest';
import Head from './Header';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
const Products = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    await EncryptedStorage.removeItem('modalVisible');
    try {
       
      const response = await HTTPRequest.products();
      if (response.status === 200) {
        const ab = response.data.response_data;
        // console.log('Loan Charges:', ab);
        setProducts(ab);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  useFocusEffect(
    React.useCallback(() => {

      fetchProducts();
    }, [])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProductDetails',{item})}>
      <View style={styles.cardTextContainer}>
        <Text style={styles.title}>{item.productName}</Text>
        <View style={styles.buttonContainer}>
          <Text style={styles.cardButton}>Select</Text>
        </View>
      </View>

      <View style={styles.separatorLine}></View>

      <View style={styles.cardTextContainer1}>
        <Text style={styles.duration}>Duration {item.days} DAYS</Text>
        <Text style={styles.amount}>Upto ₹ {Number(item.maxAmount || 0).toLocaleString('en-IN')}</Text>
      </View>

      {/* <View style={styles.cardTextContainer}>
        <Text style={styles.duration1}>Duration</Text>
        <Text style={styles.amount1}>Upto</Text>
      </View> */}

      <View style={styles.separatorLine}></View>

      <View style={styles.cardTextContainer1}>
        <Text style={styles.description}>{item.productDescription}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Head title="Products" />
      <View style={styles.flat}>
        <Text style={styles.header}>Available Offers</Text>
        <Text style={styles.subHeader}>Based on your profile you are eligible for these offers</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            contentContainerStyle={styles.flatListContainer}
            data={products}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  separatorLine: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 5, // Reduced space for better alignment
  },
  cardTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10, // No bottom margin
  },
  cardTextContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 0, // No top margin
  },
  flat: {
    flex:1,
    // marginTop: 5,
    // paddingBottom: 20,
    backgroundColor:'#fff',
    alignContent: 'space-evenly',
  },
  buttonContainer: {
    backgroundColor: '#419fb8',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-end',
  },
  cardButton: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    // textAlign: 'center',
    marginLeft:20,
    marginTop: 20,
    color: '#000',
  },
  subHeader: {
    fontSize: 12,
    marginLeft:20,
    marginBottom:15,
    color: '#333',
  },
  flatListContainer: {
    paddingHorizontal: 16,
    marginTop:10,
    marginBottom:15,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    paddingBottom:5,
    marginBottom: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,

  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  duration: {
    fontSize: 13,
    marginBottom: 0, // No bottom margin
    color: '#000',
    fontWeight: 'bold'
  },
  duration1: {
    fontSize: 13,
    marginBottom: 0, // No bottom margin
    color: '#000'
  },
  amount: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 0, // No bottom margin
  },
  amount1: {
    fontSize: 13,
    color: '#000',
    marginBottom: 0, // No bottom margin
  },
  description: {
    fontSize: 13,
    color: '#666',
    // fontWeight: 'bold',
    textAlign:'left',
  },
});

export default Products;
