import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import Head from './Header';
import LottieView from 'lottie-react-native';

const KYCDocumentsScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container1}>
      <Head title="KYC Documents" />
      <View style={styles.container}>


        <Text style={styles.subHeader}>
        Hurrah! KYC completed
        </Text>

        <LottieView
          source={require('../assests/lottie/Hurray.json')}
          autoPlay
          loop
          style={styles.lottieView}
        />

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Image source={require('../assests/id-badge.png')} style={styles.chatIcon} />

            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Identity Verification</Text>
              <Text style={styles.infoSubtitle}>Easily verify your Aadhaar</Text>
            </View>
            <LottieView
          source={require('../assests/lottie/tick-success.json')}
          autoPlay
          loop
          style={styles.chatIcon}
        />
          </View>

          <View style={styles.infoRow}>
            <Image source={require('../assests/id-card.png')} style={styles.chatIcon} />

            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Document Verification</Text>
              <Text style={styles.infoSubtitle}>
                PAN verification needs a clear picture of your PAN Card within the camera screen
              </Text>
            </View>
            <LottieView
          source={require('../assests/lottie/tick-success.json')}
          autoPlay
          loop
          style={styles.chatIcon}
        />
          </View>

          <View style={styles.infoRow}>
            <Image source={require('../assests/uil_selfie.png')} style={styles.chatIcon} />

            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Selfie</Text>
              <Text style={styles.infoSubtitle}>
                Provide a well-lit photo of your face within the camera screen
              </Text>
            </View>
            <LottieView
          source={require('../assests/lottie/tick-success.json')}
          autoPlay
          loop
          style={styles.chatIcon}
        />
          </View>
        </View>

        

      </View>
      <View style={styles.footer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Details')}
            >
              <Text style={styles.buttonText}>Proceed</Text>
            </TouchableOpacity>
          </View>
        </View>

    </ScrollView>

  );
};

const styles = StyleSheet.create({
  container1: {
    flex: 1,

  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  chatIcon: {
    // flex:5,
    width: 30,
    height: 30,
    // marginBottom: 20,
    // marginHorizontal: '35%'

  },
  container: {
    flexGrow: 1, // Allow scrolling if content exceeds view height
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  lottieView: {
    width: '100%',
    height: 180,
    // marginTop: 20,
  },
  subHeader: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
    color: '#000',
    fontWeight:'bold'
  },
  infoContainer: {
    width: '100%',
    marginBottom: 20,

  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 10,
    marginBottom: 20,
  },
  infoText: {
    marginLeft: 10,
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  infoSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  button: {
    backgroundColor: '#419fb8',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    // marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default KYCDocumentsScreen;
