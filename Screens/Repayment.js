import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, RefreshControl } from 'react-native';
import LottieView from 'lottie-react-native'; // Lottie for animations
import Head from './Header';
import HTTPRequest from '../utils/HTTPRequest';
import Ionicons from 'react-native-vector-icons/Ionicons';

const RepaymentScreen = ({ navigation }) => {
  const [activeLoans, setActiveLoans] = useState(false);
  const [displayLoan, setDisplayLoan] = useState([]);
  const [label, setLabel] = useState([]);
  const [emiData, setEmiData] = useState([]);
  const [data, setData] = useState();
  const [btn, setBtn] = useState('');
  const [refreshing, setRefreshing] = useState(false);


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchLoanData();
    });
    return unsubscribe;
  }, [fetchLoanData, navigation]);

  const onRefresh = useCallback(() => {
    fetchLoanData();
  }, [fetchLoanData]);

  const fetchLoanData = async () => {
    await loanCharge();
    // await loanMis();
  };

  const loanCharge = async () => {
    try {
      const response = await HTTPRequest.loanCharges();
      // console.log('Loan Charges:', response.data);
      if (response.status === 200) {
        if (response.data.response_status == 1) {
          console.log(response.data.response_data.data, 'loanCharges')
          setData(response.data.response_data.data);
          setBtn(response.data.response_data.paybtn)
          setActiveLoans(true);
          setEmiData(response.data.response_data.emidata);
          setDisplayLoan(response.data.response_data.displaydata)
          setLabel(response.data.response_data.totallabeldata)
        } else {
          setActiveLoans(false)
          Alert.alert('aaa')
        }

      } else {
        Alert.alert('Error', 'Failed to fetch loan charges.');
      }
    } catch (error) {
      console.error('Error fetching loan charges:', error);
      // Alert.alert('Error', );
    }
  };

  return (
    <ScrollView style={styles.container} refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }>
      <Head title="Loan Details" />
      <View style={styles.container1}>
        {displayLoan && displayLoan.length > 0 ? (
          <>
            <View style={styles.detailsContainer}>
              {displayLoan.map((item, index) => (
                <View style={styles.detailRow} key={index}>
                  <Text style={styles.label}>{item.key}</Text>
                  <Text style={styles.value}>{item.val}</Text>
                </View>
              ))}
              <View style={styles.separator} />
              {label?.length > 0 ? ( // Safely check if label exists and has items
                <>
                  {label.map((item, index) => (
                    <TouchableOpacity
                      key={index} // Use a unique key for each item
                      style={styles.verifyContainer} // Apply styles
                      onPress={() => {
                        if (item.url === 'repayment') {
                          navigation.navigate('RepaymentSchedule', { data: emiData }); // Navigate to RepaymentPage
                        } else if (item.url) {
                          navigation.navigate('GenericScreen', { keyName: item.Key, url: item.url }); // Navigate to GenericScreen
                        }
                      }}
                      disabled={!item.url} // Disable TouchableOpacity if url is missing
                    >
                      <Text style={[styles.verifyText, { color: item.url ? '#000' : '#888' }]}>
                        {item.Key || 'Unknown Key'} {/* Fallback to 'Unknown Key' if item.Key is missing */}
                      </Text>
                      <Ionicons
                        name="chevron-forward-outline"
                        size={20}
                        color={item.url ? '#000' : '#888'} // Adjust icon color based on URL availability
                      />
                    </TouchableOpacity>
                  ))}
                </>
              ) : (
                <Text style={styles.noItemsText}>No items available</Text> // Display fallback message if label is empty
              )}
              <View style={styles.separator} />
              {data.dismsg == "true" ?
                <Text style={{
                  fontSize: 12,
                  color: data.msgcolorcode,
                  textAlign: 'center',
                  marginVertical: 15,
                  fontWeight: 'bold',
                }}> {data.msg} </Text>
                : null}

              {btn == '1' ?
                <TouchableOpacity style={styles.repaymentButton} onPress={() => navigation.navigate('Payment')}>
                  <Text style={styles.repaymentButtonText}>Repayment</Text>
                </TouchableOpacity>
                : null
              }

            </View>

          </>

        ) : (
          <View style={styles.noLoanContainer}>
            <View style={styles.dottedBox}>
              <LottieView
                source={require('../assests/lottie/box-empty.json')} // Fixed the path to 'assets'
                autoPlay
                loop
                style={styles.chatIcon}
              />
              <Text style={styles.noLoanText}>You have No Active Loans</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('PreviousLoans')}>
              <Text style={styles.previousLoanLink}>Go To Previous Loans</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebebe8',
  },
  container1: {
    flex: 1,
    backgroundColor: '#ebebe8',
    // paddingHorizontal: 20,
    // marginTop:20,
  },
  verifyText: {
    color: '#000',
    // fontWeight: 'bold',
  },
  verifyContainer: {
    // backgroundColor: '#333',
    // padding: 10,
    // borderRadius: 10,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    marginBottom: 10,
    borderColor: '#fff'
  },
  chatIcon: {
    width: '100%',
    height: 150,
    marginBottom: 20,
  },
  note: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    marginVertical: 15,
    fontWeight: 'bold',
  },
  repaymentButton: {
    backgroundColor: '#419fb8',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: 15,
  },
  repaymentButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  detailsContainer: {
    // backgroundColor: '#F8F8F8',
    padding: 20,
    borderRadius: 10,
    marginTop: 15,
    // marginBottom: 5,

  },
  detailsContainer1: {
    // backgroundColor: '#F8F8F8',
    justifyContent: 'space-between',
    // borderRadius: 10,
    // marginBottom: 5,

  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 15,
  },
  value: {
    fontSize: 14,
    color: '#000',
    // fontWeight: 'bold',
    marginBottom: 15,
  },
  outstandingAmount: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 15,
  },
  outstandingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
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
    fontWeight: 'bold',
  },
});

export default RepaymentScreen;
