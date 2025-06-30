import React, { useContext, useEffect, useState } from 'react';
import { Alert, Linking, View, ActivityIndicator, } from 'react-native';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomDrawer from './Screens/CustomDrawer';
import { closeApp } from './Screens/AppExit';
import { isDeveloperOptionsEnabled } from './Screens/DeveloperOptions';
import AuthProvider from './ContextApi/AuthProvider';
import AuthContext from './ContextApi/AuthContext';
import NetworkProvider from './Screens/NetworkProvider';
import HandleNotifications from './Screens/HandleNotifications';
import Splash from './Screens/Splash';
import Welcome from './Screens/Welcome';
import Board from './Screens/Board';
import Signup from './Screens/Signup';
import Register from './Screens/Register';
import Policy from './Screens/Policy';
import History from './Screens/History';
import NoInternet from './Screens/NoInternet';
import FaceVerification from './Screens/FaceVerification';
import Home from './Screens/Home';
import Service from './Screens/Service';
import Help from './Screens/Help';
import Profile from './Screens/Profile';
import Credit from './Screens/Credit';
import ChargingHistory from './Screens/ChargingHistory';
import RFID from './Screens/RFID';
import Personal from './Screens/Personal';
import Information from './Screens/Information';
import Bank from './Screens/Bank';
import Repayment from './Screens/Repayment';
import Products from './Screens/Products';
import Address from './Screens/Address';
import ProductDetails from './Screens/ProductDetails';
import PreviousLoans from './Screens/PreviousLoans';
import AllDocuments from './Screens/AllDocuments';
import Pancard from './Screens/Pancard';
import Estatement from './Screens/Estatement';
import UpdateStatement from './Screens/UpdateStatement';
import LoanApply from './Screens/LoanApply';
import SactionScreen from './Screens/SactionScreen';
import NotInterested from './Screens/NotInterested';
import Agreement from './Screens/Agreement';
import LoanAgreement from './Screens/LoanAgreement';
import MandateShow from './Screens/MandateShow';
import RepaymentSchedule from './Screens/RepaymentSchedule';
import ViewSanction from './Screens/ViewSanction';
import ViewAgreement from './Screens/ViewAgreement';
import SalarySlip from './Screens/SalarySlip';
import UploadSalary from './Screens/UploadSalary';
import AddAdhar from './Screens/AddAdhar';
import About from './Screens/About';
import Notification from './Screens/Notification';
import Verify from './Screens/Verify';
import AddressProf from './Screens/AddressProf';
import Netbanking from './Screens/Netbanking';
import AdharVerify from './Screens/AdharVerify';
import Reference from './Screens/Reference';
import Reject from './Screens/Reject';
import NotEligible from './Screens/NotEligible';
import Loan from './Screens/Loans';
import GenericScreen from './Screens/GenericScreen';
import ParentDetail from './Screens/ParentDetail';
import Payment from './Screens/Payment';
import MaintenanceProvider from './Screens/Maintainance';
import HTTPRequest from './utils/HTTPRequest';
import EncryptedStorage from 'react-native-encrypted-storage';
import messaging from "@react-native-firebase/messaging";
import EstatementWeb from './Screens/EstatementWeb';
import Ckyc from './Screens/Ckyc';
import DeletedUser from './Screens/DeletedUser';

LogBox.ignoreAllLogs(true);
// Create Navigators
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// const linking = {
//   prefixes: ['com.kksv.salarynow://open'],
//   config: {
//     screens: {
//       Home: 'Home', // Maps to URL path
//       AllDocuments: 'AllDocuments',
//       Home: 'Home',
//     },
//   },
// };

// Auth Stack for non-authenticated users
const AuthStack = () => (
  <Stack.Navigator initialRouteName="Splash">

    <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
    <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
    <Stack.Screen name="Board" component={Board} options={{ headerShown: false }} />
    <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
    <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
    <Stack.Screen name="Policy" component={Policy} options={{ headerShown: false }} />
    <Stack.Screen name="History" component={History} options={{ headerShown: false }} />
    <Stack.Screen name="NoInternet" component={NoInternet} options={{ headerShown: false }} />
    <Stack.Screen name="AddAdhar" component={AddAdhar} options={{ headerShown: false }} />
    <Drawer.Screen name="Contact Us" component={Loan} options={{ headerShown: false }} />
    <Drawer.Screen name="AdharVerify" component={AdharVerify} options={{ headerShown: false }} />
    {/* <Stack.Screen name="Maintainance" component={Maintainance} options={{ headerShown: false }} /> */}
  </Stack.Navigator>
);

// Home Stack for authenticated users (Used for HomeDrawer)
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Homes" component={AppTab} />
    <Stack.Screen name="Service" component={Service} />
    <Stack.Screen name="Personal" component={Personal} />
    <Stack.Screen name="Information" component={Information} />
    <Stack.Screen name="Bank" component={Bank} />
    <Stack.Screen name="Address" component={Address} />
    <Stack.Screen name="Policy" component={Policy} />
    <Stack.Screen name="Help" component={Help} />
    <Stack.Screen name="Profile" component={Profile} />
    <Stack.Screen name="Credit" component={Credit} />
    <Stack.Screen name="ChargingHistory" component={ChargingHistory} />
    <Stack.Screen name="History" component={History} />
    <Stack.Screen name="RFID" component={RFID} />
    <Stack.Screen name="ProductDetails" component={ProductDetails} />
    <Stack.Screen name="PreviousLoans" component={PreviousLoans} />
    <Stack.Screen name="FaceVerification" component={FaceVerification} />
    <Stack.Screen name="AllDocuments" component={AllDocuments} />
    <Stack.Screen name="Pancard" component={Pancard} />
    <Stack.Screen name="Estatement" component={Estatement} />
    <Stack.Screen name="UpdateStatement" component={UpdateStatement} />
    <Stack.Screen name="LoanApply" component={LoanApply} />
    <Stack.Screen name="SactionScreen" component={SactionScreen} />
    <Stack.Screen name="NotInterested" component={NotInterested} />
    <Stack.Screen name="Agreement" component={Agreement} />
    <Stack.Screen name="LoanAgreement" component={LoanAgreement} />
    <Stack.Screen name="MandateShow" component={MandateShow} />
    <Stack.Screen name="RepaymentSchedule" component={RepaymentSchedule} />
    <Stack.Screen name="ViewSanction" component={ViewSanction} />
    <Stack.Screen name="ViewAgreement" component={ViewAgreement} />
    <Stack.Screen name="SalarySlip" component={SalarySlip} />
    <Stack.Screen name="UploadSalary" component={UploadSalary} />
    <Stack.Screen name="AddAdhar" component={AddAdhar} options={{ headerShown: false }} />
    <Drawer.Screen name="AdharVerify" component={AdharVerify} options={{ headerShown: false }} />
    <Stack.Screen name="Notification" component={Notification} />
    <Stack.Screen name="Verify" component={Verify} />
    <Stack.Screen name="AddressProf" component={AddressProf} />
    <Stack.Screen name="Netbanking" component={Netbanking} />
    <Stack.Screen name="Reference" component={Reference} />
    <Stack.Screen name="GenericScreen" component={GenericScreen} />
    <Stack.Screen name="Reject" component={Reject} options={{ headerShown: false }} />
    <Stack.Screen name="NotEligible" component={NotEligible} />
    <Stack.Screen name="ParentDetail" component={ParentDetail} />
    <Stack.Screen name="Payment" component={Payment} />
    <Stack.Screen name="EstatementWeb" component={EstatementWeb} />
    <Stack.Screen name="Ckyc" component={Ckyc} />
        <Stack.Screen name="DeletedUser" component={DeletedUser} />


    <Stack.Screen name="NoInternet" component={NoInternet} options={{ headerShown: false }} />
    {/* <Stack.Screen name="Maintainance" component={Maintainance} options={{ headerShown: false }} /> */}

  </Stack.Navigator>
);

// Drawer Navigator wrapping only the Home screen
const HomeDrawer = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawer {...props} />}
    screenOptions={{
      headerShown: false,
      drawerLabelStyle: { fontSize: 15, color: '#fff' },
      swipeEnabled: false,
    }}
  >
    <Drawer.Screen name="HomeDrawerScreen" component={HomeStack} />
    <Drawer.Screen name="About Us" component={About} />
    <Drawer.Screen name="FAQ" component={Service} />
    <Drawer.Screen name="Privacy Policy" component={Policy} />
    <Drawer.Screen name="Contact Us" component={Help} />
  </Drawer.Navigator>
);

// Tab Navigator with Home and Other Screens
const AppTab = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: '#419FB8', paddingBottom: 4, paddingTop: 6, borderColor: 'transparent' },
      tabBarActiveTintColor: '#fff',
      tabBarInactiveTintColor: '#fff',
    }}
  >
    <Tab.Screen
      name="Home"
      component={Home} // Use HomeDrawer only for Home
      options={{
        tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Products"
      component={Products}
      options={{
        tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? "briefcase" : "briefcase-outline"} size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Repayment"
      component={Repayment}
      options={{
        tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? "file-tray-full-sharp" : "file-tray-full-outline"} size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Profile"
      component={Profile}
      options={{
        tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? "person" : "person-outline"} size={size} color={color} />,
      }}
    />
  </Tab.Navigator>
);

// App Content based on Auth Context
const AppContent = () => {
  const { token } = useContext(AuthContext);
  const isAuthenticated = !!token;
  return isAuthenticated ? <HomeDrawer /> : <AuthStack />;
};

// Main App Component
const App = () => {
  const [loading, setLoading] = useState(true);
  const [requiresUpdate, setRequiresUpdate] = useState(false);
  // const [isUnderMaintenance, setIsUnderMaintenance] = useState(false);
  const [developerOptionsEnabled, setDeveloperOptionsEnabled] = useState(false);

  const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  };

  useEffect(() => {
    // checkDevOptions();
    checkAppVersion();

  }, []);



  const checkDevOptions = async () => {
    const isEnabled = await isDeveloperOptionsEnabled();
    // console.log(isEnabled,'tryhjj');
    if (isEnabled == true) {
      setLoading(false)
      setDeveloperOptionsEnabled(isEnabled);
      Alert.alert(
        "Developer options are enabled.",
        "Please disable Developer options to use the app.",
        [
          {
            text: 'OK',
            onPress: () => closeApp(),
            style: 'cancel',

          },
          // {
          //   text: 'Open Settings',
          //   onPress: () => {            
          //     Linking.openSettings(); // Open settings after calling startData
          //     closeApp(); // Call your startData function
          //   },
          // },
        ]
      );
      return false;

    } else {
      getFCMToken();

    }
  };

  const checkAppVersion = async () => {
    try {
      const storedData = await EncryptedStorage.getItem("appversion");
      let currentVersion = '1.13';  // Fallback to this if no version is found

      if (storedData) {
        const parsedData = JSON.parse(storedData);
        currentVersion = parsedData.appversion || currentVersion;  // Fallback to '1.8' if 'appversion' is missing
      }

      console.log("Current Version:", currentVersion);  // Log the current version for debugging

      // Save the app version to EncryptedStorage (just as a placeholder)
      const randomValue2 = { appversion: currentVersion };
      await EncryptedStorage.setItem("appversion", JSON.stringify(randomValue2));

      // Save the app version in EncryptedStorage
      await EncryptedStorage.setItem("appversion", JSON.stringify(randomValue2));
      const response = await HTTPRequest.CheckVersion();

      if (response.status === 200 && response.data?.response_data?.liveversion) {
        const latestVersion = response.data.response_data.liveversion;
        const oldVersion = response.data.response_data.oldversion;

        console.log('Latest Version:', latestVersion);
        console.log('Old Version:', oldVersion);

        // App should work if currentVersion matches oldVersion or latestVersion
        if (currentVersion === oldVersion || currentVersion === latestVersion) {
          console.log('No update needed.');
          setRequiresUpdate(false);
          setLoading(false);
          checkDevOptions();

        } else {
          console.log('Update required.');
          setRequiresUpdate(true);

          Alert.alert(
            'New version available',
            'A new version of the app is available. Do you want to update?',
            [
              {
                text: 'Cancel',
                onPress: () => closeApp(),
                style: 'cancel',
              },
              {
                text: 'Update',
                onPress: () => {
                  const storeUrl = Platform.select({
                    android:
                      'https://play.google.com/store/apps/details?id=com.kksv.salarynow',
                  });
                  Linking.openURL(storeUrl);
                  closeApp();
                },
              },
            ]
          );

          return false;
        }
      } else {
        console.log('Invalid response format:', response);
      }
    } catch (error) {
      console.error('Error checking version:', error);
    }
    return true;
  };


  const getFCMToken = async () => {
    try {
      const token = await messaging().getToken();
      const storedId = await EncryptedStorage.getItem('app_id');
      let appId;
    
      if (storedId) {
        const parsed = JSON.parse(storedId);
        appId = parsed.app_id;
        console.log('Existing app_id:', appId);
      } else {
        // Generate and store new app_id
        appId = generateRandomString(10);
        const randomValueData = { app_id: appId };
        await EncryptedStorage.setItem('app_id', JSON.stringify(randomValueData));
        console.log('Generated and saved new app_id:', appId);
      }
    
      const payload = {
        fcm_token: token,
        app_id: appId,
      };
    
      const tokenResponse = await HTTPRequest.sendFCMToken(payload);
      // console.log('FCM Token Response:', tokenResponse);
    
    } catch (error) {
      console.error('Error fetching FCM token:', error);
    }
  };

  // const handleDeepLinking = () => {
  //   Linking.getInitialURL().then((url) => {
  //     if (url) {
  //       console.log('Initial URL:', url);
  //       Linking.openURL(url); // Process the URL
  //     }
  //   });

  //   const handleLink = (event) => {
  //     console.log('URL Opened:', event.url);
  //   };

  //   Linking.addEventListener('url', handleLink);

  //   return () => {
  //     Linking.removeEventListener('url', handleLink);
  //   };
  // };

  if (loading) {
    // Show a loading indicator while checking version
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#419FB8" />
      </View>
    );
  }

  if (requiresUpdate) {
    // App won't proceed if update is required and user chooses to update
    return null;
  }

  if (developerOptionsEnabled) {
    // App won't proceed if Developer Option is required and user chooses to update
    return null;
  }

  return (
    <AuthProvider>
      <NavigationContainer theme={{ colors: { background: '#FFF' } }}>
        <MaintenanceProvider >
          <NetworkProvider>
            <HandleNotifications />
            <AppContent />
          </NetworkProvider>
        </MaintenanceProvider>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
