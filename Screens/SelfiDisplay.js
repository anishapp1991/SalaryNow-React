import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Head from "./Header";
import Ionicons from 'react-native-vector-icons/Ionicons';


const SelfieVerificationScreen = ({navigation}) => {
    return (
        <View style={styles.container1}>
            <Head title="Selfie Details" />
            <View style={styles.container}>

                <View style={styles.instructionsContainer}>
                    <View style={styles.con}>
                        <View style={styles.leftColumn}>
                            <View style={styles.instruction}>
                                <Image source={require('../assests/aa.png')} style={styles.icon} />
                                <Text style={styles.instructionText}>
                                    <Text style={styles.boldText}>Avoid glare:</Text>{" "}
                                    If you notice glare, step back from the light source.
                                </Text>
                            </View>

                            <View style={styles.instruction}>
                                <Image source={require('../assests/aaa.png')} style={styles.icon} />
                                <Text style={styles.instructionText}>
                                    <Text style={styles.boldText}>Don't hide your face:</Text>{" "}
                                    Avoid clothing, like hats, scarves, masks, or anything else that
                                    can hide your face.
                                </Text>
                            </View>

                            <View style={styles.instruction}>
                                <Image source={require('../assests/aaaa.png')} style={styles.icon} />
                                <Text style={styles.instructionText}>
                                    <Text style={styles.boldText}>Perfect selfie:</Text>{" "}
                                    The face should be properly inside the circle to click a perfect
                                    selfie.
                                </Text>
                            </View>
                        </View>

                        <View style={styles.rightColumn}>
                            <Image source={require('../assests/hands.png')} style={styles.icons} />
                        </View>
                    </View>
                </View>

                <View style={styles.mainContent}>
                    <Text style={styles.title}>Take Selfie to verify your identity</Text>
                    <Text style={styles.description}>
                        Quick and easy identification verification using your phone's camera.
                        Confirm your identity with a self-captured photo.
                    </Text>
                </View>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('FaceVerification')}>
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
    header: {
        alignItems: "center",
        marginVertical: 16,
    },
    headerText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    instructionsContainer: {
        marginBottom: 24,
    },
    instruction: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginVertical: 8,
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
        // padding: 10,
        // backgroundColor: '#4CAF50', // or any color you prefer
        borderRadius: 5,
        width: '100%',
        // marginTop: 20,
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
    cameraIcon: {
        width: 40,
        height: 40,
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
    },
    con: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: '100%',
    },
    leftColumn: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '60%',
    },
    rightColumn: {
        width: '35%',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch', // to ensure it takes the full height of the left side
    },
    instruction: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    icons: {
        width: 150,
        height: 200,
    },
});

export default SelfieVerificationScreen;
