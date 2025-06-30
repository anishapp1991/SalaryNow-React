import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  ScrollView,
  PermissionsAndroid,
  Alert,
  BackHandler,
  ToastAndroid,
  ActivityIndicator,
  Linking
} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Head from './Header';
import Geolocation from 'react-native-geolocation-service';
import { useSelector } from 'react-redux';
import HTTPRequest from '../utils/HTTPRequest';
import { useFocusEffect } from '@react-navigation/native'; // Import the hook
import LottieView from 'lottie-react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { closeApp } from './AppExit';


const LoanApply = ({ navigation, route }) => {
  const [loanAmount, setLoanAmount] = useState(route?.params?.loanAmount || {});
  const [product, setProduct] = useState(route?.params?.lastData || {});
  const [modalVisible, setModalVisible] = useState(false);
  const [inputAmount, setInputAmount] = useState(loanAmount.toString());
  const [loading, setLoading] = useState(false);
  const [emidata, setEmidata] = useState([]);
  const [datas, setDatas] = useState([0, 100]);
  const [fathersName, setFathersName] = useState('');
  const [company, setCompany] = useState('');
  const [salary, setSalary] = useState('');
  const [location, setLocation] = useState({ latitude: '', longitude: '' });
  const [address, setAddress] = useState('');
  const [modalVisible1, setModalVisible1] = useState(false);
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(true);
  const locations = useSelector((state) => state.location);
  useFocusEffect(
    React.useCallback(() => {
      if (product.id) fetchProductDetails();
    }, [product.id]) // Fetch whenever loanAmount or product ID changes
  );
  useFocusEffect(
    React.useCallback(() => {


      const checkLocationPermission = async () => {
        const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
        // console.log(granted, 'granted')
        if (granted) {
          getCurrentLocation();
        } else {
          requestLocationPermission();
        }
      };
      checkLocationPermission();
      getInformationDetails();
    }, []) // Fetch whenever loanAmount or product ID changes
  );

  useEffect(() => {
    const handleBackPress = () => {
      console.log('Back button pressed!');
      if (visible) {
        console.log('Modal is visible, preventing back press');
        return true; // Prevent the default back button behavior
      }
      return false; // Allow default behavior (e.g., exit app or go back)
    };

    // Only set up the back handler when the modal is visible
    if (visible) {
      console.log('Setting up back handler');
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress
      );

      // Cleanup the event listener when the modal visibility changes
      return () => {
        console.log('Cleaning up back handler');
        backHandler.remove();
      };
    }

    return () => {}; // Return empty cleanup when modal is not visible
  }, [visible]); // Only re-run when `visible` state changes


  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title: "Location Permission",
          message: "This app needs access to your location.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getCurrentLocation();
      } else {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to fetch the address. Please enable it in app settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      Alert.alert('Error', 'An error occurred while requesting location permission.');
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
      },
      (error) => {
        console.error('Error getting location:', error);
        Alert.alert('Location Error', `Failed to get location: ${error.message}`);
      },
      { enableHighAccuracy: false, timeout: 120000, maximumAge: 60000 } // Increased timeout to 120 seconds (2 minutes)
    );
  };

  const reverseGeocode = async () => {
    setLoading(true);
    try {
      // console.log(location.latitude, location.longitude);
      // console.log(locations.latitude, locations.longitude)
      const savedLocation = await EncryptedStorage.getItem('location');
      const parsedLocation = JSON.parse(savedLocation);
      // console.log('Retrieved location from EncryptedStorage:', parsedLocation);
      if (location.latitude == '' || location.longitude == '') {
      
        try {
          setLoading(true); // Start loading

          var data = {
            latitude: location.latitude,
            longitude: location.longitude,
            address: '',
            nooffakeapplication: "None",
            fakeenable: "None",
            status: "Apply Loan Page",
            loan_no: '',
          };
          // console.log(data, 'data')
          const response = await HTTPRequest.Location(data);
          if (response.status === 200) {
            // console.log(' nnnnnvvvvv');
            applyLoan(); // Call the applyLoan function
          } else {
            console.error("Failed to apply for loan:", response.status);
          }
        } catch (error) {
          console.error("Error applying loan:", error);
        } finally {
          setLoading(false); // Stop loading after operation
        }

      } else {
        try {
          setLoading(true); // Start loading

          var data = {
            latitude: parsedLocation.latitude,
            longitude: parsedLocation.longitude,
            address: '',
            nooffakeapplication: "None",
            fakeenable: "None",
            status: "Apply Loan Page",
            loan_no: '',
          };
          // console.log(data, 'data')
          const response = await HTTPRequest.Location(data);
          if (response.status === 200) {
            // console.log(' nnnnnvvvvv');
            applyLoan(); // Call the applyLoan function
          } else {
            console.error("Failed to apply for loan:", response.status);
          }
        } catch (error) {
          console.error("Error applying loan:", error);
        } finally {
          setLoading(false); // Stop loading after operation
        }
      }


    } catch (error) {
      console.error('Error reverse geocoding:', error);
    }
  }


  const getInformationDetails = async () => {
    try {
      const response = await HTTPRequest.professionalDetails();
      if (response.status === 200) {
        const ab = response.data.response_data;
        // console.log(ab, 'annn');
        setCompany(ab.company_name);
        setSalary(ab.salary);
      } else {
        console.error("Failed to fetch product details:", response.status);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const fetchProductDetails = async () => {
    try {
      // setLoading(true);  // Start loading before API call
      setInputAmount(loanAmount.toString());
      const response = await HTTPRequest.productDetails({
        product_id: product.id,
        loan_amount: loanAmount,
      });
      if (response.status === 200) {
        const ab = response.data.response_data;
        // console.log(ab.Total_APR,'mnbvc')
        setDatas(ab);
        setEmidata(ab.emi_data);
      } else {
        console.error("Failed to fetch product details:", response.status);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
    // finally{
    //   setLoading(false); // Stop loading after operation
    // }
  };

  const CustomMarker = () => (
    <View style={styles.customMarkerContainer}>
      <Image
        source={require('../assests/gold-rupee-icon.png')}
        style={styles.customMarkerImage}
      />
    </View>
  );

  const handleAmountChange = () => {
    const newAmount = parseInt(inputAmount);
    // console.log(product.maxAmount, 'pppppp')
    var last = product.maxAmount;
    if (newAmount > 2999 && newAmount <= last) {
      if (!isNaN(newAmount)) {
        setLoanAmount(newAmount);
        setModalVisible(false);
      } else {
        Alert.alert('Please enter a valid amount');
      }
    } else {
      Alert.alert('Warning', 'Input amout should range from 3000 to ' + product.maxAmount)
    }
  };

  const handleApply = async () => {
    const nameRegex = /^[A-Za-z][A-Za-z\s'-]*$/; // First letter should be a letter, followed by letters, spaces, apostrophes, or hyphens

    if (!fathersName.trim()) {
      setError('*Field is required'); // If empty or just spaces, show required error
    } else if (!nameRegex.test(fathersName)) {
      setError('*Name should not start with special characters and should only contain letters, spaces, apostrophes, or hyphens');
    } else {
      setError(''); // Clear error if valid
      // console.log(inputAmount)
      Alert.alert(
        'Confirmation', // Title
        'Are you sure you want to Apply Loan for ' + loanAmount + '?', // Message
        [
          {
            text: "No", // Button text for "No"
            onPress: () => console.log("User pressed No"), // Action on "No"
            style: "cancel", // Optional: Styling for the button
          },
          {
            text: "Yes", // Button text for "Yes"
            onPress: async () => {
              await reverseGeocode(); // Properly call the function
            }, // Action on "Yes"
          },
        ],
        { cancelable: false } // Optional: Prevent closing the alert by clicking outside
      );
    }
  };


  const applyLoan = async () => {
    try {

      var data = {
        loan_amt: loanAmount,
        loan_teneur: datas.loan_tenure,
        interest_amt: datas.interest_amt,
        Total_Pay_Amount: datas.Total_Pay_Amount,
        loan_purpose: fathersName,
        productId: product.id,
        app_version: 'N/A',
      };
      const response = await HTTPRequest.ApplyLoan(data);
      if (response.status === 200) {
        if (response.data.response_status === 1) {
          setShow(false);
          setVisible(true);
          // ToastAndroid.show('Loan Applied successfully!', ToastAndroid.SHORT);
          // navigation.navigate('Home')
        } else {
          ToastAndroid.show(response.data.response_msg, ToastAndroid.SHORT);
          navigation.navigate('NotEligible')
        }
      } else {
        console.error("Failed to apply for loan:", response.status);
      }
    } catch (error) {
      console.error("Error applying loan:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAgree = () => {
    setVisible(false);
    navigation.replace('EstatementWeb');
  }

  const handleHome = () => {
    setVisible(false);
    navigation.navigate('Home');
  }

  if (loading) {
    // Show a loading indicator while checking version
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#419FB8" />
      </View>
    );
  }


  return (
    <View style={styles.container1}>
      <Head title="Apply Loan" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.loanAmountSection}>
          <Text style={styles.label}>Loan Amount</Text>
          <View style={styles.loanAmountRow}>
            <View style={styles.amountSection}>
              <Text style={styles.amount}>₹ {loanAmount.toLocaleString()}</Text>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Ionicons name="pencil-sharp" size={25} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
            <MultiSlider
              values={[loanAmount]}
              min={3000}
              max={parseInt(product.maxAmount) || 10000} // Default max if not provided
              step={1000}
              onValuesChange={([value]) => setLoanAmount(value)} // Update the loan amount as the slider moves
              onValuesChangeFinish={([value]) => {
                setLoanAmount(value); // Ensure the state is updated
                fetchProductDetails(); // Call the API after the slider interaction finishes
              }}
              customMarker={() => <CustomMarker />}
              containerStyle={{ height: 40 }}
              trackStyle={{ height: 10 }}
            />
          </View>
        </View>

        {/* Modal for Input Amount */}
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
              <Text style={styles.modalText}>Enter Loan Amount:</Text>
              <TextInput
                style={styles.input}
                value={inputAmount}
                keyboardType="numeric"
                maxLength={7}
                onChangeText={setInputAmount}
              />
              <TouchableOpacity style={styles.submitButton} onPress={handleAmountChange}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>


        <Modal
          animationType="fade"
          transparent={true}
          visible={visible}
          onRequestClose={() => {
            console.log('onRequestClose triggered');
            // Don't close the modal when back button is pressed
          }}        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>

              <TouchableOpacity style={styles.outline} onPress={handleHome}>
                <Ionicons name="home-outline" size={30} color="#419fb8" />
              </TouchableOpacity>
              {/* Lottie Animation */}
              <LottieView
                source={require('../assests/lottie/tick-success.json')} // Replace with your Lottie file path
                autoPlay
                loop
                style={styles.lottie}
              />
              <Text style={{ textAlign: "center", marginBottom: 15, fontSize: 18, fontWeight: 'bold', color: '#5cb85c' }}>Upload your salary account statement to verify income and continue your application.</Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={styles.agreeButton1} onPress={handleAgree}>
                  <Text style={styles.modalButtonText}>Upload Bank Statement</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Details Section */}
        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total APR</Text>
            <Text style={styles.detailValue}>{datas.Total_APR}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Interest</Text>
            <Text style={styles.detailValue}>₹ {datas.interest_amt}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Repayment Amount</Text>
            <Text style={styles.detailValue}>₹ {datas.Total_Pay_Amount}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Loan Amount</Text>
            <Text style={styles.detailValue}>₹ {loanAmount}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Tenure</Text>
            <Text style={styles.detailValue}>{datas.loan_tenure} Days</Text>
          </View>
          <Text style={styles.text}>
            <Text style={styles.redAsterisk}>*</Text> Indicative based on IRR method and may vary as per actual tenure of Loan. The actual rate would be Indicated in the Loan Agreement.
          </Text>
        </View>

        <TextInput
          style={styles.input1}
          placeholder="Purpose of Loan"
          value={fathersName}
          onChangeText={(text) => {
            setFathersName(text);
            if (error) setError(''); // Clear the error when typing
          }}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <View style={styles.header}>
          <Text style={styles.headerText}>Professional Details</Text>
          <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('Information', { status: 'Edit' })}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detailBox}>
          <View style={styles.detailRow1}>
            <Text style={styles.value}>Company Name</Text>
            <Text style={styles.label}>{company || 'NO DATA FILLED!'}</Text>
          </View>
          <View style={styles.detailRow1}>
            <Text style={styles.value}>Salary</Text>
            <Text style={styles.label}>{salary ? `₹ ${salary} per month` : 'NO DATA FILLED!'}</Text>
          </View>
        </View>
        <Text style={styles.infoText}>* Processing fees is charged based on the risk profile of the customer</Text>
        <Text style={styles.infoText}>* GST will be charged extra</Text>
        <View>
          <Text style={styles.text}>
            <Text style={styles.redAsterisk}>*</Text> Indicative based on IRR method and may vary as per actual tenure of Loan. The actual rate would be Indicated in the Loan Agreement.
          </Text>
        </View>
        {show ?
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply Loan</Text>
          </TouchableOpacity>
          : null}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalButtonContainer: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    // borderRadius:15,

  },
  outline: {
    position: 'absolute',
    right: 15,
    top: 15,
    marginBottom: 15,
  },
  agreeButton1: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    backgroundColor: '#419fb8',
    borderRadius: 20,
    marginRight: 10,
  },
  modalButtonText: {
    color: '#fff'
  },
  customMarkerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    marginTop: 8
  },
  errorBorder: {
    borderColor: 'red', // Highlight the input with red if there's an error
  },
  errorText: {
    color: 'red',
    // marginBottom: 10,
    marginLeft: '2%'
  },

  text: {
    fontSize: 12, // Small font size for the entire text
    marginTop: 5,
  },
  redAsterisk: {
    color: 'red', // Red color for the asterisk
    fontSize: 12, // Same small size to match the text
  },
  customMarkerImage: {
    width: 30,
    height: 30,
  },
  loanAmountSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  loanAmountRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  amountSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 10,
    textAlign: 'center',
  },
  detailsSection: {
    marginBottom: 20,
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  detailLabel: {
    fontSize: 14,
    color: '#777',
  },
  detailValue: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: '#419fb8',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  applyButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    padding: 10,
    marginBottom: 15,
  },
  input1: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    padding: 10,
    // marginBottom: 15,
    backgroundColor: '#fff'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
  },
  editButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 8,
  },
  editText: {
    fontSize: 14,
    color: '#007bff',
  },
  infoText: {
    color: '#777',
    fontSize: 12,
    marginVertical: 1,
    textAlign: 'justify',
    marginBottom: 5,
  },
  warningText: {
    color: 'red',
    fontSize: 12,
    marginVertical: 1,
    textAlign: 'justify',
  },
  detailBox: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  detailRow1: {
    // flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  value: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  label: {
    fontSize: 15,
    color: '#666',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  cancelIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 10,
  },
  lottie: {
    width: 100,
    height: 100,
    // marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  note: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default LoanApply;
