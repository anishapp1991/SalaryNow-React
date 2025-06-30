import React, {useContext, useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import EncryptedStorage from 'react-native-encrypted-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AuthContext from '../ContextApi/AuthContext';
import HTTPRequest from '../utils/HTTPRequest';

const CustomDrawer=(props)=>{
    const [userDetails, setUserDetails] = useState({});
    const [selfieUrl, setSelfieUrl] = useState('');
    const { logout } = useContext(AuthContext);
    const handleLogout = () => {
        logout();
        // props.navigation.navigate('Welcome');
  };
  useEffect(() => {
    fetchData();
    fetchSelfie();
  }, []);

  const fetchSelfie = async () => {
    try {
      const response = await HTTPRequest.selfie({ doctype: "selfie" });
      if (response.status === 200) {
        const details = response.data.data.front;
        if (details) {
          setSelfieUrl(details);
        }
      } else {
        // Alert.alert('Error', 'Failed to fetch selfie.');
      }
    } catch (error) {
      console.error('Error fetching selfie:', error);
      // Alert.alert('Error', 'An error occurred while fetching selfie.');
    }
  };

  const fetchData = async () => {
      try {
        const response = await HTTPRequest.personalDetails();
        if (response.status === 200) {
          const details = response.data.response_data;
          setUserDetails(details);
          const userDetailss = { user: details };
          await EncryptedStorage.setItem('user', JSON.stringify(userDetailss));
        } else {
          // Alert.alert('Error', 'Failed to fetch personal details.');
        }
      } catch (error) {
        console.error('Error fetching personal details:', error);
        // Alert.alert('Error', 'An error occurred while fetching personal details.');
    }   
  }

  const getIcon = (routeName) => {
    switch (routeName) {
      case 'About Us':
        return 'newspaper-outline';
        case 'FAQ':
            return 'receipt-outline';
      case 'Privacy Policy':
        return 'document-text-outline';
      case 'Contact Us':
        return 'call-outline';
      default:
        return 'md-home';
    }
  };

    return(
        <View style={styles.container}>
        <DrawerContentScrollView style={styles.DrawerContent} {...props}>
            <View style={{ flex: 1, padding: 10 }}>
                
      <View style={styles.userInfoContainer}>
        {selfieUrl ? (
  <Image
    source={{ uri: selfieUrl }}
    style={styles.profileImage}
  />

) : (
      <Image   style={styles.profileImage}
      source={require('../assests/profile.png')}></Image>
)}
        {/* User Details */}
        {userDetails && (
          <View style={styles.userDetails}>
            
            <Text style={styles.userName}>{userDetails.fullname}</Text>
            <Text style={styles.userMobile}>{userDetails.mobile}</Text>
          </View>
        )}
      </View>
    </View>

            <View style={{ flex: 1, padding: 10 }}>
    <View style={styles.horizontalLine} />

    {/* Map over each route in the drawer and wrap it in a box */}
    {props.state.routes.slice(1).map((route, index) => (
      <TouchableOpacity
        key={index}
        style={styles.boxContainer}
        onPress={() => props.navigation.navigate(route.name)}
      >
                  <Ionicons name={getIcon(route.name)} size={20} color="#419fb8" style={styles.icon} />
        <Text style={styles.drawerItemText}>{route.name}</Text>
      </TouchableOpacity>
    ))}

    <View style={styles.horizontalLine} />
  </View>
        </DrawerContentScrollView>
            <View style={{padding:30, alignItems:'center', justifyContent:'center'}}>
            {/* <Text style={{fontSize:15,color:'#fff'}}>App Version 1.6.5</Text> */}
            </View>
             <View style={{padding:20,borderTopWidth:1,borderTopColor:'#fff'}}>
            <TouchableOpacity onPress={handleLogout}>
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
            <Ionicons name="log-out-outline" size={22} color={'#fff'}/>
            <Text style={{fontSize:15,color:'#fff',alignSelf:'center'}}>Log- Out</Text>
            </View>
            </TouchableOpacity>
            </View>
        </View>
    )
}
const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#419fb8'
    },
    imageBorderContainer: {
      borderWidth: 2, // Border around the image container
      borderColor: '#FFF', // Border color
      borderRadius: 40, // Rounded corners to match the circular image
      // padding: 2, // Padding inside the border
      height: 62,
      width: 62,
      marginLeft: '6%',
    },
    boxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#fff',
        marginBottom: 10,
      },
      icon: {
        marginRight: 10,
      },
      drawerItemText: {
        fontSize: 16,
        color: '#419fb8',
      },
    DrawerContent:{
        flex: 1, 
        backgroundColor:'#419fb8'
    },
    horizontalLine: {
        height: 1, // Thickness of the line
        backgroundColor: '#fff', // Color of the line
        marginVertical: 10, // Spacing above and below the line
      },
      userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center', // Centers the text vertically with the image
        marginTop: 20,
      },
      profileImage: {
        height: 60,
        width: 60,
        borderRadius: 40,
        marginLeft: '5%',
      },
      userDetails: {
        marginLeft: 15, // Space between image and text
        justifyContent: 'center', // Centers the text vertically relative to the image
      },
      userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff'
      },
      userMobile: {
        fontSize: 14,
        color: '#fff',
        marginTop: 5,
      },
 })
export default CustomDrawer;