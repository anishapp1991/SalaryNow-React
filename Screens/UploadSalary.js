import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Head from './Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HTTPRequest from '../utils/HTTPRequest';
import { RNS3 } from 'react-native-aws3';


const SalarySlip = ({ navigation, route }) => {
  const [months, setMonths] = useState(route?.params?.month || '');
  const [isLoading, setIsLoading] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [keyId, setKeyId] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [path, setPath] = useState('');
  const [region, setRegion] = useState('');
  const [bucket, setBucket] = useState('');
  const [key, setKey] = useState('');

  useEffect(() => {
    const s3Credential = async () => {
      try {
        setIsLoading(true)
        const response = await HTTPRequest.getCredential({ page: "salary_slip" });
        if (response.status === 200) {
          const power = response.data.data;
          setKeyId(power.IAM_KEY);
          setAccessKey(power.IAM_SECRET);
          setBucket(power.bucket);
          setPath(power.path);
          setRegion(power.region);
          // console.log("AWS credentials fetched:", power);
        } else {
          Alert.alert("Error", "Failed to fetch AWS credentials.");
        }
      } catch (error) {
        console.error("Error fetching AWS credentials:", error);
        Alert.alert("Error", "An error occurred while fetching AWS credentials.");
      } finally {
        setIsLoading(false);
      }
    };

    s3Credential();
  }, []);
  // Open the document picker to choose an image or PDF
  const openImagePicker = async () => {
    try {
      setIsLoading(true);
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images], // Allow PDFs and images
      });

      // Ensure file is valid before proceeding
      if (!res || res.length === 0) {
        throw new Error("No file selected.");
      }

      setFilePreview(res[0].uri);
      setFileType(res[0].type);

      // Call upload only after setting state
      // console.log("File selected:", res[0]);
      // set
      // uploadToS3(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log("User cancelled the picker.");
      } else {
        console.error("Error selecting document:", err);
        Alert.alert('Warning', 'You pressed back while picking the image.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Render preview based on file type
  const renderFilePreview = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#0288D1" />;
    }

    if (filePreview && fileType) {
      if (fileType.includes('image')) {
        return <Image source={{ uri: filePreview }} style={styles.imagePreview} />;
      } else if (fileType.includes('pdf')) {
        return (
          <View style={styles.pdfPreviewContainer}>
            <Ionicons name="document-outline" size={50} color="#555" />
            <Text style={styles.pdfText}>PDF Selected</Text>
          </View>
        );
      }
    }

    return (
      <View style={styles.noFileSelectedContainer}>
        <Image
          style={styles.chatIcon}
          source={require('../assests/doc-placeholder.png')}
        />
        <Text style={styles.noLoanText}>Select Document</Text>
      </View>
    );
  };


  const handleSubmit = async () => {
    if (!filePreview) {
      Alert.alert('Error', 'Please select a file before submitting.');
      return;
    }


    const types = fileType.split('/');
    const fileExtension = types[1]; // Default to 'txt' if no extension is provided

    const formData = new FormData();

    // Append the file to FormData
    formData.append('file', {
      uri: filePreview, // Path of the file
      name: `salary_slip_${Date.now()}.${fileExtension}`, // A unique name for the file
      type: fileType || 'application/octet-stream', // File MIME type
    });

    // Add additional fields to FormData
    formData.append('type', 'salary_slip');
    formData.append('month', months);

    try {
      setIsLoading(true);
      const response = await HTTPRequest.updateSalary(formData);
      console.log('Response:', response.data);
      if (response.status === 200 && response.data.response_status === 1) {
        console.log('Response:', response.data);
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to upload the salary slip.');
      }
    } catch (error) {
      console.log('Error uploading document:', error);

      // Handle network errors explicitly
      if (error.toString().includes('Network Error')) {
        handleSubmit();
      } else {
        console.error('Error', 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <Head title="Upload Salary Slip" />
      <View style={styles.noLoanContainer}>
        <Text style={styles.headerText}>
          {'Please Provide the following Information'}
        </Text>
        <Text style={styles.headerText1}>Upload {months}</Text>

        <TouchableOpacity style={styles.dottedBox} onPress={openImagePicker}>
          {renderFilePreview()}
        </TouchableOpacity>

        {/* Submit Button */}
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
    backgroundColor: '#f4f4f4',
  },
  noLoanContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerText1: {
    fontWeight: 'bold',
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 25,
    color: '#777',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 15,
    fontStyle: 'italic',
    marginTop: 25,
    textAlign: 'center',
    color: '#000',
  },
  dottedBox: {
    borderWidth: 1,
    borderStyle: 'dotted',
    borderColor: '#419fb8',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    height: 200, // Adjust height for a consistent preview area
  },
  chatIcon: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  imagePreview: {
    width: '100%', // Ensures the image takes up the full width of the container
    height: '100%', // Ensures the image takes up the full height of the container
    resizeMode: 'contain', // Keeps the aspect ratio of the image
  },
  noLoanText: {
    color: '#777',
    fontSize: 16,
    textAlign: 'center',
  },
  noFileSelectedContainer: {
    alignItems: 'center',
  },
  pdfPreviewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  pdfText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  // Styles for the submit button
  submitButton: {
    // backgroundColor: '#419fb8',
    // paddingVertical: 15,
    // paddingHorizontal: 30,
    // borderRadius: 10,
    // marginTop: 20,
    // width: '60%',
    // alignItems: 'center',
    // justifyContent: 'center',
    width: '80%',
    padding: 15,
    backgroundColor: '#419fb8',
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SalarySlip;
