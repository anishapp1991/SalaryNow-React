import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import Head from './Header';

const ViewSanction = ({ navigation, route }) => {
    const [loans, setLoans] = useState(route?.params?.url || '');
    const googleViewerUrl = `https://docs.google.com/viewer?url=${loans}&embedded=true`;
  return (
    <View style={styles.container}>
      <Head title="View Sanction" />
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
});

export default ViewSanction;
