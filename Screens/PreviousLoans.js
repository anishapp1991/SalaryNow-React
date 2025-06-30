import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, RefreshControl, FlatList, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native'; // Lottie for animations
import Head from './Header';
import HTTPRequest from '../utils/HTTPRequest';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PreviousLoans = ({ navigation }) => {
  const [activeLoans, setActiveLoans] = useState(false);
  const [displayLoan, setDisplayLoan] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchPreviousLoan();
    });
    return unsubscribe;
  }, [fetchPreviousLoan, navigation]);

  const toggleExpand = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  const onRefresh = useCallback(() => {
    fetchPreviousLoan();
  }, [fetchPreviousLoan]);


  const fetchPreviousLoan = async () => {
    try {
      const response = await HTTPRequest.PreviousLoan();
      if (response.status === 200) {
        const details = response.data;
        if (details.response_status == 1) {
          console.log(details, 'bbbbb')
          setDisplayLoan(details.response_data);
          setActiveLoans(true)
        } else {
          setActiveLoans(false)
        }
      } else {
        Alert.alert('Error', 'Failed to fetch personal details.');
      }
    } catch (error) {
      console.error('Error fetching details:', error);
      // Alert.alert('Error', 'An error occurred while fetching  details.');
    }
  };


  const renderItem = ({ item, index }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity style={styles.header1} onPress={() => toggleExpand(index)}>
        <View style={styles.header} >
          <Text style={styles.title1}>{item.loanNo}</Text>
          <Ionicons name={expanded === index ? 'chevron-up' : 'chevron-down'} size={24} color="gray" />
        </View>
        <Text style={styles.title}>Application No.</Text>
      </TouchableOpacity>
      {expanded === index && (
        <View style={styles.content}>
          <View style={styles.header} >
            <Text>Loan Amount</Text>
            <Text style={styles.title}> ₹ {item.LoanAmount}</Text>
          </View>
          <View style={styles.header} >
            <Text>Tenure</Text>
            <Text style={styles.title}>{item.approved_teneur} Days</Text>
          </View>
          <View style={styles.header} >
            <Text>Closed Date</Text>
            <Text style={styles.title}>{item.loanClosedDate}</Text>
          </View>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.header1} onPress={() => navigation.navigate('ViewSanction',{url:item.sanction_url})}>
            <Text style={styles.tit}>View Sanction</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.header1} onPress={() => navigation.navigate('ViewAgreement',{url:item.agreement_url})}>
            <Text style={styles.tit}>View Agreement</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <Text style={styles.tit1}>(Password is your PAN No. in Block Letters)</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Head title="Previous Loan" />
      <View style={styles.container1}>
        {displayLoan && displayLoan.length > 0 ? (
          <FlatList
            data={displayLoan}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <View style={styles.noLoanContainer}>
            <View style={styles.dottedBox}>
              <LottieView
                source={require('../assests/lottie/box-empty.json')} // Fixed the path to 'assets'
                autoPlay
                loop
                style={styles.chatIcon}
              />
              <Text style={styles.noLoanText}>You have No Previous Loans</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
    backgroundColor: '#f4f4f4',
  },
  itemContainer: {
    borderBottomColor: '#fff',
    marginTop: 10,
  },
  title: {
    fontSize: 14,
    marginBottom: 10,
    // fontWeight:'bold',
  },
  tit: {
    fontSize: 14,
    marginBottom: 10,
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#419FB8',

  },
  tit1: {
    fontSize: 11,
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
    color: '#f00',
    padding:10,

  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title1: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  container1: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingHorizontal: 20,
    // marginTop:20,
  },
  content: {
    paddingHorizontal: 15,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  header1: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  chatIcon: {
    width: '100%',
    height: 150,
    marginBottom: 20,
  },
  dottedBox: {
    width: 300,
    height: 300,
    borderWidth: 2,
    borderColor: '#0288D1',
    borderStyle: 'dotted', // This creates the dotted border
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 25,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  noLoanContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '50%',
  },
  noLoanText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  previousLoanLink: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: 'bold'
    // textDecorationLine: 'underline',
  },
});

export default PreviousLoans;
