// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';  // Import Material Icons
// import Head from './Header';
// import { useFocusEffect } from '@react-navigation/native';
// import HTTPRequest from '../utils/HTTPRequest';
// import LottieView from 'lottie-react-native';



// const StepCard = ({ step, title, description, icon, iconType, navigateTo, enabled }) => {
//   const navigation = useNavigation();
//   //   const Icon = iconType === 'MaterialIcons' ? MaterialIcons : Ionicons; // Dynamically decide which icon set to use
//   console.log(enabled, 'jjjjjjjjjj')


//   return (
//     <TouchableOpacity style={enabled ? styles.card : styles.card1}
//       onPress={() => {
//         if (enabled) {
//           navigation.navigate(navigateTo, { status: 'Edit' });
//         } else {
//           navigation.navigate(navigateTo, { status: 'View' });
//         }
//       }}>
//       <View style={styles.stepContainer}>
//         <Text style={styles.stepText}>STEP {step}</Text>
//       </View>
//       {enabled == false ?
//         <View style={styles.stepContainer1}>
//           <LottieView
//             source={require('../assests/lottie/tick-success.json')}
//             autoPlay
//             loop
//             style={styles.icon1}
//           />
//         </View>
//         : null}

//       <MaterialIcons name={icon} size={30} color="#6E36BC" style={styles.icon1} />
//       <Text style={styles.title}>{title}</Text>
//       <Text style={styles.description}>{description}</Text>
//     </TouchableOpacity>
//   );
// };

// const RequiredDetailsScreen = () => {
//   const [showData, setShowData] = useState({});


//   useFocusEffect(
//     React.useCallback(() => {
//       fetchDetails();
//     }, [])
//   );



//   const fetchDetails = async () => {
//     try {
//       const response = await HTTPRequest.Details();
//       if (response.status === 200) {
//         console.log(response.data)
//         setShowData(response.data.response_data);
//       } else {
//         Alert.alert("Error", "Failed to fetch selfie.");
//       }
//     } catch (error) {
//       console.error("Error fetching gcgvhvh:", error);
//     }
//   };




//   return (
//     <View style={styles.container}>
//       <Head title="Details" />
//       <View style={styles.container1}>
//         <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>

//           <StepCard
//             step="1"
//             title="Personal Details"
//             description="Provide some personal details to allow us quick proceeding your loan"
//             icon="badge"
//             iconType="MaterialIcons"
//             navigateTo="Personal"
//             enabled={showData.personal}

//           />
//           <StepCard
//             step="2"
//             title="Professional Details"
//             description="Provide some professional details to allow us quick proceeding your loan"
//             icon="work"
//             iconType="MaterialIcons"
//             navigateTo="Information"
//             enabled={showData.employeement}

//           />
//           <StepCard
//             step="3"
//             title="Residential Details"
//             description="Provide some residential details to allow us quick proceeding your loan"
//             icon="home"
//             iconType="MaterialIcons"
//             navigateTo="Address"
//             enabled={showData.address}

//           />

//           <StepCard
//             step="4"
//             title="Bank Details"
//             description="Provide some bank details to allow us quick proceeding your loan"
//             icon="account-balance"
//             iconType="MaterialIcons"
//             navigateTo="Bank"
//             enabled={showData.bank}

//           />
//         </ScrollView>
//       </View>
//     </View>

//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     // padding: 20,
//   },
//   scrollViewContent: { alignItems: 'center', marginTop: 5 },
//   container1: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: 20,
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     elevation: 3,
//     padding: 20,
//     marginBottom: 15,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     position: 'relative',
//     // borderWidth:1,
//     // borderColor:'#6E36BC',
//   },
//   card1: {
//     backgroundColor: '#F4EDFF',
//     borderRadius: 10,
//     padding: 20,
//     marginBottom: 15,
//     alignItems: 'center',
//     position: 'relative',
//     borderWidth:1,
//     borderColor:'#6E36BC',
//   },
//   stepContainer: {
//     position: 'absolute',
//     left: 0,
//     top: 20,
//     alignSelf: 'flex-start',
//     backgroundColor: '#6E36BC',
//     paddingHorizontal: 15,
//     paddingVertical: 5,
//     borderTopRightRadius: 20,
//     borderBottomRightRadius: 20,
//   },
//   stepContainer1: {
//     position: 'absolute',
//     right: 10,
//     top: 20,
//   },
//   stepText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 10,
//   },
//   icon1: {
//     height: 30,
//     width: 30
//   },
//   title: {
//     fontSize: 18,
//     // fontWeight: 'bold',
//     color: '#6E36BC',
//   },
//   description: {
//     fontSize: 14,
//     textAlign: 'center',
//     color: '#555',
//     marginTop: 5,
//   },
// });

// export default RequiredDetailsScreen;


import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';  // Import Material Icons
import Head from './Header';
import { useFocusEffect } from '@react-navigation/native';
import HTTPRequest from '../utils/HTTPRequest';
import LottieView from 'lottie-react-native';

const StepCard = ({ step, title, description, icon, iconType, navigateTo, enabled }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={enabled ? styles.card : styles.card1}
      onPress={() => {
        if (enabled) {
          navigation.navigate(navigateTo, { status: 'Edit' });
        } else {
          navigation.navigate(navigateTo, { status: 'View' });
        }
      }}>
      <View style={styles.stepContainer}>
        <Text style={styles.stepText}>STEP {step}</Text>
      </View>
      {enabled == false ?
        <View style={styles.stepContainer1}>
          <LottieView
            source={require('../assests/lottie/tick-success.json')}
            autoPlay
            loop
            style={styles.icon1}
          />
        </View>
        : null}

      <MaterialIcons name={icon} size={30} color="#6E36BC" style={styles.icon1} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </TouchableOpacity>
  );
};

const RequiredDetailsScreen = () => {
  const [showData, setShowData] = useState({});
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      fetchDetails();
    }, [])
  );

  const fetchDetails = async () => {
    try {
      const response = await HTTPRequest.Details();
      if (response.status === 200) {
        setShowData(response.data.response_data);
      } else {
        Alert.alert("Error", "Failed to fetch details.");
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  // Function to handle the next step based on the sequence and true/false values
  const handleNextStep = () => {
    const steps = [
      { step: 1, enabled: showData.personal, navigateTo: 'Personal' },
      { step: 2, enabled: showData.employeement, navigateTo: 'Information' },
      { step: 3, enabled: showData.address, navigateTo: 'Address' },
      { step: 4, enabled: showData.bank, navigateTo: 'Bank' }
    ];

    for (const step of steps) {
      if (step.enabled) {
        navigation.navigate(step.navigateTo,{status:'Edit'});
        return;  // Navigate to the first true step and exit
      }
    }

    // If none of the steps are true, navigate to Home
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Head title="Details" />
      <View style={styles.container1}>
        <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
          <StepCard
            step="1"
            title="Personal Details"
            description="Provide some personal details to allow us quick proceeding your loan"
            icon="badge"
            iconType="MaterialIcons"
            navigateTo="Personal"
            enabled={showData.personal}
          />
          <StepCard
            step="2"
            title="Professional Details"
            description="Provide some professional details to allow us quick proceeding your loan"
            icon="work"
            iconType="MaterialIcons"
            navigateTo="Information"
            enabled={showData.employeement}
          />
          <StepCard
            step="3"
            title="Residential Details"
            description="Provide some residential details to allow us quick proceeding your loan"
            icon="home"
            iconType="MaterialIcons"
            navigateTo="Address"
            enabled={showData.address}
          />
          <StepCard
            step="4"
            title="Bank Details"
            description="Provide some bank details to allow us quick proceeding your loan"
            icon="account-balance"
            iconType="MaterialIcons"
            navigateTo="Bank"
            enabled={showData.bank}
          />
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNextStep}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: { alignItems: 'center', marginTop: 5 },
  container1: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    position: 'relative',
  },
  card1: {
    backgroundColor: '#F4EDFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#6E36BC',
  },
  stepContainer: {
    position: 'absolute',
    left: 0,
    top: 20,
    alignSelf: 'flex-start',
    backgroundColor: '#6E36BC',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  stepContainer1: {
    position: 'absolute',
    right: 10,
    top: 20,
  },
  stepText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
  },
  icon1: {
    height: 30,
    width: 30,
  },
  title: {
    fontSize: 18,
    color: '#6E36BC',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#6E36BC',
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 20,
    width:'70%',
    margin:'auto',
    borderRadius:25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RequiredDetailsScreen;
