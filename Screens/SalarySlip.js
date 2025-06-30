// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
// import Head from './Header';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import HTTPRequest from '../utils/HTTPRequest';
// import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
// import LottieView from 'lottie-react-native';

// const SalarySlip = ({ navigation, route }) => {
//   const { status } = route.params;
//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [submittedMonths, setSubmittedMonths] = useState([]); // Track submitted months
//   const currentMonth = new Date().getMonth();
//   const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

//   // Fetch salary details whenever the screen is focused
//   useFocusEffect(
//     React.useCallback(() => {
//       fetchSalary();
//     }, [status]) // Dependency on status to call API when it changes
//   );

//   const fetchSalary = async () => {
//     try {
//       setIsLoading(true);
//       const response = await HTTPRequest.selfie({ doctype: "salary_slip" });
//       if (response.status === 200) {
//         const details = response.data.data;
//         console.log(details, 'detailsss')
//         if (details) {
//           setData(details);
//           const submitted = details.filter(item => item.status === true).map(item => item.month); // Extract months that are submitted
//           setSubmittedMonths(submitted);
//         }
//       } else {
//         Alert.alert('Error', 'Failed to fetch salary slip.');
//       }
//     } catch (error) {
//       console.error('Error fetching salary slip:', error);
//       Alert.alert('Error', 'An error occurred while fetching the salary slip.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Get the last three months excluding the current month
//   const lastThreeMonths = [
//     months[(currentMonth - 3 + 12) % 12],
//     months[(currentMonth - 2 + 12) % 12],
//     months[(currentMonth - 1 + 12) % 12],
//   ];

//   if (isLoading) {
//     // Show a loading indicator while checking version
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#419FB8" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Head title="Salary Slip" />
//       <View style={styles.noLoanContainer}>
//         <Text style={styles.headerText}>
//           {'Please Provide last two month salary slip.'}
//         </Text>

//         {lastThreeMonths.map((month, index) => {
//           // Find the month data in the data array
//           const monthData = data.find((item) => item.month === month);
//           console.log(`Month: ${month}, Data:`, monthData);  // Add this log to inspect the data

//           // If the status is 'View' or 'Edit' mode
//           return (
//             <TouchableOpacity
//               key={index}
//               style={styles.verifyContainer}
//               onPress={
//                 monthData && monthData.status === false
//                   ? () => navigation.navigate('UploadSalary', { month }) // Allow navigation if status is false
//                   : null // Disable navigation if status is true (uploaded already)
//               }
//               disabled={monthData && monthData.status === true} // Disable if status is true (uploaded already)
//             >
//               <Text style={styles.verifyText}>{month}</Text>

//               {/* Conditionally render LottieView or Ionicons based on submitted status */}
//               {monthData && monthData.status === true ? (
//                 <LottieView
//                   source={require('../assests/lottie/tick-success.json')}
//                   autoPlay
//                   loop
//                   style={styles.icon}
//                 />
//               ) : (
//                 <Ionicons
//                   name="chevron-forward-outline"
//                   size={20}
//                   color="#fff"
//                 />
//               )}
//             </TouchableOpacity>
//           );
//         })}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f4f4f4',
//   },
//   noLoanContainer: {
//     flex: 1,
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//     alignItems: 'center',
//   },
//   icon: {
//     position: 'absolute',
//     top: 10, // Adjust to align vertically
//     right: '2%', // Adjust to align horizontally
//     width: 30, // Adjust size of Lottie animation
//     height: 30,
//     zIndex: 1,
//   },
//   headerText: {
//     fontWeight: 'bold',
//     fontSize: 17,
//     fontStyle: 'italic',
//     marginTop: 25,
//     textAlign: 'center',
//   },
//   verifyContainer: {
//     backgroundColor: '#419fb8',
//     padding: 15,
//     borderRadius: 5,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '100%',
//     marginVertical: 8,
//   },
//   verifyText: {
//     color: '#fff',
//     fontSize: 16,
//   },
// });

// export default SalarySlip;


import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Head from './Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HTTPRequest from '../utils/HTTPRequest';
import { useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native';

const SalarySlip = ({ navigation, route }) => {
  const { status } = route.params;
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch salary details whenever the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchSalary();
    }, [status])
  );

  const fetchSalary = async () => {
    try {
      setIsLoading(true);
      const response = await HTTPRequest.selfie({ doctype: 'salary_slip' });
      if (response.status === 200) {
        const details = response.data.data;
        console.log(details, 'detailsss');
        if (details) {
          setData(details);
        }
      } else {
        Alert.alert('Error', 'Failed to fetch salary slip.');
      }
    } catch (error) {
      console.error('Error fetching salary slip:', error);
      Alert.alert('Error', 'An error occurred while fetching the salary slip.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#419FB8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Head title="Salary Slip" />
      <View style={styles.noLoanContainer}>
        <Text style={styles.headerText}>
          {'Please provide last two month salary slips.'}
        </Text>

        {['salaryslip1', 'salaryslip2'].map((slipKey, index) => {
          const slipLabel = slipKey === 'salaryslip1' ? 'Salary Slip 1' : 'Salary Slip 2';
          const monthData = data.find((item) => item.month === slipKey);

          return (
            <TouchableOpacity
              key={index}
              style={styles.verifyContainer}
              onPress={
                monthData && monthData.status === false
                  ? () => navigation.navigate('UploadSalary', { month: slipKey })
                  : null
              }
              disabled={monthData && monthData.status === true}
            >
              <Text style={styles.verifyText}>{slipLabel}</Text>

              {monthData && monthData.status === true ? (
                <LottieView
                  source={require('../assests/lottie/tick-success.json')}
                  autoPlay
                  loop
                  style={styles.icon}
                />
              ) : (
                <Ionicons
                  name="chevron-forward-outline"
                  size={20}
                  color="#fff"
                />
              )}
            </TouchableOpacity>
          );
        })}
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
  icon: {
    position: 'absolute',
    top: 10,
    right: '2%',
    width: 30,
    height: 30,
    zIndex: 1,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 17,
    fontStyle: 'italic',
    marginTop: 25,
    textAlign: 'center',
  },
  verifyContainer: {
    backgroundColor: '#419fb8',
    padding: 15,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginVertical: 8,
  },
  verifyText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SalarySlip;
