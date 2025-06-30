import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ActivityIndicator, Modal, TextInput, ToastAndroid } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Head from './Header'; // Assuming you have a header component
import HTTPRequest from '../utils/HTTPRequest';
import { useFocusEffect } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';

const Profile = ({ navigation }) => {
  const [personalDetailsStatus, setPersonalDetailsStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [btn, setBtn] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [loan, setLoan] = useState('');
  const [remark, setRemark] = useState('');
  const [docBtn, setDocBtn] = useState();

  // Fetch personal details whenever the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchDashboard();
      fetchPersonalDetails();
    }, [])
  );
  const fetchDashboard = async () => {
    try {
      const storedLoan = await EncryptedStorage.getItem('dashboardloan');
      const userLoan = storedLoan ? JSON.parse(storedLoan)?.dashboardloan : null;
      console.log(userLoan.response_data.loan_status, 'bb')
      setDocBtn(userLoan.response_data.loan_status)
      setBtn(userLoan.response_data.data.mandatecancelbtn);
      setLoan(userLoan.response_data.data.loan_details.application_no);
    } catch (error) {
      console.error("Error fetching URL:", error);
    }
  };

  const fetchPersonalDetails = async () => {
    try {
      const response = await HTTPRequest.personal();
      if (response.status === 200) {
        const details = response.data.response_data;

        setPersonalDetailsStatus(details);
      } else {
        Alert.alert('Error', 'Failed to fetch personal details.');
      }
    } catch (error) {
      console.error('Error fetching personal details:', error);
      // Alert.alert('Error', 'An error occurred while fetching personal details.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => ({
    borderColor: status ? '#FEC007' : '#32CD32', // Yellow for Pending, Green for View
    borderWidth: 1, // Add border for visual effect
  });

  const getStatusTextColor = (status) => (status ? '#FEC007' : '#32CD32');

  if (loading) {
    // Show a loading indicator while checking version
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#419FB8" />
      </View>
    );
  }

  const handleContinue = () => {
    setModalVisible(true);
  };

  const handleAmountChange = async () => {
    try {
      var payload = {
        remarks: remark,
        loanNo: loan,
      }
      console.log(payload);
      const response = await HTTPRequest.cancelMan(payload);
      if (response.status === 200) {
        ToastAndroid.show(response.data.response_msg, ToastAndroid.SHORT);
        navigation.navigate('Home');
        setRemark('')
        setModalVisible(false);
      }
    } catch {
      Alert.alert('Error', 'Failed to delete data.');
    }
  };

  return (
    <View style={styles.container}>
      <Head title="My Profile" />

      <View style={styles.sectionContainer}>
        {/* Personal Details */}
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            navigation.navigate('Personal', {
              status: personalDetailsStatus.selfi || personalDetailsStatus.personal ? 'Edit' : 'View',
            })
          }
        >
          <Ionicons name="person-outline" size={28} color="#333" />
          <Text style={styles.cardText}>Personal Details</Text>
          <View style={["view" ? styles.pendingContainer : styles.pendingContainer1, getStatusStyle(personalDetailsStatus.selfi || personalDetailsStatus.personal)]}>
            <Ionicons
              name={personalDetailsStatus.selfi || personalDetailsStatus.personal ? 'time-outline' : 'eye-outline'}
              size={16}
              color={getStatusTextColor(personalDetailsStatus.selfi || personalDetailsStatus.personal)}
            />
            <Text style={["pending" ? styles.openText : styles.openText, { color: getStatusTextColor(personalDetailsStatus.selfi || personalDetailsStatus.personal) }]}>
              {personalDetailsStatus.selfi || personalDetailsStatus.personal ? 'Pending' : 'View'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Professional Details */}
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            navigation.navigate('Information', {
              status: personalDetailsStatus.employeement ? 'Edit' : 'View',
            })
          }
        >
          <Ionicons name="briefcase-outline" size={28} color="#333" />
          <Text style={styles.cardText}>Professional Details</Text>
          <View style={["view" ? styles.pendingContainer : styles.pendingContainer1, getStatusStyle(personalDetailsStatus.employeement)]}>
            <Ionicons
              name={personalDetailsStatus.employeement ? 'time-outline' : 'eye-outline'}
              size={16}
              color={getStatusTextColor(personalDetailsStatus.employeement)}
            />
            <Text style={[styles.openText, { color: getStatusTextColor(personalDetailsStatus.employeement) }]}>
              {personalDetailsStatus.employeement ? 'Pending' : 'View'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Residential Details */}

        {personalDetailsStatus.residential_action ? (
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            navigation.navigate('Address', {
              status: personalDetailsStatus.residential ? 'Edit' : 'View',
            })
          }
        >
          <Ionicons name="home-outline" size={28} color="#333" />
          <Text style={styles.cardText}>Residential Details</Text>
          <View style={["view" ? styles.pendingContainer : styles.pendingContainer1, getStatusStyle(personalDetailsStatus.residential)]}>
            <Ionicons
              name={personalDetailsStatus.residential ? 'time-outline' : 'eye-outline'}
              size={16}
              color={getStatusTextColor(personalDetailsStatus.residential)}
            />
            <Text style={[styles.openText, { color: getStatusTextColor(personalDetailsStatus.residential) }]}>
              {personalDetailsStatus.residential ? 'Pending' : 'View'}
            </Text>
          </View>
        </TouchableOpacity>
        ):(
          null
        )}

        {/* Bank Details */}
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            navigation.navigate('Bank', {
              status: personalDetailsStatus.bank ? 'Edit' : 'View',
            })
          }
        >
          <Ionicons name="briefcase-outline" size={28} color="#333" />
          <Text style={styles.cardText}>Salary Account Details</Text>
          <View style={["view" ? styles.pendingContainer : styles.pendingContainer1, getStatusStyle(personalDetailsStatus.bank)]}>
            <Ionicons
              name={personalDetailsStatus.bank ? 'time-outline' : 'eye-outline'}
              size={16}
              color={getStatusTextColor(personalDetailsStatus.bank)}
            />
            <Text style={[styles.openText, { color: getStatusTextColor(personalDetailsStatus.bank) }]}>
              {personalDetailsStatus.bank ? 'Pending' : 'View'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Documents */}
        {docBtn ?
         <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('AllDocuments')}>
         <Ionicons name="document-outline" size={28} color="#333" />
         <Text style={styles.cardText}>Documents</Text>
         <View style={[styles.pendingContainer, { borderColor: '#419fb8', borderWidth: 1 }]}>
           <Text style={[styles.openText, { color: '#419fb8' }]}>Open</Text>
         </View>
       </TouchableOpacity>
       :null
        }
       
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity style={styles.cancelIcon} onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={25} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalText}>Enter Remarks:</Text>
            <TextInput
              style={styles.textarea}
              value={remark}
              onChangeText={setRemark}
              multiline={true}
              numberOfLines={4} // Default height equivalent to 4 lines
              textAlignVertical="top" // Aligns text to the top
              scrollEnabled={true} // Enables scrolling inside the textarea
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleAmountChange}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.footer}>
        {btn == true ?
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueText}>Cancel E-Mandate</Text>
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
  textarea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    textAlignVertical: 'top', // Aligns text to the top
    backgroundColor: '#f9f9f9', // Optional: light background for clarity
    height: 100, // Set a fixed height or rely on `numberOfLines`
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    padding: 10,
    marginBottom: 15,
  },
  cancelIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#419fb8',
    paddingVertical: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#FFF',
  },
  continueButton: { backgroundColor: '#419fb8', alignItems: 'center', borderRadius: 25, paddingVertical: 12, width: '50%', alignItems: 'center', textAlign: 'center', marginLeft: '25%', marginTop: 50 },
  continueText: { color: '#fff', fontSize: 14 },

  footer: {
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
  modalCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
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
    width: 85,
    height: 30,
    justifyContent: 'center',
    borderRadius: 18,
    paddingHorizontal: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 14,
    marginLeft: 5,
  },
});

export default Profile;
