// import React, { useState } from "react";
// import {
//     View,
//     Text,
//     TextInput,
//     StyleSheet,
//     TouchableOpacity,
//     ScrollView,
//     KeyboardAvoidingView,
//     Modal,
//     Platform,
//     Alert,
//     ToastAndroid,
// } from "react-native";
// import RNPickerSelect from "react-native-picker-select";
// import HTTPRequest from "../utils/HTTPRequest";

// const ReferenceScreen = ({ navigation, route }) => {
//     const lastData = route?.params?.lastData;
//     const loanAmount = route?.params?.loanAmount;
//     const [modalVisible, setModalVisible] = useState(true);
//     const [expandedSection, setExpandedSection] = useState("reference1"); // Reference 1 is open by default
//     const [relationship1, setRelationship1] = useState("");
//     const [contactName1, setContactName1] = useState("");
//     const [contactNumber1, setContactNumber1] = useState("");
//     const [relationship2, setRelationship2] = useState("");
//     const [contactName2, setContactName2] = useState("");
//     const [contactNumber2, setContactNumber2] = useState("");
//     const [errors, setErrors] = useState({
//         contactNumber1: "",
//         contactNumber2: "",
//         contactName1: '',
//         contactName2: '',
//     });

//     const toggleSection = (section) => {
//         setExpandedSection((prevSection) =>
//             prevSection === section ? null : section
//         );
//     };

//     const handleCancel = () => {
//         setModalVisible(false)
//         navigation.goBack();
//     };

//     const validatePhoneNumber = (number) => {
//         // Sanitize the input to remove non-digit characters
//         const sanitizedText = number.replace(/[^0-9]/g, "");
    
//         // Check if the sanitized number is exactly 10 digits long
//         if (sanitizedText.length !== 10) {
//             ToastAndroid.show('Fill both Contact Numbers', ToastAndroid.SHORT);
//             return "Please enter a valid 10-digit phone number";
//         }
    
//         // Check if the number starts with '0'
//         if (sanitizedText.startsWith("0")) {
//             return "Phone number cannot start with 0";
//         }
    
//         return ""; // Return empty string if no error
//     };

//     const handleSave = async () => {
//         // Validate phone numbers before proceeding with saving
//         const error1 = validatePhoneNumber(contactNumber1);
//         const error2 = validatePhoneNumber(contactNumber2);
    
//         // Validate relationships
//         const relationshipError1 = relationship1 === "" ? "Relationship is required" : "";
//         const relationshipError2 = relationship2 === "" ? "Relationship is required" : "";
    
//         // Regular expression for name validation
    
//         const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

//         const contactNameError1 =
//             contactName1.trim() === ""
//                 ? "Contact Name is required"
//                 : !nameRegex.test(contactName1.trim()) // Trimmed input is validated
//                 ? "Contact Name should only contain alphabets and single spaces between words"
//                 : "";
        
//         const contactNameError2 =
//             contactName2.trim() === ""
//                 ? "Contact Name is required"
//                 : !nameRegex.test(contactName2.trim()) // Trimmed input is validated
//                 ? "Contact Name should only contain alphabets and single spaces between words"
//                 : "";
//         if (error1 || error2 || relationshipError1 || relationshipError2 || contactNameError1 || contactNameError2) {
//             setErrors({
//                 contactNumber1: error1,
//                 contactNumber2: error2,
//                 relationship1: relationshipError1,
//                 relationship2: relationshipError2,
//                 contactName1: contactNameError1,
//                 contactName2: contactNameError2,
//             });
//             return;
//         }
    
//         const requestData = {
//             relationship1: relationship1,
//             relationName1: contactName1,
//             relationMobile1: contactNumber1,
//             relationship2: relationship2,
//             relationName2: contactName2,
//             relationMobile2: contactNumber2,
//             total_count: 2,
//         };
    
//         try {
//             const Response = await HTTPRequest.updaterReference(requestData);
//             if (Response.status === 200 && Response.data.response_status === 1) {
//                 setModalVisible(false);
//                 ToastAndroid.show('Data saved successfully', ToastAndroid.SHORT);
//                 navigation.replace('LoanApply', { lastData, loanAmount });
//             } else {
//                 Alert.alert('Error', Response.data.response_msg);
//             }
//         } catch (error) {
//             console.error('Error in reverse geocode or upload:', error);
//             Alert.alert('Error', `An error occurred: ${error.message}`);
//         }
//     };

//     return (
//         <Modal
//             animationType="slide"
//             transparent={true}
//             visible={modalVisible}
//             onRequestClose={() => setModalVisible(false)}
//         >
//             <View style={styles.modalContainer}>
//                 <View style={styles.modalContent}>
//                     <KeyboardAvoidingView
//                         style={{ flex: 1 }}
//                         behavior={Platform.OS === "ios" ? "padding" : "height"}
//                     >
//                         <ScrollView
//                             contentContainerStyle={styles.scrollContainer}
//                             showsVerticalScrollIndicator={false}
//                             keyboardShouldPersistTaps="handled" // Ensure taps are not blocked
//                         >
//                             <Text style={styles.title}>Reference Details</Text>
//                             <Text style={styles.warning}>
//                                 * Provide valid reference numbers to avoid rejection
//                             </Text>

//                             {/* Reference 1 */}
//                             <TouchableOpacity
//                                 style={styles.accordionHeader}
//                                 onPress={() => toggleSection("reference1")}
//                             >
//                                 <Text style={styles.label}>Reference 1</Text>
//                             </TouchableOpacity>
//                             {expandedSection === "reference1" && (
//                                 <View style={styles.card}>
//                                     <View style={styles.pickerContainer}>
//                                         <RNPickerSelect
//                                             onValueChange={(itemValue) => setRelationship1(itemValue)}
//                                             items={[
//                                                 { label: "PARENT", value: "Parent" },
//                                                 { label: "RELATIVE", value: "Relative" },
//                                                 { label: "FRIEND", value: "Friend" },
//                                                 { label: "SPOUSE", value: "Spouse" },
//                                                 { label: "SIBLING", value: "Sibling" },
//                                             ]}
//                                             value={relationship1}
//                                             style={pickerSelectStyles}
//                                             placeholder={{ label: "Select Relationship", value: "" }}
//                                         />

//                                     </View>
//                                     {errors.relationship1 && (
//                                         <Text style={styles.errorText}>{errors.relationship1}</Text>
//                                     )}
//                                     <TextInput
//                                         style={styles.input}
//                                         placeholder="Contact Name"
//                                         value={contactName1}
//                                         onChangeText={(text) => setContactName1(text)}
//                                     />
//                                     {errors.contactName1 && (
//                                         <Text style={styles.errorText}>{errors.contactName1}</Text>
//                                     )}
//                                     <TextInput
//                                         style={styles.input}
//                                         placeholder="Contact Number"
//                                         value={contactNumber1}
//                                         keyboardType="phone-pad"
//                                         maxLength={10}
//                                         onChangeText={(text) => {
//                                             const sanitizedText = text.replace(/[^0-9]/g, "");
//                                             setContactNumber1(sanitizedText);
//                                         }}
//                                     />
//                                     {errors.contactNumber1 && (
//                                         <Text style={styles.errorText}>{errors.contactNumber1}</Text>
//                                     )}
//                                 </View>
//                             )}

//                             {/* Reference 2 */}
//                             <TouchableOpacity
//                                 style={styles.accordionHeader}
//                                 onPress={() => toggleSection("reference2")}
//                             >
//                                 <Text style={styles.label}>Reference 2</Text>
//                             </TouchableOpacity>
//                             {expandedSection === "reference2" && (
//                                 <View style={styles.card}>
//                                     <View style={styles.pickerContainer}>
//                                         <RNPickerSelect
//                                             onValueChange={(itemValue) => setRelationship2(itemValue)}
//                                             items={[
//                                                 { label: "PARENT", value: "Parent" },
//                                                 { label: "RELATIVE", value: "Relative" },
//                                                 { label: "FRIEND", value: "Friend" },
//                                                 { label: "SPOUSE", value: "Spouse" },
//                                                 { label: "SIBLING", value: "Sibling" },
//                                             ]}
//                                             value={relationship2}
//                                             style={pickerSelectStyles}
//                                             placeholder={{ label: "Select Relationship", value: "" }}
//                                         />
//                                     </View>
//                                     {errors.relationship2 && (
//                                         <Text style={styles.errorText}>{errors.relationship2}</Text>
//                                     )}
//                                     <TextInput
//                                         style={styles.input}
//                                         placeholder="Contact Name"
//                                         value={contactName2}
//                                         onChangeText={(text) => setContactName2(text)}
//                                     />
//                                           {errors.contactName2 && (
//                                         <Text style={styles.errorText}>{errors.contactName2}</Text>
//                                     )}
//                                     <TextInput
//                                         style={styles.input}
//                                         placeholder="Contact Number"
//                                         value={contactNumber2}
//                                         keyboardType="phone-pad"
//                                         maxLength={10}
//                                         onChangeText={(text) => {
//                                             const sanitizedText = text.replace(/[^0-9]/g, "");
//                                             setContactNumber2(sanitizedText);
//                                         }}
//                                     />
                              
//                                     {errors.contactNumber2 && (
//                                         <Text style={styles.errorText}>{errors.contactNumber2}</Text>
//                                     )}
//                                 </View>
//                             )}

//                             <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
//                                 <Text style={styles.submitButtonText}>Submit</Text>
//                             </TouchableOpacity>

//                             <View style={styles.separatorLine} />

//                             <TouchableOpacity
//                                 style={styles.cancelButton}
//                                 onPress={handleCancel}
//                             >
//                                 <Text style={styles.cancelButtonText}>Cancel</Text>
//                             </TouchableOpacity>
//                         </ScrollView>
//                     </KeyboardAvoidingView>
//                 </View>
//             </View>
//         </Modal>
//     );
// };

// const styles = StyleSheet.create({
//     modalContainer: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: "rgba(0, 0, 0, 0.5)",
//     },
//     modalContent: {
//         width: "90%",
//         height: "68%", // 75% of the screen height
//         backgroundColor: "#f5f5f5",
//         borderRadius: 10,
//         padding: 15,
//         elevation: 5,
//     },
//     scrollContainer: {
//         flexGrow: 1,
//         paddingBottom: 20,
//     },
//     title: {
//         fontSize: 16,
//         fontWeight: "bold",
//         textAlign: "center",
//         marginBottom: 10,
//     },
//     warning: {
//         fontSize: 12,
//         color: "red",
//         textAlign: "center",
//         marginBottom: 15,
//     },
//     accordionHeader: {
//         backgroundColor: "#e8f5f7",
//         borderRadius: 8,
//         padding: 10,
//         marginBottom: 10,
//         elevation: 2,
//     },
//     card: {
//         backgroundColor: "#ffffff",
//         borderRadius: 8,
//         padding: 10,
//         marginBottom: 10,
//         borderWidth: 1,
//         borderColor: "#ccc",
//     },
//     pickerContainer: {
//         backgroundColor: "#fff",
//         borderRadius: 8,
//         borderWidth: 1,
//         borderColor: "#ccc",
//         marginBottom: 10,
//     },
//     label: {
//         fontSize: 14,
//         fontWeight: "bold",
//     },
//     input: {
//         backgroundColor: "#fff",
//         borderRadius: 8,
//         paddingHorizontal: 8,
//         paddingVertical: 6,
//         marginBottom: 10,
//         borderWidth: 1,
//         borderColor: "#ccc",
//     },
//     submitButton: {
//         padding: 10,
//         borderRadius: 8,
//         alignItems: "center",
//     },
//     submitButtonText: {
//         color: "#000",
//         fontWeight: "bold",
//         fontSize: 14,
//     },
//     cancelButton: {
//         padding: 10,
//         borderRadius: 8,
//         alignItems: "center",
//     },
//     cancelButtonText: {
//         color: "#f00",
//         fontWeight: "bold",
//         fontSize: 14,
//     },
//     separatorLine: {
//         height: 1,
//         backgroundColor: "#dfdfdf",
//         marginVertical: 8,
//     },
//     errorText: {
//         fontSize: 12,
//         color: "red",
//         marginBottom: 10,
//     },
// });

// const pickerSelectStyles = {
//     inputIOS: {
//         backgroundColor: "transparent",
//     },
//     inputAndroid: {
//         backgroundColor: "transparent",
//     },
// };

// export default ReferenceScreen;

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
//   ToastAndroid,
// } from "react-native";
// import RNPickerSelect from "react-native-picker-select";
// import HTTPRequest from "../utils/HTTPRequest";

// const ReferenceScreen = ({ navigation, route }) => {
//   const lastData = route?.params?.lastData;
//   const loanAmount = route?.params?.loanAmount;

//   const [relationship1, setRelationship1] = useState("");
//   const [contactName1, setContactName1] = useState("");
//   const [contactNumber1, setContactNumber1] = useState("");
//   const [relationship2, setRelationship2] = useState("");
//   const [contactName2, setContactName2] = useState("");
//   const [contactNumber2, setContactNumber2] = useState("");
//   const [errors, setErrors] = useState({
//     contactNumber1: "",
//     contactNumber2: "",
//     contactName1: "",
//     contactName2: "",
//   });

//   const validatePhoneNumber = (number) => {
//     const sanitizedText = number.replace(/[^0-9]/g, "");
//     if (sanitizedText.length !== 10) {
//       ToastAndroid.show("Fill both Contact Numbers", ToastAndroid.SHORT);
//       return "Please enter a valid 10-digit phone number";
//     }
//     if (sanitizedText.startsWith("0")) {
//       return "Phone number cannot start with 0";
//     }
//     return ""; // Return empty string if no error
//   };

//   const handleSave = async () => {
//     const error1 = validatePhoneNumber(contactNumber1);
//     const error2 = validatePhoneNumber(contactNumber2);

//     const relationshipError1 = relationship1 === "" ? "Relationship is required" : "";
//     const relationshipError2 = relationship2 === "" ? "Relationship is required" : "";

//     const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
//     const contactNameError1 =
//       contactName1.trim() === ""
//         ? "Contact Name is required"
//         : !nameRegex.test(contactName1.trim())
//         ? "Contact Name should only contain alphabets and single spaces between words"
//         : "";

//     const contactNameError2 =
//       contactName2.trim() === ""
//         ? "Contact Name is required"
//         : !nameRegex.test(contactName2.trim())
//         ? "Contact Name should only contain alphabets and single spaces between words"
//         : "";

//     if (
//       error1 ||
//       error2 ||
//       relationshipError1 ||
//       relationshipError2 ||
//       contactNameError1 ||
//       contactNameError2
//     ) {
//       setErrors({
//         contactNumber1: error1,
//         contactNumber2: error2,
//         relationship1: relationshipError1,
//         relationship2: relationshipError2,
//         contactName1: contactNameError1,
//         contactName2: contactNameError2,
//       });
//       return;
//     }

//     const requestData = {
//       relationship1: relationship1,
//       relationName1: contactName1,
//       relationMobile1: contactNumber1,
//       relationship2: relationship2,
//       relationName2: contactName2,
//       relationMobile2: contactNumber2,
//       total_count: 2,
//     };

//     try {
//       const Response = await HTTPRequest.updaterReference(requestData);
//       if (Response.status === 200 && Response.data.response_status === 1) {
//         ToastAndroid.show("Data saved successfully", ToastAndroid.SHORT);
//         navigation.replace("LoanApply", { lastData, loanAmount });
//       } else {
//         Alert.alert("Error", Response.data.response_msg);
//       }
//     } catch (error) {
//       console.error("Error in reverse geocode or upload:", error);
//       Alert.alert("Error", `An error occurred: ${error.message}`);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <Text style={styles.title}>Reference Details</Text>
//         <Text style={styles.warning}>
//           * Provide valid reference numbers to avoid rejection
//         </Text>

//         {/* Reference 1 */}
//         <Text style={styles.label}>Reference 1</Text>
//         <View style={styles.card}>
//           <View style={styles.pickerContainer}>
//             <RNPickerSelect
//               onValueChange={(itemValue) => setRelationship1(itemValue)}
//               items={[
//                 { label: "PARENT", value: "Parent" },
//                 { label: "RELATIVE", value: "Relative" },
//                 { label: "FRIEND", value: "Friend" },
//                 { label: "SPOUSE", value: "Spouse" },
//                 { label: "SIBLING", value: "Sibling" },
//               ]}
//               value={relationship1}
//               style={pickerSelectStyles}
//               placeholder={{ label: "Select Relationship", value: "" }}
//             />
//           </View>
//           {errors.relationship1 && (
//             <Text style={styles.errorText}>{errors.relationship1}</Text>
//           )}
//           <TextInput
//             style={styles.input}
//             placeholder="Contact Name"
//             value={contactName1}
//             onChangeText={(text) => setContactName1(text)}
//             maxLength={50}
//           />
//           {errors.contactName1 && (
//             <Text style={styles.errorText}>{errors.contactName1}</Text>
//           )}
//           <TextInput
//             style={styles.input}
//             placeholder="Contact Number"
//             value={contactNumber1}
//             keyboardType="phone-pad"
//             maxLength={10}
//             onChangeText={(text) => {
//               const sanitizedText = text.replace(/[^0-9]/g, "");
//               setContactNumber1(sanitizedText);
//             }}
//           />
//           {errors.contactNumber1 && (
//             <Text style={styles.errorText}>{errors.contactNumber1}</Text>
//           )}
//         </View>

//         {/* Reference 2 */}
//         <Text style={styles.label}>Reference 2</Text>
//         <View style={styles.card}>
//           <View style={styles.pickerContainer}>
//             <RNPickerSelect
//               onValueChange={(itemValue) => setRelationship2(itemValue)}
//               items={[
//                 { label: "PARENT", value: "Parent" },
//                 { label: "RELATIVE", value: "Relative" },
//                 { label: "FRIEND", value: "Friend" },
//                 { label: "SPOUSE", value: "Spouse" },
//                 { label: "SIBLING", value: "Sibling" },
//               ]}
//               value={relationship2}
//               style={pickerSelectStyles}
//               placeholder={{ label: "Select Relationship", value: "" }}
//             />
//           </View>
//           {errors.relationship2 && (
//             <Text style={styles.errorText}>{errors.relationship2}</Text>
//           )}
//           <TextInput
//             style={styles.input}
//             placeholder="Contact Name"
//             value={contactName2}
//             onChangeText={(text) => setContactName2(text)}
//             maxLength={50}
//           />
//           {errors.contactName2 && (
//             <Text style={styles.errorText}>{errors.contactName2}</Text>
//           )}
//           <TextInput
//             style={styles.input}
//             placeholder="Contact Number"
//             value={contactNumber2}
//             keyboardType="phone-pad"
//             maxLength={10}
//             onChangeText={(text) => {
//               const sanitizedText = text.replace(/[^0-9]/g, "");
//               setContactNumber2(sanitizedText);
//             }}
//           />
//           {errors.contactNumber2 && (
//             <Text style={styles.errorText}>{errors.contactNumber2}</Text>
//           )}
//         </View>

//         <View style={styles.buttonsContainer}>
//           <TouchableOpacity
//             style={styles.cancelButton}
//             onPress={() => navigation.goBack()}
//           >
//             <Text style={styles.cancelButtonText}>Cancel</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
//             <Text style={styles.submitButtonText}>Submit</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 15,
//     backgroundColor: "#f5f5f5",
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     paddingBottom: 20,
//   },
//   title: {
//     fontSize: 20, // Increased size for header
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 8,
//   },
//   warning: {
//     fontSize: 12, // Same size as Reference 1 text
//     color: "red",
//     textAlign: "center",
//     marginBottom: 12,
//   },
//   label: {
//     fontSize: 14, // Slightly larger label for clarity
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: "#ccc",
//   },
//   pickerContainer: {
//     backgroundColor: "transparent", // No background color for picker container
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     marginBottom: 8,
//   },
//   input: {
//     backgroundColor: "transparent", // No background color for inputs
//     borderRadius: 8,
//     paddingHorizontal: 8,
//     paddingVertical: 6,
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     fontSize: 12,
//   },
//   errorText: {
//     fontSize: 10,
//     color: "red",
//     marginBottom: 8,
//   },
//   buttonsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 20,
//   },
//   submitButton: {
//     backgroundColor: "transparent",
//     padding: 10,
//     borderRadius: 8,
//     alignItems: "center",
//     flex: 1,
//     marginLeft: 8, // Space between buttons
//     borderWidth: 1, // Fixed the typo here
//     borderColor: "#4caf50", // Set border color to a dark color
//   },
//   submitButtonText: {
//     color: "#4caf50",
//     fontWeight: "bold",
//     fontSize: 12,
//   },
//   cancelButton: {
//     padding: 10,
//     borderRadius: 8,
//     alignItems: "center",
//     flex: 1,
//     borderWidth: 1, // Fixed the typo here
//     borderColor: "#f44336", // Set border color to a dark color
//     backgroundColor: "transparent", // Ensure the background is transparent if needed
//   },
  
//   cancelButtonText: {
//     color: "#f44336",
//     fontWeight: "bold",
//     fontSize: 12,
//   },
// });

// const pickerSelectStyles = {
//   inputIOS: {
//     backgroundColor: "transparent",
//     fontSize: 12,
//   },
//   inputAndroid: {
//     backgroundColor: "transparent",
//     fontSize: 12,
//   },
// };

// export default ReferenceScreen;




import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ToastAndroid,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import HTTPRequest from "../utils/HTTPRequest";

const ReferenceScreen = ({ navigation, route }) => {
  const lastData = route?.params?.lastData;
  const loanAmount = route?.params?.loanAmount;

  const [relationship1, setRelationship1] = useState("");
  const [contactName1, setContactName1] = useState("");
  const [contactNumber1, setContactNumber1] = useState("");
  const [relationship2, setRelationship2] = useState("");
  const [contactName2, setContactName2] = useState("");
  const [contactNumber2, setContactNumber2] = useState("");
  const [activeField, setActiveField] = useState(null);

  const [errors, setErrors] = useState({
    contactNumber1: "",
    contactNumber2: "",
    contactName1: "",
    contactName2: "",
  });

  const validatePhoneNumber = (number) => {
    const sanitized = number.replace(/[^0-9]/g, "");
    if (sanitized.length === 0) return "Phone number is required";
    if (sanitized.length !== 10) return "Phone number must be exactly 10 digits";
    if (!["6", "7", "8", "9"].includes(sanitized[0]))
      return "Phone number must start with 6, 7, 8, or 9";
    return "";
  };

  const handleSave = async () => {
    const error1 = validatePhoneNumber(contactNumber1);
    const error2 = validatePhoneNumber(contactNumber2);

    const relationshipError1 = relationship1 === "" ? "Relationship is required" : "";
    const relationshipError2 = relationship2 === "" ? "Relationship is required" : "";

    const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    const contactNameError1 =
      contactName1.trim() === ""
        ? "Contact Name is required"
        : !nameRegex.test(contactName1.trim())
        ? "Contact Name should only contain alphabets and single spaces"
        : "";

    const contactNameError2 =
      contactName2.trim() === ""
        ? "Contact Name is required"
        : !nameRegex.test(contactName2.trim())
        ? "Contact Name should only contain alphabets and single spaces"
        : "";

    if (
      error1 ||
      error2 ||
      relationshipError1 ||
      relationshipError2 ||
      contactNameError1 ||
      contactNameError2
    ) {
      setErrors({
        contactNumber1: error1,
        contactNumber2: error2,
        relationship1: relationshipError1,
        relationship2: relationshipError2,
        contactName1: contactNameError1,
        contactName2: contactNameError2,
      });
      return;
    }

    const requestData = {
      relationship1,
      relationName1: contactName1,
      relationMobile1: contactNumber1,
      relationship2,
      relationName2: contactName2,
      relationMobile2: contactNumber2,
      total_count: 2,
    };
// console.log(requestData,'llll')
    try {
      const response = await HTTPRequest.updaterReference(requestData);
      if (response.status === 200 && response.data.response_status === 1) {
        ToastAndroid.show("Data saved successfully", ToastAndroid.SHORT);
        navigation.replace("LoanApply", { lastData, loanAmount });
      } else {
        Alert.alert("Error", response.data.response_msg);
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", `An error occurred: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Reference Details</Text>
        <Text style={styles.warning}>
          * Provide valid reference numbers to avoid rejection
        </Text>

        {/* Reference 1 */}
        <Text style={styles.label}>Reference 1</Text>
        <View style={styles.card}>
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              onValueChange={setRelationship1}
              items={[
                { label: "PARENT", value: "Parent" },
                { label: "RELATIVE", value: "Relative" },
                { label: "FRIEND", value: "Friend" },
                { label: "SPOUSE", value: "Spouse" },
                { label: "SIBLING", value: "Sibling" },
              ]}
              value={relationship1}
              style={pickerSelectStyles}
              placeholder={{ label: "Select Relationship", value: "" }}
            />
          </View>
          {errors.relationship1 && <Text style={styles.errorText}>{errors.relationship1}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Contact Name"
            value={contactName1}
            onChangeText={setContactName1}
            maxLength={50}
            autoComplete="off"
            autoCompleteType="off"
            textContentType="none"
            importantForAutofill="no"
            contextMenuHidden={true}
            editable={true}
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType="default"
          />
          {errors.contactName1 && <Text style={styles.errorText}>{errors.contactName1}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Contact Number"
            value={contactNumber1}
            keyboardType="phone-pad"
            maxLength={10}
            onFocus={() => setActiveField("contactNumber1")}
            onChangeText={(text) => {
              const sanitizedText = text.replace(/[^0-9]/g, "");
              setContactNumber1(sanitizedText);
            }}
            autoComplete="off"
            autoCompleteType="off"
            textContentType="none"
            importantForAutofill="no"
            contextMenuHidden={true}
            editable={true}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {errors.contactNumber1 && <Text style={styles.errorText}>{errors.contactNumber1}</Text>}
        </View>

        {/* Reference 2 */}
        <Text style={styles.label}>Reference 2</Text>
        <View style={styles.card}>
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              onValueChange={setRelationship2}
              items={[
                { label: "PARENT", value: "Parent" },
                { label: "RELATIVE", value: "Relative" },
                { label: "FRIEND", value: "Friend" },
                { label: "SPOUSE", value: "Spouse" },
                { label: "SIBLING", value: "Sibling" },
              ]}
              value={relationship2}
              style={pickerSelectStyles}
              placeholder={{ label: "Select Relationship", value: "" }}
            />
          </View>
          {errors.relationship2 && <Text style={styles.errorText}>{errors.relationship2}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Contact Name"
            value={contactName2}
            onChangeText={setContactName2}
            maxLength={50}
            autoComplete="off"
            autoCompleteType="off"
            textContentType="none"
            importantForAutofill="no"
            contextMenuHidden={true}
            editable={true}
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType="default"
          />
          {errors.contactName2 && <Text style={styles.errorText}>{errors.contactName2}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Contact Number"
            value={contactNumber2}
            keyboardType="phone-pad"
            maxLength={10}
            onFocus={() => setActiveField("contactNumber2")}
            onChangeText={(text) => {
              const sanitizedText = text.replace(/[^0-9]/g, "");
              setContactNumber2(sanitizedText);
            }}
            autoComplete="off"
            autoCompleteType="off"
            textContentType="none"
            importantForAutofill="no"
            contextMenuHidden={true}
            editable={true}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {errors.contactNumber2 && <Text style={styles.errorText}>{errors.contactNumber2}</Text>}
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  warning: {
    fontSize: 12,
    color: "red",
    textAlign: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  pickerContainer: {
    backgroundColor: "transparent",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 4,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderColor: "#ccc",
    color: "black",
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderColor: "#ccc",
    color: "black",
    paddingRight: 30,
  },
});

export default ReferenceScreen;

