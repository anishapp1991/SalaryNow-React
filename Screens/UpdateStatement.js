import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import Head from './Header';
import HTTPRequest from '../utils/HTTPRequest';
import { WebView } from 'react-native-webview';

export default function UploadBankStatement({ navigation }) {
    const [bankName, setBankName] = useState('');
    const [Msg, setMsg] = useState('');
    const [msgstatus, setMsgstatus] = useState('');
    const [bankdetail, setBankDetail] = useState({});
    const [loading, setLoading] = useState(false);
    const [verificationUrl, setVerificationUrl] = useState(null); // State to store the URL
    const [ otherUrl , setOtherUrl] =  useState('');

    useEffect(() => {
        const getBank = async () => {
            try {
                const response = await HTTPRequest.bankStatement();
                if (response.status === 200) {
                    const power = response.data.response_data;
                    console.log(power, 'ppp')
                    setMsg(power.msgconsent)
                    setMsgstatus(power.msgstatus)
                    setBankName(power.bankName);
                    setBankDetail(power);
                    setOtherUrl(power.otherBnkStUrl);
                } else {
                    Alert.alert('Error', 'Failed to fetch Credential');
                }
            } catch (error) {
                console.error('Error fetching personal details:', error);
                // Alert.alert('Error', 'An error occurred while fetching Credential');
            }
        };
        getBank();
    }, []);

    useEffect(() => {
        if (
            bankdetail.consentbasebank === 0 &&
            bankdetail.otherbtnstatus === 1
        ) {
            // Automatically navigate when consentbasebank is 0 and otherbtnstatus is 1
            navigation.replace('Estatement', { status: bankdetail });
        }
    }, [bankdetail, navigation]);

    const Verfication = async () => {
        try {
            setLoading(true);
            const response = await HTTPRequest.VerifyOTP();
            if (response.status === 200) {
                console.log(response.data.response_data.stmtUrl, 'fghjkl')
                setVerificationUrl(response.data.response_data.stmtUrl);

            } else {
                Alert.alert('Error', 'Failed to fetch Credential');
            }
        } catch (error) {
            console.error('Error fetching personal details:', error);
            // Alert.alert('Error', 'An error occurred while fetching Credential');
        } finally {
            setLoading(false);
        }
    };

    if (verificationUrl) {
        // Render WebView if the URL is available
        navigation.replace('Verify', { verificationUrl });;
    }

    return (
        <View style={styles.container}>
            <Head title="Upload Bank Statement" />
            <View style={styles.container1}>
                <Text style={styles.subText}>
                    Please share the bank statement for your main account, where most of your earnings or salary is deposited, for the last 3 months
                </Text>

                <Text style={styles.label}>Bank Name</Text>
                <TextInput style={styles.input} value={bankName} editable={false} />
                {msgstatus == '1' ?
                    <Text style={styles.pass}>{Msg}</Text>
                    : null}
                {bankdetail.consentbasebank == 1 && bankdetail.otherbtnstatus == 1 ?
                    <Text style={styles.selectText}>Select an Option</Text>
                    : null}

                {bankdetail.consentbasebank == 1 ?
                    <TouchableOpacity style={styles.otpButton} onPress={Verfication}>
                        <Text style={styles.recommended}>RECOMMENDED</Text>
                        <View style={styles.row}>
                            <Image
                                style={styles.chatIcon}
                                source={require('../assests/mob.png')}
                            />
                            <View style={styles.textContainer}>
                                <Text style={styles.otpText}>OTP based verification</Text>
                                <Text style={styles.infoText}>From RBI Licensed Account Aggregator</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    : null}
                {bankdetail.consentbasebank == 1 && bankdetail.otherbtnstatus == 1 ?
                    <Text style={styles.orText}>OR</Text>
                    : null}

                {bankdetail.otherbtnstatus === 1 && (
                    <TouchableOpacity
                        style={styles.otherOptionButton}
                        onPress={() =>
                            navigation.replace('EstatementWeb')
                            // navigation.replace('Estatement', { status: bankdetail })
                        }
                    >
                        <Text style={styles.otherOptionText}>Select Other Option</Text>
                    </TouchableOpacity>
                )}
            </View>
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
        </View>
    );
}

const styles = StyleSheet.create({
    container1: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    subText: {
        fontSize: 14,
        color: '#777',
        marginBottom: 20,
    },
    chatIcon: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    input: {
        backgroundColor: '#dfdfdf',
        borderRadius: 10,
        marginLeft: 5,
        paddingLeft: 5
    },
    label: {
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
        marginLeft: 5,
    },
    pass: {
        elevation: 5,
        fontSize: 18,
        fontWeight: "bold",
        color: 'green',
        textAlign: 'center',
        marginTop: 50,
        padding: 20,
        backgroundColor: '#e5ffeb',
        marginBottom: 20,
        borderRadius: 10
    },
    selectText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 10,
    },
    otpButton: {
        borderWidth: 1,
        borderColor: '#4caf50',
        borderRadius: 8,
        padding: 15,
        marginBottom: 20,
        backgroundColor: '#e0f2f1',
        position: 'relative',
        marginTop:25,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    otpText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    recommended: {
        fontSize: 12,
        color: '#fff',
        position: 'absolute',
        right: 0,
        fontWeight: 'bold',
        backgroundColor: '#4CAF50',
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 5,
    },
    infoText: {
        fontSize: 12,
        color: '#777',
        marginTop: 5,
    },
    orText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#333',
        marginVertical: 10,
    },
    otherOptionButton: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    otherOptionText: {
        fontSize: 16,
        color: '#333',
    },
});
