import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import LottieView from 'lottie-react-native'; // Lottie for animations
import Head from './Header';

const NotEligible = ({ navigation }) => { // Correctly destructured navigation prop

    const handleMail = () => {
        const url = 'mailto:hello@salarynow.in';
        Linking.openURL(url).catch((err) => console.error('Failed to open email:', err));
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <Head title="Not Eligible" />
            <View style={styles.container1}>
                {/* Logo */}
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../assests/logo.png')} // Replace with your calendar image
                        style={styles.logo}
                    />
                </View>

                {/* Message Section */}
                <Text style={styles.title}>Unfortunately, You Don't Meet One Of The Following Criteria For Credit Approval.</Text>
                
                {/* Criteria List */}
                <View style={styles.criteriaList}>
                    {[
                        "Self employed (Not meeting the criteria)",
                        "Minimum salary criteria not met",
                        "Out of service area",
                        "Unable to validate the documents",
                        "Age criteria (18 to 60)",
                        "Salary Credited in Cash",
                    ].map((item, index) => (
                        <Text key={index} style={styles.criteriaItem}>* {item}</Text>
                    ))}
                </View>

                {/* Note Section */}
                <Text style={styles.note}>
    In any case, we will invite you to reapply once you are eligible for the loan. 
    I appreciate your understanding in this matter. If you feel there has been an 
    error in scrutinizing your application, please contact our customer care - 
    <Text style={styles.email} onPress={handleMail}> hello@salarynow.in</Text>
</Text>


                {/* Footer */}
                <View style={styles.bottomContainer}>
                    <TouchableOpacity style={styles.chatContainer} onPress={() => navigation.navigate('Contact Us')}>
                        <Text style={styles.chatText}>Hello!</Text>
                        <LottieView
                            source={require('../assests/lottie/call-center.json')}
                            autoPlay
                            loop
                            style={styles.chatIcon}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    container1: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    logo: {
        width: 200,
        height: 100,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        marginBottom: 20,
    },
    criteriaList: {
        marginBottom: 20,
    },
    criteriaItem: {
        fontSize: 14,
        color: '#555',
        marginBottom: 8,
    },
    note: {
        fontSize: 14,
        color: '#555',
        marginBottom: 20,
    },
    email: {
        color: '#007BFF',
        fontWeight: 'bold',
    },
    bottomContainer: {
        alignItems: 'flex-end',
        paddingVertical: 5,
        marginTop: 15,
    },
    chatText: {
        fontSize: 18,
        color: '#333',
        fontWeight: 'bold',
    },
    chatContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: 5,
    },
    chatIcon: {
        width: 80,
        height: 120,
        marginLeft: 10,
    },
});

export default NotEligible;
