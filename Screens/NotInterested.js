
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import HTTPRequest from '../utils/HTTPRequest';
import Head from './Header';

const NotInterestedScreen = ({ navigation, route }) => {
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [loans, setLoans] = useState(route?.params?.loan || '');
    console.log(loans)
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await HTTPRequest.notInte();
                if (response.status === 200) {
                    console.log(response.data, 'dd')
                    const fetchedOptions = response.data.response_data.map(item => ({
                        label: item.message,
                        value: item.message,
                    }));
                    setOptions(fetchedOptions);
                }
            } catch (error) {
                console.error('Error fetching options:', error);
            }
        };

        fetchOptions();
    }, []);

    const handleOptionPress = (value) => {
        setSelectedOption(value); // Set the selected option
    };

    const handleSubmit = async () => {
        try {
            var payload = {
                reason: selectedOption,
                remarks: '',
                loan_id: loans,
            }
            console.log(payload)
            const response = await HTTPRequest.notInteSub(payload);
            if (response.status === 200) {
                console.log(response.data, 'dd')

              navigation.navigate( 'Home');
                
            }
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Head title="Not Interested" />
            <View style={styles.container1}>
                <Text style={styles.text}>
                    You have chosen not to accept the loan :( We would like to know why)
                </Text>
                <Text style={styles.label}>Select Option</Text>

                <ScrollView style={styles.optionsContainer}>
                    {options.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.option,
                                selectedOption === option.value && styles.selectedOption // Highlight if selected
                            ]}
                            onPress={() => handleOptionPress(option.label)}
                        >
                            <Text style={styles.optionText}>
                                {index + 1}. {option.label}  {/* Adding serial number */}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 20,
        backgroundColor: '#fff',
    },
    container1: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F8F9FA',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 5,
    },
    text: {
        fontSize: 15,
        marginBottom: 20,
        fontWeight: 'bold',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    optionsContainer: {
        // maxHeight: 200, // Adjust height as needed
        marginBottom: 20,
    },
    option: {
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        marginBottom: 10,
    },
    selectedOption: {
        backgroundColor: '#c0e7ff', // Highlight color for selected option
    },
    optionText: {
        fontSize: 15,
        color: '#333',
    },
    submitButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        borderRadius: 25, // Curved button corners
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default NotInterestedScreen;
