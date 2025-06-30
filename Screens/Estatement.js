import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, ScrollView, TextInput, ToastAndroid, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Head from './Header';
import DocumentPicker from 'react-native-document-picker';
import HTTPRequest from '../utils/HTTPRequest';
import { RNS3 } from 'react-native-aws3';
import EncryptedStorage from 'react-native-encrypted-storage';

// Function to simulate PDF password protection check (50% chance for testing purposes)
const isPdfPasswordProtected = (uri) => Math.random() < 0.5;

const BankStatementScreen = ({ navigation, route }) => {
    const { status } = route.params;
    // console.log(status, 'status')
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [passwordRequiredFileIndex, setPasswordRequiredFileIndex] = useState(null);
    const [keyId, setKeyId] = useState('');
    const [accessKey, setAccessKey] = useState('');
    const [path, setPath] = useState('');
    const [region, setRegion] = useState('');
    const [bucket, setBucket] = useState('');
    const [buttonStatus, setButtonStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [receivedFiles, setReceivedFiles] = useState([])



    useEffect(() => {
        const s3Credential = async () => {
            try {
                const response = await HTTPRequest.getCredential({ page: "bank_statement" });
                if (response.status === 200) {
                    const power = response.data.data;
                    setKeyId(power.IAM_KEY);
                    setAccessKey(power.IAM_SECRET);
                    setBucket(power.bucket);
                    setPath(power.path);
                    setRegion(power.region);
                } else {
                    // Alert.alert('Error', 'Failed to fetch Credential');
                }
            } catch (error) {
                console.error('Error fetching personal details:', error);
                // Alert.alert('Error', 'An error occurred while fetching Credential');
            }
        };
        s3Credential();
        fetchStatement();
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        const accessToken1 = await EncryptedStorage.getItem('dashboardloan');
        const parsedToken1 = JSON.parse(accessToken1);
        const userData = parsedToken1?.dashboardloan;
        // console.log(userData.response_data.data.loan_details.loanstatus, 'fghhjnj');
        setButtonStatus(userData.response_data.data.loan_details.loanstatus)

    }

    const fetchStatement = async () => {
        try {
            const response = await HTTPRequest.selfie({ doctype: "bank_statement" });
            if (response.status === 200) {
                const details = response.data.data;
                console.log(details)
                if (details.length > 0) {
                    setReceivedFiles(details)
                }
            } else {
                // Alert.alert('Error', 'Failed to fetch selfie.');
            }
        } catch (error) {
            console.error('Error fetching selfie:', error);
            // Alert.alert('Error', 'An error occurred while fetching selfie.');
        } finally {
            setIsLoading(false);
        }
    };



    // Handle document picker to add or replace files
    const handleFilePicker = async (fileIndex = null) => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf],
                allowMultiSelection: false,
            });

            const isProtected = isPdfPasswordProtected(result[0].uri);

            const fileWithProtectionStatus = {
                ...result[0],
                isPasswordProtected: isProtected,
                password: '', // Placeholder for password if protected
            };

            if (isProtected) {
                // Set the index of the file that requires password input
                setPasswordRequiredFileIndex(fileIndex !== null ? fileIndex : selectedFiles.length);
            } else {
                setPasswordRequiredFileIndex(null); // Reset if the file is not password protected
            }

            if (fileIndex !== null) {
                // Replace existing file at the specified index
                const updatedFiles = [...selectedFiles];
                updatedFiles[fileIndex] = fileWithProtectionStatus;
                setSelectedFiles(updatedFiles);
            } else {
                // Add a new file to the list
                setSelectedFiles([fileWithProtectionStatus]);
            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('User canceled the picker');
            } else {
                Alert.alert('Error', 'user pressed back.');
            }
        }
    };

    // Update password for protected files
    const handlePasswordChange = (index, password) => {
        const updatedFiles = [...selectedFiles];
        updatedFiles[index].password = password;
        setSelectedFiles(updatedFiles);
    };

    // Render file item with password input if needed
    const renderFileItem = ({ item, index }) => (
        <View style={styles.fileItem}>
            <View style={styles.dottedBox1}>
                <Ionicons name="document-text-outline" size={20} color="#419fb8" />
                <Text style={styles.fileName}>{item.name || 'Unnamed File'}</Text>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Enter password (optional)"
                    secureTextEntry
                    value={item.password}
                    onChangeText={(password) => handlePasswordChange(index, password)}
                />
                <Text style={styles.warningText}>
                    If your PDF has a password, please enter it.
                </Text>
                <TouchableOpacity
                    style={styles.changeFileButton}
                    onPress={() => handleFilePicker(index)}
                    disabled={selectedFiles.length > 0 && index === null}
                >
                    <Text style={styles.changeFileButtonText}>Change File</Text>
                </TouchableOpacity>
            </View>
        </View>
    );



    const renderFileItems = ({ item, index }) => (
        <View style={styles.fileItem}>
            <View style={styles.dottedBox}>
                <Text style={styles.fileName}>{item.bank_statement_file || 'Unnamed File'}</Text>
                <Ionicons name="checkmark-circle" size={20} color="#419fb8" />
            </View>
        </View>
    );




    const sendData = async () => {
        if (selectedFiles.length === 0) {
            Alert.alert('Error', 'No file selected.');
            return;
        }

        try {
            setIsLoading(true);
            const formData = new FormData();
            const file = selectedFiles[0];

            // Append the file to FormData
            formData.append('file', {
                uri: file.uri, // Path of the file
                name: `bank_statement_${Date.now()}.pdf`, // Unique file name
                type: file.type || 'application/pdf', // File MIME type
            });

            // Add additional fields to FormData
            formData.append('type', 'bank_statement');
            formData.append('password', file.isPasswordProtected ? file.password : '');
            formData.append('start_date', '');
            formData.append('end_date', '');

            console.log('FormData contents:', formData);

            // Send FormData
            const response = await HTTPRequest.updateSalary(formData);
            console.log('Server response:', response.data);

            if (response.status === 200 && response.data.response_status === 1) {
                ToastAndroid.show('Document Uploaded Successfully', ToastAndroid.SHORT);
                navigation.navigate('AllDocuments');
            } else {
                Alert.alert('Error', 'Failed to upload document.');
            }
        } catch (error) {
            console.log('Error uploading document:', error);

            // Handle network errors explicitly
            if (error.toString().includes('Network Error')) {
                sendData();
            } else {
                console.error('Error', 'An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };


    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#419FB8" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Head title="Bank E-Statement" />
            <View style={styles.container1}>
                <View style={styles.row}>
                    {buttonStatus == '3' || buttonStatus == '4' || buttonStatus == '5' || buttonStatus == '' || buttonStatus == '0' ? (
                        <Text style={styles.subtitle}>
                            Please share the bank statement for your main account, where most of your earnings or salary is deposited, for the last 3 months.

                        </Text>
                    ) : (
                        <Text style={styles.subtitle}>
                            All the uploaded Bank Statements will be shown below.

                        </Text>
                    )}
                </View>
                {buttonStatus == '3' || buttonStatus == '4' || buttonStatus == '5' || buttonStatus == '' || buttonStatus == '0' ? (
                    <>
                        {status.netbanking == 1 && status.otheruploadstatus == 1 ?
                            <Text style={styles.chooseText}>Choose one to continue</Text>
                            : null}
                    </>
                ) : null}
                {buttonStatus == '3' || buttonStatus == '4' || buttonStatus == '5' || buttonStatus == '' || buttonStatus == '0' ? (
                    <>
                        {/* E-Statement Option */}
                        {status.netbanking == 1 ?
                            <View style={styles.card}>
                                <Text style={styles.recommendedText}>RECOMMENDED</Text>
                                <View style={styles.optionContent}>
                                    <View style={styles.row}>
                                        <Text style={styles.optionTitle}>E-Statement</Text>
                                        <Text style={styles.optionSubtitle}>opted by 90% users</Text>
                                    </View>
                                    <Text style={styles.verificationText}>
                                        Verification will just take <Text style={styles.boldText}>30 seconds ⚡</Text>
                                    </Text>
                                    <Text style={styles.instantText}>Instant Loan approval</Text>
                                    <View style={styles.buttonContainer}>
                                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Netbanking')}>
                                            <Ionicons name="cloud-upload-outline" size={18} color="#fff" />
                                            <Text style={styles.buttonText}>E-Statement</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            : null}
                    </>
                ) : null}
                {buttonStatus == '3' || buttonStatus == '4' || buttonStatus == '5' || buttonStatus == '' || buttonStatus == '0' ? (
                    <>
                        {status.netbanking == 1 && status.otheruploadstatus == 1 ?
                            <Text style={styles.orText}>OR</Text>
                            : null}
                    </>
                ) : null}

                {buttonStatus == '3' || buttonStatus == '4' || buttonStatus == '5' || buttonStatus == '' || buttonStatus == '0' ? (
                <>
                    {status.otheruploadstatus === 1 ? (
                        <TouchableOpacity
                            style={styles.card1}
                            onPress={() => handleFilePicker()} // Allow picking file only if no file uploaded
                            disabled={selectedFiles.length > 0}
                        >
                            <View style={styles.optionContent}>
                                <Text style={styles.uploadTitle}>Upload Statement (only PDF)</Text>
                                <Text style={styles.verificationText}>
                                    Verification will take up to <Text style={styles.boldText}>24 Hours</Text>
                                </Text>
                                <View style={styles.buttonContainer}>
                                    <View style={styles.button}>
                                        <Ionicons name="cloud-upload-outline" size={18} color="#fff" />
                                        <Text style={styles.buttonText}>Upload Statement</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ) : null}
                </>
                 ) : null} 


                {/* Display Selected Files */}
                {selectedFiles.length > 0 && (
                    <View style={styles.selectedFilesContainer}>
                        <Text style={styles.selectedFilesTitle}>Selected Files:</Text>
                        <FlatList
                            data={selectedFiles}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderFileItem}
                        />
                        <Text style={styles.secureText}>100% Secure Data</Text>
                        <TouchableOpacity style={styles.uploadButton} onPress={sendData}>
                            <Text style={styles.uploadButtonText}>Upload</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {receivedFiles.length > 0 && (
                    <View style={styles.selectedFilesContainer}>
                        <Text style={styles.selectedFilesTitle}> Files:</Text>
                        <FlatList
                            data={receivedFiles}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderFileItems}
                        />
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    container1: { flex: 1, padding: 20, backgroundColor: '#F5F5F5' },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    subtitle: { fontSize: 14, color: '#777', marginBottom: 20 },
    chooseText: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#000' },
    card: { backgroundColor: '#EAF6FF', borderRadius: 10, padding: 10, marginBottom: 20, elevation: 5 },
    card1: { backgroundColor: '#fff', borderRadius: 10, padding: 10, marginBottom: 20, elevation: 5 },
    recommendedText: { fontSize: 12, color: '#fff', backgroundColor: '#4CAF50', padding: 5, borderRadius: 5, alignSelf: 'flex-start', marginBottom: 10 },
    optionContent: { paddingVertical: 10 },
    optionTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
    optionSubtitle: { paddingHorizontal: 3, borderRadius: 3, fontSize: 12, color: '#000', backgroundColor: '#aaa' },
    verificationText: { fontSize: 14, color: '#333', marginBottom: 10 },
    boldText: { fontWeight: 'bold', color: '#000' },
    instantText: { fontSize: 14, color: '#333', marginBottom: 10 },
    buttonContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
    button: { flexDirection: 'row', backgroundColor: '#419fb8', padding: 10, borderRadius: 5, alignItems: 'center' },
    buttonText: { color: '#fff', marginLeft: 5 },
    orText: { fontSize: 16, fontWeight: 'bold', color: '#000', marginVertical: 10, textAlign: 'center' },
    selectedFilesContainer: { marginTop: 10 },
    selectedFilesTitle: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 10 },
    fileItem: { padding: 10, backgroundColor: '#fff', marginBottom: 10, borderRadius: 5, elevation: 2 },
    dottedBox: { borderColor: '#000', borderWidth: 2, borderRadius: 10, padding: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
    dottedBox1: { borderColor: '#000', borderWidth: 2, borderRadius: 10, padding: 10, alignItems: 'center' },
    fileName: { fontSize: 14, color: '#000', marginVertical: 10 },
    changeFileButton: { marginTop: 10, alignItems: 'center', backgroundColor: '#eee', paddingVertical: 5, borderRadius: 5, paddingHorizontal: 10 },
    changeFileButtonText: { color: '#419fb8', fontWeight: 'bold' },
    passwordInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        borderRadius: 5,
        width: '80%',
        marginVertical: 10,
    },
    warningText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
    },
    passwordInput: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 5, width: '80%', marginVertical: 10 },
    secureText: { fontSize: 12, color: '#4CAF50', marginTop: 10, textAlign: 'center' },
    uploadButton: { backgroundColor: '#4CAF50', borderRadius: 5, paddingVertical: 10, marginTop: 20, alignItems: 'center' },
    uploadButtonText: { color: '#fff', fontSize: 16 },
});

export default BankStatementScreen;
