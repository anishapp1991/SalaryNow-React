import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, Button } from 'react-native';
import { WebView } from 'react-native-webview';
import CheckBox from '@react-native-community/checkbox';
import Head from './Header'; // Ensure Head component is defined or imported
import EncryptedStorage from 'react-native-encrypted-storage';
import HTTPRequest from '../utils/HTTPRequest';

const Agreement = ({ navigation, route }) => {
  const [loans, setLoan] = useState(route?.params?.loan || '');

  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [user_id, setUser_id] = useState('');
  const [userLoans, setUserLoans] = useState({});
  const [newChecked, setNewChecked] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [disc, setDisc] = useState('');

  const fetchUrl = async () => {

    setLoading(true);
    try {
      const storedUserId = await EncryptedStorage.getItem('user_id');
      const userId = storedUserId ? JSON.parse(storedUserId)?.user_id : null;
      const storedLoan = await EncryptedStorage.getItem('dashboardloan');
      const userLoan = storedLoan ? JSON.parse(storedLoan)?.dashboardloan : null;
      const storedId = await EncryptedStorage.getItem('token');
      const token = storedId ? JSON.parse(storedId)?.token : null;
      console.log(userLoan.response_data.data.agreement, 'userLoan');
      var str = userLoan.response_data.data.agreement;
      setUser_id(userId);
      setUrl('https://green.salarynow.in/salaryadmin/api_v21/Agreement/loanAgreement/' + userId + '/' + loans + '/' + token)
      fetchStatus();
    } catch (error) {
      console.error("Error fetching URL:", error);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchUrl();
  }, []);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await HTTPRequest.getText({ loanId: loans });
      if (res.status === 200) {
        const val = res.data;
        console.log(val, 'nnnnn');
        if (val.response_status == 1) {
          setDisc(val.response_msg);
          setModalVisible(val.response_data.isdialogshow)
        }
      } else {
        // Alert.alert('Error', 'Invalid Data');
      }
    } catch {
      console.error("Error fetching URL:", error);
    } finally {
      setLoading(false);
    }

  }


  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const handleAgree = async () => {
    try {

      const res = await HTTPRequest.microUser({ check_status: newChecked, loanId: loans });
      if (res.status === 200) {
        const val = res.data;
        console.log(val, 'val')
        setModalVisible(false);
        if (res.data.response_data == '1') {

          navigation.navigate('ParentDetail', { loans })
        }
        else {
          navigation.navigate('Reject')
        }
      }
    } catch {
      console.error("Error fetching URL:", error);
    }
  };



  return (
    <View style={styles.container}>
      <Head title="Loan Agreement Letter" />
      <View style={styles.container1}>
        {/* <Text>{url}</Text> */}
        {url ? (
          <WebView source={{ uri: url }} />
        ) : (
          <Button title="Retry" onPress={fetchUrl} />
        )}
      </View>


      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.design} onPress={() => setNewChecked(!newChecked)}>
              <CheckBox
                value={newChecked}
                onValueChange={setNewChecked}
                style={styles.checkbox}
              />
              <Text style={styles.checkboxLabel}>
                {disc}
              </Text>
            </TouchableOpacity>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.agreeButton1} onPress={handleAgree}>
                <Text style={styles.modalButtonText}>I Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.footer}>
        <View style={styles.checkboxContainer}>
          <CheckBox value={isChecked} onValueChange={setIsChecked} />
          <Text style={styles.checkboxText}>I have read and accept the terms mentioned in the Agreement Letter</Text>
        </View>

        <View style={styles.buttonContainer}>
          {isChecked == false ? (
            <TouchableOpacity
              style={styles.denyButton}
              onPress={() => navigation.navigate('Home')}>
              <Text style={styles.denyButtonText}>Cancel</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.denyButton1}>
              <Text style={styles.modalButtonText1}>Cancel</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.agreeButton, { backgroundColor: isChecked ? '#00A1E4' : '#DDD' }]}
            disabled={!isChecked}
            onPress={() => navigation.navigate('LoanAgreement')}>
            <Text style={styles.agreeButtonText}>I Agree</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container1: {
    flexGrow: 1, // Allow scrolling if content exceeds view height
    paddingHorizontal: 20,
    // paddingBottom: 10,
    marginTop: 15,
  },
  denyButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f44336',
    borderRadius: 5,
  },
  modalText1: {
    fontSize: 12,
    marginBottom: 15,
    color: '#333',
  },
  agreeButton1: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    backgroundColor: '#419fb8',
    borderRadius: 20,
    marginRight: 10,
  },
  agreeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    marginRight: 10,
  },
  modalButtonText1: {
    color: '#ababab',
    fontSize: 16,
  },
  modalButtonContainer: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    // borderRadius:15,

  },
  modalButtonText: {
    color: '#fff'
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  design: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    // alignContent:'flex-start'
    marginLeft: -5,
    // backgroundColor:'#000'
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,

  },
  checkboxText: {
    // marginLeft: 3,
    fontSize: 14,
    marginRight: 8,
    fontWeight: 'bold',
  },
  privacyPolicyLink: {
    fontSize: 14,
    color: '#00A1E4',
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  denyButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  denyButton1: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e5e5e5',
    borderRadius: 5,
  },
  denyButtonText: {
    color: '#FFF',
  },
  agreeButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'flex-start',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    // textAlign: 'center',
  },
});

export default Agreement;
