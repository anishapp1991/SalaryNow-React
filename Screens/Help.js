import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, Linking, ToastAndroid, ActivityIndicator, Modal } from 'react-native';
import Head from './Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HTTPRequest from '../utils/HTTPRequest';

const ContactUsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [contactData, setContactData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchCall = async () => {
    try {
      const response = await HTTPRequest.getCalls(); // Replace with your API function
      if (response.status === 200) {
        if (response.data.response_status == 1) {
          ToastAndroid.show(response.data.response_msg, ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(response.data.response_msg, ToastAndroid.SHORT);
        }
      } else {
        console.error('Failed to fetch contact data');
      }
    } catch (error) {
      console.error('Error fetching contact data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContactData = async () => {
    try {
      const response = await HTTPRequest.getContactData(); // Replace with your API function
      if (response.status === 200) {
        setContactData(response.data.response_data || []);
      } else {
        console.error('Failed to fetch contact data');
      }
    } catch (error) {
      console.error('Error fetching contact data:', error);
    } finally {
      setLoading(false);
    }
  };


  const fetchDeletion = async () => {
    try {
      const response = await HTTPRequest.getDelection(); // Replace with your API function
      if (response.status === 200) {
        if (response.data.response_status == 1) {
          // ToastAndroid.show(response.data.response_msg, ToastAndroid.SHORT);
          await setMsg(response.data.response_msg);
          setModalVisible(true);

        } else {
          ToastAndroid.show(response.data.response_msg, ToastAndroid.SHORT);
        }
      } else {
        console.error('Failed to fetch contact data');
      }
    } catch (error) {
      console.error('Error fetching contact data:', error);
    } finally {
      setLoading(false);
    }
  };


  const getIcon = (actionType) => {
    switch (actionType) {
      case 'usercallback':
        return require('../assests/calls.png');
      case 'writeus':
        return require('../assests/Mail.png');
      case 'appissue':
        return require('../assests/support.png');
      case 'deleterequest':
        return require('../assests/dele.png');
      default:
        return null;
    }
  };


  const handleAgree = async () => {
    setModalVisible(false);
  }

  const handleAction = (actionType) => {
    if (actionType === 'usercallback') {
      fetchCall();
    } else if (actionType === 'writeus') {
      const url = 'mailto:hello@salarynow.in';
      Linking.openURL(url).catch((err) => console.error('Failed to open email:', err));
    } else if (actionType === 'appissue') {
      const supportUrl = 'mailto:hello@salarynow.in?subject=Technical Issue In App';
      Linking.openURL(supportUrl).catch((err) => console.error('Failed to open email:', err));
    } else if (actionType === 'deleterequest') {
      Alert.alert(
        'Confirm Action',
        'Are you sure you want to proceed?',
        [
          { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
          { text: 'Yes', onPress: () => fetchDeletion() },
        ],
        { cancelable: false }
      );
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#419FB8" />
            </View>
    );
  }

  return (
    <View style={styles.container1}>
      <Head title="Contact Us" />
      <View style={styles.container}>
        {contactData.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={() => handleAction(item.type)}
          >
            <Image source={getIcon(item.type)} style={styles.icon} />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.header}</Text>
              <Text style={styles.subtitle}>{item.subheader}</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="#419fb8" />
          </TouchableOpacity>
        ))}
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.checkboxLabel}>
                {msg}
              </Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={styles.agreeButton1} onPress={handleAgree}>
                  <Text style={styles.modalButtonText}>Go Back</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    padding: 16,
  },
  container1: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  agreeButton1: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    backgroundColor: '#419fb8',
    borderRadius: 20,
    marginRight: 10,
    marginTop: 20,
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
  modalContainer: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'flex-start',
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  option: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 5,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 13,
    color: '#6e6e6e',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ContactUsScreen;
