import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Head from "./Header";
import Ionicons from 'react-native-vector-icons/Ionicons';

const SelfieVerificationScreen = ({ navigation }) => {
    return (
        <View style={styles.container1}>
            <Head title="PAN Details" />
            <View style={styles.container}>

                <View style={styles.instructionsContainer}>
                    <View style={styles.con}>
                        <View style={styles.leftColumn}>
                            <Image source={require('../assests/handss.png')} style={styles.icons} />
                        </View>

                        <View style={styles.rightColumn}>
                            <View style={styles.instruction}>
                                <Image source={require('../assests/bb.png')} style={styles.icon} />
                                <Text style={styles.instructionText}>
                                    <Text style={styles.boldText}>Don’t keep too far:</Text>{" "}
                                    Please don’t keep the document too far
                                </Text>
                            </View>

                            <View style={styles.instruction}>
                                <Image source={require('../assests/bbb.png')} style={styles.icon} />
                                <Text style={styles.instructionText}>
                                    <Text style={styles.boldText}>Don’t keep too close :</Text>{" "}
                                    Please don’t keep the document  too close and avoid glares.
                                </Text>
                            </View>

                            <View style={styles.instruction}>
                                <Image source={require('../assests/bbbb.png')} style={styles.icon} />
                                <Text style={styles.instructionText}>
                                    <Text style={styles.boldText}>Best view:</Text>{" "}
                                    The Face should be properly inside the circle to click a perfect selfie.
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.mainContent}>
                    <Text style={styles.title}>Capture your PAN card photo</Text>
                    <Text style={styles.description}>
                    Quick and easy document verification using your phone's camera. Confirm your document with a self-captured photo.
                    </Text>
                </View>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Pancard',{status:'Edit'})}>
                    <View style={styles.iconWrapper}>
                        <View style={styles.circle}>
                            <Ionicons name={"camera"} size={40} color={'#fff'} />
                        </View>
                        <Text style={styles.buttonText}>Take a Selfie</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        padding: 16,
        marginTop: 40,
    },
    container1: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    instructionsContainer: {
        marginBottom: 24,
    },
    con: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    leftColumn: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '40%',  // Reduced left column width to 40%
    },
    rightColumn: {
        width: '60%', // Increased right column width to 60%
        justifyContent: 'flex-start',
        paddingLeft: 20, // Adjusted padding
    },
    instruction: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    icon: {
        width: 50,
        height: 42,
        marginRight: 8,
    },
    instructionText: {
        fontSize: 11,
        color: "#333",
        flex: 1,
    },
    boldText: {
        fontWeight: "bold",
        fontSize: 12
    },
    icons: {
        width: 130,
        height: 130,
    },
    mainContent: {
        alignItems: "center",
        marginBottom: 32,
        marginTop: 32
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        color: "#333",
        textAlign: "center",
        marginBottom: 10,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    iconWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    circle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#419fb8',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
    },
});

export default SelfieVerificationScreen;
