import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Head from './Header'; // Assuming you have a header component
import HTTPRequest from '../utils/HTTPRequest';
import { useFocusEffect } from '@react-navigation/native';

const AllDocuments = ({ navigation }) => {
  const [personalDetailsStatus, setPersonalDetailsStatus] = useState({});

  // Fetch personal details whenever the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchPersonalDetails();
    }, [])
  );

  const fetchPersonalDetails = async () => {
    try {
      const response = await HTTPRequest.personal();
      if (response.status === 200) {
        const details = response.data.response_data;
        console.log(details);
        setPersonalDetailsStatus(details);
      } else {
        // Alert.alert('Error', 'Failed to fetch personal details.');
      }
    } catch (error) {
      console.error('Error fetching personal details:', error);
      // Alert.alert('Error', 'An error occurred while fetching personal details.');
    }
  };

  const getStatusStyle = (status) => ({
    borderColor: status ? '#FEC007' : '#32CD32', // Yellow for Pending, Green for View
    borderWidth: 1,
  });

  const getStatusTextColor = (status) => (status ? '#FEC007' : '#32CD32');

  return (
    <View style={styles.container}>
      <Head title="Documents" />

      <View style={styles.sectionContainer}>
        {/* PAN Card */}
        {personalDetailsStatus.pancard ?
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('Pancard', {
                status: personalDetailsStatus.pancard_fileverify ? 'Edit' : 'View',
              })
            }
          >
            <Ionicons name="person-outline" size={28} color="#333" />
            <Text style={styles.cardText}>PAN Card</Text>
            <View style={["view" ? styles.pendingContainer : styles.pendingContainer1, getStatusStyle(personalDetailsStatus.pancard_fileverify)]}>
              <Ionicons
                name={personalDetailsStatus.pancard_fileverify ? 'time-outline' : 'eye-outline'}
                size={16}
                color={getStatusTextColor(personalDetailsStatus.pancard_fileverify)}
              />
              <Text style={[styles.openText, { color: getStatusTextColor(personalDetailsStatus.pancard_fileverify) }]}>
                {personalDetailsStatus.pancard_fileverify ? 'Pending' : 'View'}
              </Text>
            </View>
          </TouchableOpacity>

          : null
        }


        {/* Address Proof */}

        {personalDetailsStatus.addressproof ?

          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('AddressProf', {
                status: personalDetailsStatus.address_proof_verify ? 'Edit' : 'View',
              })
            }
          >
            <Ionicons name="briefcase-outline" size={28} color="#333" />
            <Text style={styles.cardText}>Address Proof</Text>
            <View style={["view" ? styles.pendingContainer : styles.pendingContainer1, getStatusStyle(personalDetailsStatus.address_proof_verify)]}>
              <Ionicons
                name={personalDetailsStatus.address_proof_verify ? 'time-outline' : 'eye-outline'}
                size={16}
                color={getStatusTextColor(personalDetailsStatus.address_proof_verify)}
              />
              <Text style={[styles.openText, { color: getStatusTextColor(personalDetailsStatus.address_proof_verify) }]}>
                {personalDetailsStatus.address_proof_verify ? 'Pending' : 'View'}
              </Text>
            </View>
          </TouchableOpacity>
          : null}


        {/* Salary Slip */}

        {personalDetailsStatus.salaryslip ?
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('SalarySlip', {
                status: personalDetailsStatus.salary_verify_file ? 'Edit' : 'View',
              })
            }
          >
            <Ionicons name="home-outline" size={28} color="#333" />
            <Text style={styles.cardText}>Salary Slip</Text>
            <View style={["view" ? styles.pendingContainer : styles.pendingContainer1, getStatusStyle(personalDetailsStatus.salary_verify_file)]}>
              <Ionicons
                name={personalDetailsStatus.salary_verify_file ? 'time-outline' : 'eye-outline'}
                size={16}
                color={getStatusTextColor(personalDetailsStatus.salary_verify_file)}
              />
              <Text style={[styles.openText, { color: getStatusTextColor(personalDetailsStatus.salary_verify_file) }]}>
                {personalDetailsStatus.salary_verify_file ? 'Pending' : 'View'}
              </Text>
            </View>
          </TouchableOpacity>
          : null}


        {/* Bank E-Statement */}

        {personalDetailsStatus.bankstatement ?
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('EstatementWeb', {
                status: personalDetailsStatus.bank_verify ? 'Edit' : 'View',
              })
            }
          >
            <Ionicons name="briefcase-outline" size={28} color="#333" />
            <Text style={styles.cardText}>Bank E-Statement</Text>
            <View style={["view" ? styles.pendingContainer : styles.pendingContainer1, getStatusStyle(personalDetailsStatus.bank_verify)]}>
              <Ionicons
                name={personalDetailsStatus.bank_verify ? 'time-outline' : 'eye-outline'}
                size={16}
                color={getStatusTextColor(personalDetailsStatus.bank_verify)}
              />
              <Text style={[styles.openText, { color: getStatusTextColor(personalDetailsStatus.bank_verify) }]}>
                {personalDetailsStatus.bank_verify ? 'Pending' : 'View'}
              </Text>
            </View>
          </TouchableOpacity>
          : null}

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  sectionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 5,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  cardText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  pendingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
    height: 30,
    justifyContent: 'center',
    borderRadius: 18,
    paddingHorizontal: 8,
  },
  pendingContainer1: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 75,
    height: 30,
    justifyContent: 'center',
    borderRadius: 18,
    paddingHorizontal: 8,
  },
  openText: {
    fontSize: 12,
    marginLeft: 5,
  },
});

export default AllDocuments;
