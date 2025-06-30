import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import Head from './Header';

const ViewAgreement = ({ navigation, route }) => {
    const [loans, setLoans] = useState(route?.params?.url || '');
 const googleViewerUrl = `https://docs.google.com/viewer?url=${loans}&embedded=true`;
  return (
    <View style={styles.container}>
      <Head title="View Agreement" />
      <View style={styles.container1}>
          <WebView source={{ uri: googleViewerUrl }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
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
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
    marginRight:8,
    fontWeight:'bold',
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
});

export default ViewAgreement;
