import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal, BackHandler, Alert, ActivityIndicator, Platform } from 'react-native';
// Import the checkbox from react-native-community
import CheckBox from '@react-native-community/checkbox';
import HttpRequest from '../utils/HTTPRequest';
import publicIP from 'react-native-public-ip';
import EncryptedStorage from 'react-native-encrypted-storage';
import { closeApp } from './AppExit';

const Board = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [newChecked, setNewChecked] = useState(false);
  const [modalVisibles, setModalVisibles] = useState(false);
  const [ips, setIps] = React.useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  const handleAgree = async () => {
    if (!newChecked) {
      Alert.alert('Warning', 'Please check the box to agree.');
      return;
    }

    setLoading(true); // Start loading
    try {
      const storedAppId = await EncryptedStorage.getItem('app_id');
      const appid = storedAppId ? JSON.parse(storedAppId)?.app_id : null;
      const ip = await publicIP();
      console.log(ip);
      setIps(ip);

      const res = await HttpRequest.language({
        app_id: appid,
        language: 'en',
        ckyc_status: 1,
        ip_address: ip,
      });

      if (res.status === 200) {
        console.log(res.data,'jkjkjkjk');
        if(res.data.response_status == 1){
          setModalVisible(false);
        }else{
          Alert.alert('Error', res.data.response_msg);
        }

      } else {
        console.log('Error occurred:', res);
      }
    } catch (error) {
      console.error(error);
      // Alert.alert('Error', 'Failed to process request. Please try again.');
    } finally {
      setLoading(false); // Stop loading after response
    }
  };

  // Handle Deny button press
  const handleDeny = () => {
    setModalVisible(false);
   closeApp();
  };


  const allow = () => {
    navigation.navigate('Signup');
  }


  const Deny = () => {
    Alert.alert(
      'Alert Title',
      'My Alert Msg',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]
    );
  }

  return (
    <View style={styles.container}>
      {/* Modal for I Agree / Deny */}
      {loading && (
        <Modal transparent={true} animationType="none" visible={loading}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                 <ActivityIndicator size="large" color="#419FB8" />
               </View>
        </Modal>
      )}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              I confirm that I can understand and communicate in English Language. I agree that all modes of communication with Salary Now and respective Lender shall be in English Language.
            </Text>
            <Text style={styles.modalText1}>
              I acknowledge that my credit report and CKYC may be retrieved by an NBFC, which could differ from the actual lender, affliated to Salary Now partners.
            </Text>
            <TouchableOpacity style={styles.design} onPress={() => setNewChecked(!newChecked)}>
              <CheckBox
                value={newChecked}
                onValueChange={setNewChecked}
                style={styles.checkbox}
              />
              <Text style={styles.checkboxLabel}>
                I agree with the above
              </Text>
            </TouchableOpacity>
            <View style={styles.modalButtonContainer}>
              {newChecked == false ?
                <TouchableOpacity style={styles.denyButton} onPress={handleDeny}>
                  <Text style={styles.modalButtonText}>Deny</Text>
                </TouchableOpacity>
                : <TouchableOpacity style={styles.denyButton1} >
                  <Text style={styles.modalButtonText1}>Deny</Text>
                </TouchableOpacity>
              }


              <TouchableOpacity style={styles.agreeButton} onPress={handleAgree}>
                <Text style={styles.modalButtonText}>I Agree</Text>
              </TouchableOpacity>


            </View>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Permissions</Text>
        <View style={styles.row}>
          <Image source={require('../assests/insurance.png')} style={styles.chatIcon} />
          <Text style={styles.subHeaderText}>Your data is 100% safe and secure</Text>
        </View>
        <Text style={styles.description}>
          For the purpose of Credit Risk Assessment, we need the following Permissions from you.
        </Text>
      </View>

      {/* Permission Cards */}
      <ScrollView style={styles.permissionsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.permissionCard}>
          <Image source={require('../assests/camera.png')} style={styles.icon} />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Camera</Text>
            <Text style={styles.cardDescription}>
              Permission to access Camera is required so that requisite KYC documents can be easily scanned or captured
              and thus saving time by allowing us to auto-fill relevant data.This will ensure that you are provided with a seamless experience while using the application.
            </Text>
          </View>
        </View>

        <View style={styles.permissionCard}>
          <Image source={require('../assests/map.png')} style={styles.icon} />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Location</Text>
            <Text style={styles.cardDescription}>
              Collect and monitor information about the location of your device to do a risk assessment for credit
              scoring.
            </Text>
          </View>
        </View>

        <View style={styles.permissionCard}>
          <Image source={require('../assests/memory-card.png')} style={styles.icon} />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Storage</Text>
            <Text style={styles.cardDescription}>
              Storage permission is required so that KYC documents and photo proofs required for verification can be
              easily uploaded from the device. These also allow for easy downloads of loan agreements onto devices, post loan approval. This ensures faster application processing and a seamless user experience.
            </Text>
          </View>
        </View>

        {/* Data Security Note */}
        <Text style={styles.securityNote}>
          * Your data is encrypted and secure and will only be used for the purpose of internal assessment within our
          network.
        </Text>
      </ScrollView>

      {/* CheckBox and Buttons */}
      <View style={styles.footer}>
        <View style={{flexDirection:'row', marginBottom:10, alignItems:'center'}}>
          <TouchableOpacity style={styles.checkboxContainer} onPress={() => setIsChecked(!isChecked)}>
            <CheckBox value={isChecked} onValueChange={setIsChecked} />
          </TouchableOpacity>
          <Text style={styles.checkboxText}>I have read and I accept the </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Policy')}>
            <Text style={styles.privacyPolicyLink}>Privacy Policy</Text>
          </TouchableOpacity>
          </View>
        <View style={styles.buttonContainer}>

          {isChecked == false ?
            <TouchableOpacity style={styles.denyButton} onPress={() => Alert.alert(
              '',
              'Are You Sure',
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                { text: 'Exit', onPress: () => closeApp() },
              ]
            )}>
              <Text style={styles.denyButtonText}>Deny</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity style={styles.denyButton1} >
              <Text style={styles.modalButtonText1}>Deny</Text>
            </TouchableOpacity>
          }
          <TouchableOpacity
            style={[styles.agreeButton, { backgroundColor: isChecked ? '#4CAF50' : '#DDD' }]}
            disabled={!isChecked}
            onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.agreeButtonText}>I Agree</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Board;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
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
    // alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    // textAlign: 'center',
  },
  chatIcon: {
    height: 15,
    width: 15,
    marginRight:5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalText: {
    fontSize: 12,
    marginBottom: 5,
    color: '#333',
  },
  modalText1: {
    fontSize: 12,
    marginBottom: 15,
    color: '#333',
  },
  checkboxLabel: {
    color: '#333',
  },
  modalButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  agreeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    marginRight: 10,
  },
  denyButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f44336',
    borderRadius: 5,
  },
  dd: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#ababab',
    borderRadius: 5,
  },
  denyButton1: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e5e5e5',
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  modalButtonText1: {
    color: '#ababab',
    fontSize: 14,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#419fb8',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  subHeaderText: {
    color: '#c2ffc7',
    fontWeight: 'bold',
    marginVertical: 10,
    fontSize: 12,
  },
  description: {
    fontSize: 12,
    textAlign: 'center',
    color: '#FFF',
  },
  permissionsContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 10,

  },
  permissionCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    // shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    // elevation: ,
    borderWidth: 1,
    borderColor: '#dfdfdf'
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 15,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  cardDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  securityNote: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    marginVertical: 15,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 5 },
    // elevation: 5,
    borderWidth: 1,
    borderColor: '#dfdfdf'
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 15,
  },
  design: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    // alignContent:'flex-start'
    marginLeft: -5,
    // backgroundColor:'#000'
  },
  checkboxText: {
    fontSize: 14,
  },
  privacyPolicyLink: {
    fontSize: 14,
    color: '#419fb8',
    fontWeight: 'bold'
    // textDecorationLine: 'underline',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  denyButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  dd: {
    color: '#ababab',
    fontSize: 16,
  },
  agreeButtonText: {
    color: '#FFF',
    fontSize: 14,
    // backgroundColor:'#000'
  },
});