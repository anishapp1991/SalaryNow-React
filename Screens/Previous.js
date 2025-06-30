import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView } from "react-native";
import Head from "./Header";
import Ionicons from 'react-native-vector-icons/Ionicons';
import HTTPRequest from '../utils/HTTPRequest';
import LottieView from 'lottie-react-native'; // Lottie for animations


const LoanScreen = ({ navigation }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [loan, setLoan] = useState();
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(false); // Track global loading state


  const fetchData = useCallback(async () => {
    try {
      setLoading(true); // Start loading when fetchData is invoked
      await Promise.all([
        await loanDetails(),
      ]);
      // Needs sequential execution due to `setLoan` dependency
    } catch (error) {
      console.error('Error in fetchData:', error);
    } finally {
      setLoading(false); // End loading when all data is fetched
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
    return unsubscribe;
  }, [fetchData, navigation]);


  const loanDetails = async () => {
    try {
setLoading(true)
      const response = await HTTPRequest.fetchMyPrevLoanDetails();
      if (response.status === 200) {
        // console.log(response.data.response_data.currentloan.reapaymentsechdule, 'loans')
        console.log(response.data.response_data.privousloan, 'loans')
        if (response.data.response_data.privousloan == undefined) {
          setLoan(false);
        } else {
          setLoan(true);
          const pastLoans = response.data.response_data.privousloan.map((item, index) => ({
            ...item,
            id: item.id || `loan-${index}`, // Assigning a fallback id
          }));
          setPast(pastLoans);
        }
        // setPast(response.data.response_data.privousloan)

      } else {
        Alert.alert('Error', 'Failed to fetch loan details.');
      }
    } catch (error) {
      console.error('Error fetching loan details:', error);
      // Alert.alert('Error', 'An error occurred while fetching loan details.');
    }finally{
      setLoading(false)
    }
  };
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* <ActivityIndicator size="large" color="#419FB8" /> */}
        <LottieView
          source={require('../assests/lottie/loading3.json')}
          autoPlay
          loop
          style={styles.iconImage1}
        />
        {/* <Text style={styles.loadingText}>Loading...</Text> */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Active Loan Card */}
      <Head title="Loan History" />
      <ScrollView style={styles.container1} contentContainerStyle={styles.scrollContainer}>

        {/* Past Loans Accordion */}
        {loan ?
        <FlatList
          data={past}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.accordionItem}>
              <TouchableOpacity onPress={() => toggleExpand(item.id)} style={styles.accordionHeader}>
                <View>
                  <Text style={styles.boldText}>{item.loanNo}</Text>
                  <Text style={styles.text1}>Closed on {item.closedate}</Text>
                </View>
                <Ionicons name={expandedId === item.id ? 'chevron-up' : 'chevron-down'} size={16} color="black" />
              </TouchableOpacity>

              {expandedId === item.id && (
                <View style={styles.expandedContent}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.text}>Approved Amount</Text>
                    <Text style={styles.text}>Loan Number</Text>
                  </View>
                  <View style={styles.rowBetween}>
                    <Text style={styles.boldText}>₹ {item.approved_amt}</Text>
                    <Text style={styles.boldText}>{item.loanNo}</Text>
                  </View>
                  <View style={styles.rowBetween}>
                    <Text style={styles.text}>Disbursed Date</Text>
                    <Text style={styles.text}>Closed Date</Text>
                  </View>
                  <View style={styles.rowBetween}>
                    <Text style={styles.boldText}>{item.disbursed_date}</Text>
                    <Text style={styles.boldText}>{item.closedate}</Text>
                  </View>

                  <View style={styles.card2}>
                    <TouchableOpacity style={styles.rowBetween} onPress={() => navigation.navigate('LoanDocuments', { datas: { loanNum: item.loanNo, close: item.closedate, doc: item.loandocs } })}>
                      <Text style={styles.text}>View Loan Documents</Text>
                      <Ionicons name='chevron-forward' size={16} color="black" />

                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}
        />
:
 <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
            {/* <ActivityIndicator size="large" color="#419FB8" /> */}
            <LottieView
              source={require('../assests/lottie/no-data.json')}
              autoPlay
              loop
              style={styles.iconImage1}
            />
            {/* <Text style={styles.loadingText}>No Data Found.</Text> */}
          </View>

        }
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", },
  container1: { flexGrow: 1, },
  card: { backgroundColor: "#FFF", padding: 16, borderRadius: 10, marginBottom: 16, elevation: 2, marginTop: 15 },
  card1: { padding: 12, borderRadius: 10, marginBottom: 16, backgroundColor: '#F5F5F5' },
  card2: { padding: 8, borderRadius: 10, marginBottom: 5, backgroundColor: '#F5F5F5' },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  boldText: { fontWeight: "bold", fontSize: 14 },
  text: { fontSize: 14, color: "#666" },
  text1: { fontSize: 12, color: "#666" },
  statusContainer1: { flexDirection: "row", alignItems: "center", backgroundColor: '#FFFFE7', padding: 6, paddingHorizontal: 8, borderRadius: 15, justifyContent: 'space-between', width: '48%', elevation: 3 },
  statusContainer2: { flexDirection: "row", alignItems: "center", backgroundColor: '#FBCEB1', padding: 6, paddingHorizontal: 8, borderRadius: 15, justifyContent: 'space-between', width: '48%', elevation: 3 },
  iconImage1: {
    height: '70%',
    width: '70%',
    marginTop: '80%',
    marginBottom: '80%',
  },
  statusContainer: { flexDirection: "row", alignItems: "center", backgroundColor: '#CBFFCB', padding: 6, borderRadius: 15, justifyContent: 'space-between', width: '40%', elevation: 3 },
  activeText: { marginLeft: 8, color: "green", fontWeight: "bold" },
  buttonOutline: { borderWidth: 1, borderColor: "#6E36BC", paddingVertical: 7, borderRadius: 25, alignItems: "center", marginBottom: 5, width: '50%', margin: 'auto', marginTop: 20 },
  buttonOutlineText: { color: "#6E36BC", fontWeight: "bold", fontSize: 16 },
  buttonFilled1: { backgroundColor: "#6E36BC", paddingVertical: 8, borderRadius: 25, alignItems: "center", marginBottom: 5, width: '65%', margin: 'auto', marginTop: 20 },
  buttonFilled: { backgroundColor: "#6E36BC", paddingVertical: 8, borderRadius: 25, alignItems: "center", marginBottom: 5, width: '65%', margin: 'auto' },
  buttonFilledText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  accordionItem: { borderRadius: 10, marginBottom: 8, elevation: 3, backgroundColor: '#F5F5F5', marginBottom: 15, margin: 5 },
  accordionHeader: { padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  expandedContent: { padding: 16, backgroundColor: '#fff', borderColor: '#EEE', borderWidth: 1 },
});

export default LoanScreen;
