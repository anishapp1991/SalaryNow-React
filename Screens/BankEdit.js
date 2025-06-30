import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import HTTPRequest from '../utils/HTTPRequest';
import LottieView from 'lottie-react-native'; // Lottie for animations
import Icons from 'react-native-vector-icons/EvilIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Head from "./Header";

const BankingInformationScreen = ({ navigation, route }) => {
    const [data, setData] = useState(route?.params?.datas || '');
    const [accountNumber, setAccountNumber] = useState("");
    const [ifscCode, setIfscCode] = useState("");
    const [accountError, setAccountError] = useState("");
    const [ifscError, setIfscError] = useState("");

    // Validation on Proceed
    const validateAndProceed = () => {
        let valid = true;

        // Account Number Validation
        if (!accountNumber || accountNumber.length < 9 || accountNumber.length > 16) {
            setAccountError("Account number must be 9 to 16 digits.");
            valid = false;
        } else {
            setAccountError("");
        }

        // IFSC Code Validation
        const ifscPattern = /^[A-Z]{4}[0-9]{7}$/;
        if (!ifscPattern.test(ifscCode)) {
            setIfscError("IFSC must be 11 characters: First 4 letters caps, followed by 7 numbers.");
            valid = false;
        } else {
            setIfscError("");
        }

        if (valid) {
            alert("Proceeding with valid details!");
        }
    };

    return (
        <View style={styles.container}>
            {/* Bank Logo */}

            <Head title="Bank Information" />
            <View style={styles.container1}>

                <View style={styles.logoContainer}>
                {data.bank_logo == '' ?
                    <View style={styles.iconContainer1}>
                                    <View style={styles.iconContainer}>
                                        <Icon name="bank" size={25} color="#000" />
                                    </View>
                                </View>
                                :
                    <View style={styles.imgContainer}>
                        <View style={styles.imgContainer1}>
                                <Image source={{ uri: data.bank_logo }} style={styles.logo} />
                                </View>
                                </View>

                            }
                     
                    <Text style={styles.bankTitle}>{data.alias == '' ? data.BankName : data.alias}</Text>
                </View>

                {/* Bank Name (Read-Only) */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Bank Name</Text>
                    <View style={styles.mobileContainer}>
                        <TouchableOpacity style={styles.icon} onPress={() => navigation.navigate('AllBank')}>
                            <Icons name="pencil" size={28} color="#000" />
                        </TouchableOpacity>
                        <TextInput style={styles.input} value={data.BankName} editable={false} />
                    </View>
                </View>

                {/* Account Number Input */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Account No.</Text>
                    <TextInput
                        style={[styles.input, accountError ? styles.errorBorder : null]}
                        value={accountNumber}
                        onChangeText={setAccountNumber}
                        keyboardType="numeric"
                        maxLength={16}
                    />
                    {accountError ? <Text style={styles.errorText}>{accountError}</Text> : null}
                </View>

                {/* IFSC Code Input */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>IFSC</Text>
                    <TextInput
                        style={[styles.input, ifscError ? styles.errorBorder : null]}
                        value={ifscCode}
                        onChangeText={setIfscCode}
                        autoCapitalize="characters"
                        maxLength={11}
                    />
                    {ifscError ? <Text style={styles.errorText}>{ifscError}</Text> : null}
                </View>

                {/* Information Box */}
                <View style={styles.infoBox}>
                    <LottieView
                        source={require('../assests/lottie/bulb.json')}
                        autoPlay
                        loop
                        style={styles.iconImage1}
                    />
                    <Text style={styles.infoText}>
                        Please, ensure that this account is your salary account as it will be used for loan disbursal and E-Mandate purposes.
                    </Text>

                </View>

                {/* Proceed Button */}
                <TouchableOpacity style={styles.proceedButton} onPress={validateAndProceed}>
                    <Text style={styles.buttonText}>Proceed</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container1: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    iconContainer1: {
        width: 50,
        height: 50,
        borderRadius: 35,
        borderWidth: 1,
        borderColor: '#d6d6d6',
        backgroundColor: '#fcfdfe',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10, // Space between the logo and text
    },
    iconContainer: {
        width: 35,
        height: 35,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#d6d6d6',
        backgroundColor: '#e8d7ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconImage1: {
        width: 40,
        height: 40,
    },
    mobileContainer: {
        position: 'relative',
        width: '100%',
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    icon: {
        position: 'absolute',
        top: 8, // Adjust to align vertically
        right: '1%', // Adjust to align horizontally
        width: 30, // Adjust size of Lottie animation
        height: 30,
        zIndex: 1,
    },
    imgContainer1: {
        width: 50,
        height: 50,
        // borderWidth: 1,
        // borderColor: '#d6d6d6',
        borderRadius: 10,
        backgroundColor: '#F4EDFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imgContainer: {
        width: 60,
        height: 60,
        borderWidth: 1,
        lineHeight: 50,
        borderColor: '#6a1b9a',
        borderRadius: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8, // Adds space between the logo and the bank name
        // elevation:5,
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    logo: {
        width: 40,
        height: 40,
        resizeMode: "contain",
    },
    bankTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 5,
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
        marginBottom: 5,
        marginLeft: 15
    },
    input: {
        backgroundColor: "#f4f4f4",
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 45,
        fontSize: 16,
        color: "#000",
    },
    errorBorder: {
        borderColor: "red",
        borderWidth: 1,
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginTop: 3,
    },
    infoBox: {
        backgroundColor: "#f4e7ff",
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
        flexDirection: 'row',
        flexWrap:'nowrap'
    },
    infoText: {
        fontSize: 12,
        color: "#6c3483",
        width:'90%'
    },
    proceedButton: {
        backgroundColor: "purple",
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: "center",
        marginTop: 20,
    },
    buttonText: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "bold",
    },
});

export default BankingInformationScreen;
