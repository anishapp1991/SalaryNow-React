import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Head from './Header';
import HTTPRequest from '../utils/HTTPRequest';
import LottieView from 'lottie-react-native'; // Lottie for animations
import { GoogleSignin } from '@react-native-google-signin/google-signin';


GoogleSignin.configure({
    webClientId: '19120401926-ejcu9eb00suo54v1repqsu600geeugrj.apps.googleusercontent.com',
    offlineAccess: true,
});

const PersonalInformationScreen = ({ navigation }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [alternateNumber, setAlternateNumber] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [show, setShow] = useState('');

    const [errors, setErrors] = useState({
        alternateNumber: '',
        email: '',
        mobile: '',
    });


    const fetchData = useCallback(async () => {
        try {
            setLoading(true); // Start loading when fetchData is invoked
            await Promise.all([
                await fetchUserData(),
                await fetchUrl(),
            ]);
            // Needs sequential execution due to `setLoan` dependency
        } catch (error) {
            console.error('Error in fetchData:', error);
        } finally {
            setLoading(false); // End loading when all data is fetched
        }
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchData();
        });
        return unsubscribe;
    }, [fetchData, navigation]);


    const fetchUserData = async () => {
        setLoading(true)
        try {
            const response = await HTTPRequest.personalDetails();
            if (response.status === 200) {
                const userData = response.data.response_data;
                console.log(userData, 'userData');
                setData(userData);
                setAlternateNumber(userData.alterMobile);
                setEmail(userData.email);
                setMobile(userData.mobile);
            } else {
                Alert.alert('Error', 'Failed to fetch user data');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while fetching user data');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const fetchUrl = async () => {

        setLoading(true);
        try {
            const response = await HTTPRequest.repaymentApi();
            if (response.status === 200) {
                const userData = response.data.response_data;
                console.log(userData, 'mmmmmnbnbbvvccdd');
                setShow(userData.loanstatus)
            } else {
                Alert.alert('Error', 'Failed to fetch user data');
            }

        } catch (error) {
            console.error("Error fetching URL:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const signIn = async () => {
        console.log('aaaaa')

        if (isSigningIn) {
            // Prevent duplicate sign-in attempts
            console.log('mmmmmm')
            return;
        }

        try {
            console.log('vvvvvv')

            // setLoading(true)
            setIsSigningIn(true); // Set signing-in flag to true

            // Sign out to clear previous sessions (optional, if you want to force account picker)
            await GoogleSignin.signOut();

            // Perform Google Sign-In
            // setLoading(false)
            const userInfo = await GoogleSignin.signIn();
            // Process the user info
            setEmail(userInfo.data.user.email); // Update email state
            // console.log('Google User Info:', userInfo);
        } catch (error) {
            console.error('Google Sign-In Error:', error);

            // Handle specific error
            if (error.code === 'SIGN_IN_CANCELLED') {
                Alert.alert('Sign-In Cancelled', 'You cancelled the sign-in process.');
            } else if (error.code === 'IN_PROGRESS') {
                Alert.alert('Sign-In in Progress', 'Please wait while sign-in completes.');
            } else {
                Alert.alert('Warning', "You Didn't Select Any Account");
            }
        } finally {
            setIsSigningIn(false); // Reset signing-in flag
        }
    };


    // const validateFields = () => {
    //     console.log('Validating fields...');
    //     let newErrors = {};
    //     // if (!alternateNumber) {
    //     //     formErrors.alternateNumber = 'Alternate Mobile is required';
    //     // } else if (!mobileNumberRegex.test(alternateNumber)) {
    //     //     formErrors.alternateNumber = 'Invalid mobile number (must be exactly 10 digits and cannot start with 0)';
    //     // }

    //     setErrors(newErrors);

    //     // Return `false` if any error exists
    //     return Object.keys(newErrors).length === 0;
    // };

    const saveDetails = async () => {
        console.log('mmmmmmmm')
        // if (!validateFields()) {
        //     console.log('Validation failed:', errors);
        //     return;  // Stop execution if validation fails
        // }
        const payload = {
            mobile: data.mobile,
            alterMobile: alternateNumber,
            father_name: data.father_name,
            gender: data.gender,
            marital_status: data.marital_status,
            mother_name: data.mother_name,
            fullname: data.fullname,
            pan_no: data.pan_no,
            dob: data.dob,
            alternate_mobile_verify: data.alternate_mobile_verify,
            email: email,
            whatsapp_no: data.whatsapp_no,
        };
        console.log('Payload:', payload);
        setLoading(true);
        try {
            const response = await HTTPRequest.updatePersonal(payload);
            if (response.status === 200) {
                console.log(response.data, 'sssss');

                if (response.data.response_status == 1) {
                    ToastAndroid.show('Data submitted successfully!', ToastAndroid.SHORT);
                    fetchUserData();
                    handleEditToggle();
                    // fetchData();

                } else {
                    Alert.alert('Error', response.data.response_msg);

                }

            } else {
                Alert.alert('Error', 'Failed to submit data');
            }
        } catch (error) {
            console.error('Error occurred during submission:', error);
            Alert.alert('Error', 'An error occurred while submitting data');
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {/* <ActivityIndicator size="large" color="#419FB8" /> */}
                <LottieView
                    source={require('../assests/lottie/loading3.json')}
                    autoPlay
                    loop
                    style={styles.iconImage1}
                />
                {/* <Text style={styles.loadingText}>Loading...</Text> */}
            </View>
        );
    }

    return (
        <View style={styles.container1}>
            <Head title="Personal Details" />
            <View style={styles.container}>

                <View style={styles.infoContainer}>
                    {/* Company Name */}
                    <View style={styles.infoItem}>
                        <Icon name="call" size={22} color="#6a1b9a" />
                        <View style={styles.infoText}>
                            <Text style={styles.label}>Mobile No.</Text>
                            <Text style={styles.value}>{data.mobile}</Text>
                        </View>
                    </View>
                    <View style={styles.infoItem}>
                        <Icon name="mail-outline" size={22} color="#6a1b9a" />
                        <View style={styles.infoText}>
                            <Text style={styles.label}>Email</Text>
                            {isEditing ? (
                                <>
                                    {/* <TextInput
                                        style={styles.input}
                                        value={email}
                                        onFocus={signIn} // This triggers Google Sign-In when the input is tapped
                                        editable={false} // Prevent manual editing
                                    /> */}
                                    <TextInput
                                        style={styles.input}
                                        placeholder=""
                                        value={email}
                                        // onChangeText={setEmail}
                                        onFocus={signIn} // Pass the signIn function
                                    />
                                    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                                </>

                            ) : (
                                <Text style={styles.value}>{email}</Text>
                            )}
                        </View>
                    </View>
                    <View style={styles.infoItem}>
                        <Icon name="add-call" size={22} color="#6a1b9a" />
                        <View style={styles.infoText}>
                            <Text style={styles.label}>Alternate No.</Text>
                            {isEditing ? (
                                <>
                                    <TextInput
                                        style={styles.input}
                                        value={alternateNumber}
                                        onChangeText={setAlternateNumber} // Use the validation function
                                        keyboardType="phone-pad"
                                        maxLength={10}
                                    />
                                    {errors.alternateNumber && <Text style={styles.errorText}>{errors.alternateNumber}</Text>}
                                </>

                            ) : (
                                <Text style={styles.value}>{alternateNumber == '' ? 'No Data Found!' : alternateNumber}</Text>
                            )}
                        </View>
                    </View>
                    {/* <View style={styles.infoItem}>
                        <Icon name="assignment" size={22} color="#6a1b9a" />
                        <View style={styles.infoText}>
                            <Text style={styles.label}>Aadhaar No.</Text>
                            <Text style={styles.value}>{data.aadhaar_no}</Text>
                        </View>
                    </View> */}
                    {/* <View style={styles.infoItem}>
                        <Icon name="credit-card" size={22} color="#6a1b9a" />
                        <View style={styles.infoText}>
                            <Text style={styles.label}>PAN No.</Text>
                            <Text style={styles.value}>{data.pan_no}</Text>
                        </View>
                    </View>
                    <View style={styles.infoItem}>
                        <Icon name="date-range" size={22} color="#6a1b9a" />
                        <View style={styles.infoText}>
                            <Text style={styles.label}>D.O.B.</Text>
                            <Text style={styles.value}>{data.dob}</Text>
                        </View>
                    </View> */}
                </View>
                {/* <View style={styles.footer}>

                {show == '' || show == '5' || show == '3' || show == '4' ?
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => {
                            if (isEditing) {
                                saveDetails();  // Call the function to save data
                            }
                            handleEditToggle(); // Toggle edit mode
                        }}
                    >
                        <Text style={styles.editButtonText}>{isEditing ? 'Save Details' : 'Edit Details'}</Text>
                    </TouchableOpacity>
                    : null}
                    </View> */}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 20, position:'relative' },
    container1: { flex: 1, backgroundColor: '#fff' },
    infoContainer: { marginTop: 20 },
    infoItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    infoItem1: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 15 },
    footer: {
        width: '100%',
        borderWidth:1,
        borderColor:'#333',
        position:'absolute',
        paddingVertical: 20,
        bottom:'10%',

      },
    infoText: { marginLeft: 15, flex: 1 },
    label: { fontSize: 16, fontWeight: 'bold', color: '#000' },
    label1: { fontSize: 16, fontWeight: 'bold', color: '#000', marginTop: 15 },
    value: { fontSize: 16, color: '#666', marginTop: 3 },
    closeButton: {
        alignItems: 'flex-end',
        marginBottom: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderColor: "#ccc",
    },
    modalItemText: {
        fontSize: 16,
    },
    input: {
        fontSize: 16,
        color: '#000',
        borderBottomWidth: 1,
        borderBottomColor: '#6a1b9a',
        paddingVertical: 5,
    },
    input1: {
        fontSize: 16,
        color: '#000',
        borderBottomWidth: 1,
        borderBottomColor: '#6a1b9a',
        height: 45,

    },
    editButton: {
        borderWidth: 1,
        borderColor: "#6a1b9a",
        padding: 10,
        borderRadius: 30,
        alignItems: "center",
        // position: 'absolute',
        // bottom: '10%',
        // width: '90%',
        // margin: 'auto',
        // left: '10%',
        // right: '10%',

    },
    // dropdownContainer: {
    //   marginVertical: 20,
    // },
    editButtonText: { fontSize: 16, color: '#6a1b9a', fontWeight: 'bold' },
    pickerWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        // paddingHorizontal: 7,
    },
    pickerText: {
        flexBasis: '70%',
        color: "#444",
        marginTop: 10
    },
    selectIcon: {
        textAlign: 'right',
        flexBasis: '30%',
        marginTop: 8
    },

    errorText: {
        color: 'red',
        fontSize: 12,
        marginLeft: 10,
        marginTop: 0, // Align closer to the input box
        marginBottom: 0,
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 8,
        fontSize: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        color: 'black',
    },
    inputAndroid: {
        fontSize: 14,
        color: '#000',
    },
});

export default PersonalInformationScreen;
