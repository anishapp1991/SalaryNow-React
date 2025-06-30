import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, FlatList, RefreshControl, Alert, TouchableOpacity, Modal, Pressable } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Ionicons'; // Import vector icons for dropdown
import HTTPRequest from '../utils/HTTPRequest';
import Head from './Header';
import EncryptedStorage from 'react-native-encrypted-storage';

const Service = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [faqData, setFaqData] = useState([]);
    const [expandedItem, setExpandedItem] = useState(null); // Track which item is expanded
    const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
    const [userDetails, setUserDetails] = useState('');

    useEffect(() => {
        fetchDatas();
        fetchFaq();
    }, []);


    const fetchDatas = async () => {
        const accessToken1 = await EncryptedStorage.getItem('user');
        const parsedToken1 = JSON.parse(accessToken1);
        const userData = parsedToken1?.user; 
        console.log(userData.name,'userData');
        await setUserDetails(userData.name);
        }

    const fetchFaq = async () => {
        setIsLoading(true);
        try {
            const response = await HTTPRequest.FaqData();
            if (response.status === 200) {
                setFaqData(response.data.response_data);
            } else {
                Alert.alert('Error', 'Failed to fetch FAQ data.');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while fetching FAQ data.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleExpand = (index) => {
        setExpandedItem(expandedItem === index ? null : index);
    };

    const saveResponse = async (index, response) => {
        const selectedQuestion = faqData[index]?.question; // Get the selected question
        setIsLoading(true);
        const payload = {
            type: response,
            question: selectedQuestion,
        };
        console.log('Payload:', payload); // Log payload to confirm its structure
    
        try {
            const response = await HTTPRequest.SaveFaqData(payload);
            console.log('Response:', response); // Log the response to check its structure
    
            if (response.status === 200) {
                console.log('Save successful');
                setModalVisible(true); // Show modal on success
            } else {
                console.log('Response status not 200:', response.status);
                Alert.alert('Error', 'Failed to save FAQ response.');
            }
        } catch (error) {
            console.error('Error:', error); // Log the error details
            Alert.alert('Error', 'An error occurred while saving FAQ response.');
        } finally {
            setIsLoading(false);
        }
    
        // Collapse the item
        setExpandedItem(null);
    };
    

    const renderItem = ({ item, index }) => (
        <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => toggleExpand(index)} style={styles.questionContainer}>
                <Text style={styles.questionText}>{item.question}</Text>
                <Icon name={expandedItem === index ? "chevron-up" : "chevron-down"} size={20} color="#333" />
            </TouchableOpacity>
            {expandedItem === index && (
                <Animatable.View animation="fadeIn" duration={300} style={styles.answerContainer}>
                    <Text style={styles.answerText}>{item.answer}</Text>

                    {/* Center-aligned Yes/No buttons */}
                    <View style={styles.responseContainer}>
                        <TouchableOpacity
                            style={styles.responseButton}
                            onPress={() => saveResponse(index, 'Yes')}
                        >
                            <Text style={styles.responseText}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.responseButton}
                            onPress={() => saveResponse(index, 'No')}
                        >
                            <Text style={styles.responseText}>No</Text>
                        </TouchableOpacity>
                    </View>
                </Animatable.View>
            )}
        </View>
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchFaq().finally(() => setRefreshing(false));
    };

    return (
        <View style={styles.container}>
            <Head title="FAQ" />
            <View style={styles.container1}>
                <View style={styles.Intro}>
                    <Text style={styles.introTitle} numberOfLines={1}>
                        Frequently Asked Questions
                    </Text>
                </View>
                <Animatable.View animation="fadeInUpBig" style={styles.footer}>
                    <FlatList
                        data={faqData}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={'#000'} />
                        }
                    />
                </Animatable.View>
            </View>

            {/* Modal Component */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Dear Customer</Text>
                        <Text style={styles.modalMessage}>
                            Our customer executive will get in touch with you shortly, thank you
                        </Text>
                        <Pressable
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
    },
    footer: {
        flex: 8,
        marginTop: 15,
    },
    skipButton1: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'transparent',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    skipButtonText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 14,
    },
    introTitle: {
        color: '#000',
        fontSize: 20,
        fontFamily: "Poppins-Regular",
        fontWeight: '700',
        marginTop: 10,
        textAlign: 'center',
    },
    container1: {
        flexGrow: 1,
        paddingHorizontal: 20,
        marginTop: 15,
    },
    Intro: {
        marginHorizontal: 25,
        textAlign: 'center',
    },
    itemContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    questionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    questionText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        marginRight: 10,
    },
    answerContainer: {
        marginTop: 10,
    },
    answerText: {
        fontSize: 14,
        marginBottom: 10,
    },
    responseContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    responseButton: {
        backgroundColor: '#419fb8',
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginHorizontal: 5,
    },
    responseText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: '#419fb8',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Service;
