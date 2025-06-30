
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import Head from './Header'; // Ensure Head component is defined or imported
import EncryptedStorage from 'react-native-encrypted-storage';

const SactionScreen = ({ navigation, route }) => {
    const [loading, setLoading] = useState(false);
    const [url, setUrl] = useState('');
    const [loan, setLoan] = useState(route?.params?.sact || '');


    // Fetch URL based on user_id
    const fetchUrl = async () => {
        setLoading(true);
        try {
            const storedUserId = await EncryptedStorage.getItem('user_id');
            const userId = storedUserId ? JSON.parse(storedUserId)?.user_id : null;
            const storedId = await EncryptedStorage.getItem('token');
            const token = storedId ? JSON.parse(storedId)?.token : null;
            setUrl('https://green.salarynow.in/salaryadmin/api_v21/Ckyc/show/' + userId + '/' + loan + '/' + token);
        } catch (error) {
            console.error("Error fetching URL:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle navigation to a different screen when URL changes
    const handleWebViewMessage = (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            console.log("WebView message received:", data.response_data);

            const screenName = data?.response_data?.kycscreen?.page?.pagename;
            const status = data?.response_status;

            if (status === 1 && screenName) {
                navigation.navigate(screenName);
            } else {
                console.warn("No screen name found or status not success");
            }
        } catch (e) {
            console.error("Failed to parse WebView message:", e);
        }
    };

    // Fetch URL when component mounts
    useEffect(() => {
        fetchUrl();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
<Head title="CKYC Consent Agreement" />
            <View style={styles.container1}>
                {url ? (
                    <WebView
                        source={{ uri: url }}
                        onMessage={handleWebViewMessage}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        originWhitelist={['*']}
                        startInLoadingState={true}
                    />
                ) : (
                    <Button title="Retry" onPress={fetchUrl} />
                )}
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
        flexGrow: 1,
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
        fontSize: 14,
        marginRight: 8,
        fontWeight: 'bold',
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
    skipButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'transparent', // Transparent background
        borderWidth: 1, // Border thickness
        borderColor: '#419fb8', // Border color
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20, // Rounded corners
    },
    skipButton1: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'transparent', // Transparent background
        // borderWidth: 2, // Border thickness
        // borderColor: '#419fb8', // Border color
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20, // Rounded corners
    },
    skipButtonText: {
        color: '#419fb8',
        fontWeight: 'bold',
        fontSize: 14,
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

export default SactionScreen;