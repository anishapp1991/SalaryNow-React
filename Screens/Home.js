import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Dimensions, Image, Animated, RefreshControl, Modal, ActivityIndicator } from 'react-native'; // Added Image import
import Ionicons from 'react-native-vector-icons/Ionicons';
import HTTPRequest from '../utils/HTTPRequest';
import LottieView from 'lottie-react-native'; // Lottie for animations
import EncryptedStorage from 'react-native-encrypted-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import Geolocation from 'react-native-geolocation-service';
import { useFocusEffect } from '@react-navigation/native';
const width = Dimensions.get('window').width;

const Home = ({ navigation }) => {
  const [banner, setBanner] = useState(false);
  const [bimage, setBimage] = useState([]);
  const [loan, setLoan] = useState([]);
  const [condition, setCondition] = useState(''); // State to handle the condition
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isShortStatusVisible, setShortStatusVisible] = useState(false);
  const [personalDetailsStatus, setPersonalDetailsStatus] = useState({});
  const [bankStatus, setBankStatus] = useState(''); // State to handle the condition
  const [bankMessage, setBankMessage] = useState(''); // State to handle the condition
  const [refreshing, setRefreshing] = useState(false);
  const [sactions, setSactions] = useState('');
  const [ckyc, setCkyc] = useState('');
  const [loanId, setLoanId] = useState('');
  const [loanIds, setLoanIds] = useState('');
  const [rejectDays, setRejectDays] = useState('');
  const [userDetails, setUserDetails] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [newChecked, setNewChecked] = useState(true);
  const [dashboardScreen, setDashboardScreen] = useState({});
  const [loading, setLoading] = useState(true); // Track global loading state

  // Check for deleted user status and navigate accordingly
  const checkDeletedUserStatus = useCallback(() => {
    if (userDetails?.delete_status) {
      console.log('User is deleted, navigating to DeletedUser screen');
      navigation.navigate('DeletedUser');
    }
  }, [userDetails?.delete_status, navigation]);

  // Check immediately when userDetails changes
  useEffect(() => {
    checkDeletedUserStatus();
  }, [checkDeletedUserStatus]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true); // Start loading when fetchData is invoked

      await Promise.all([
        // await  checkLocationPermission(),
        fetchMicro(),
        fetchPersonalDetails(),
        bankStatementDetails(),
        fetchDatas(),
        fetchBanner(),
        commonList(),
        stateList(),
        salaryMode(),
        employmentType(),
        // reverseGeocode(),
      ]);
      await loanDetails(); // Needs sequential execution due to `setLoan` dependency
    } catch (error) {
      console.error('Error in fetchData:', error);
    } finally {
      setLoading(false); // End loading when all data is fetched
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
    return unsubscribe;
  }, [fetchData, navigation]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().finally(() => setRefreshing(false));
  }, [fetchData]);


  useFocusEffect(
    useCallback(() => {
      // Small delay to ensure state is updated
      const timer = setTimeout(() => {
        checkDeletedUserStatus();
      }, 100);

      return () => clearTimeout(timer);
    }, [checkDeletedUserStatus])
  );


  const fetchMicro = async () => {
    try {
      const response = await HTTPRequest.getMicro();
      if (response.status === 200) {
        const val = response.data.response_data;
        if (response.data.response_status == 1) {
          // console.log('1',val);
          if (val == true) {
            setModalVisible(true);
          }
        }
      } else {
        console.log('error1');
      }
    } catch {
      console.log('error')
    }
  };

  // Don't render anything if user is deleted to prevent flashing
  if (userDetails?.delete_status) {
    return null;
  }

  const fetchDatas = async () => {
    try {
      const response = await HTTPRequest.personalDetails();
      if (response.status === 200) {
        const details = response.data.response_data;
        console.log(details,'detailssssss');
        setUserDetails(details);
        // console.log(details, 'details')
      } else {
        Alert.alert('Error', 'Failed to fetch personal details.');
      }
    } catch (error) {
      console.error('Error fetching personal details:', error);
      // Alert.alert('Error', 'An error occurred while fetching personal details.');
    }
  };
  
  const bankStatementDetails = async () => {
    try {
      const response = await HTTPRequest.bankStatements();
      if (response.status === 200) {
        const details = response.data.data;
        // console.log(details,'details')
        setBankStatus(details.uploadstatus);
        setBankMessage(details.showmessage)
        // setPersonalDetailsStatus(details);
      } else {
        Alert.alert('Error', 'Failed to fetch personal details.');
      }
    } catch (error) {
      console.error('Error fetching details:', error);
      // Alert.alert('Error', 'An error occurred while fetching  details.');
    }
  };


  const handleAgree = async () => {
    try {
      const res = await HTTPRequest.updateMicroStatus({ micro_status: newChecked });
      if (res.status === 200) {
        const val = res.data;
        setModalVisible(false)
      }
    } catch {
      console.error("Error updating micro status:", error);
    }
  };



  const fetchPersonalDetails = async () => {
    try {
      const response = await HTTPRequest.personal();
      if (response.status === 200) {
        const details = response.data.response_data;
        console.log(details, 'nnnnnn')
        setPersonalDetailsStatus(details);
      } else {
        Alert.alert('Error', 'Failed to fetch personal details.');
      }
    } catch (error) {
      console.error('Error fetching personal details:', error);
      // Alert.alert('Error', 'An error occurred while fetching personal details.');
    }
  };

  // Loan Details API call
  const loanDetails = async () => {
    try {

      const response = await HTTPRequest.fetchLoanDetails();
      if (response.status === 200) {
        console.log('Loan Details:', response.data.response_data.data);
        var ds = response.data;
        var loans = ds.response_data.data.home_page;
        //  console.log( ds.response_data.data,'loans')
        setRejectDays(ds.response_data.data.reject_days)
        setLoan(loans);
        setCondition(response.data.response_data.data.loan_details.loanstatus);
        setSactions(ds.response_data.data.sanction_status);
        setCkyc(ds.response_data.data.ckyc_status)
        setDashboardScreen(response.data.response_data.data.agreementsanction)
        setLoanId(ds.response_data.data.loan_details.apply_loan_data_id);
        setLoanIds(response.data.response_data.data.loan_details.application_no)
        const randomValue1 = { dashboardloan: ds };
        await EncryptedStorage.setItem('dashboardloan', JSON.stringify(randomValue1));
      } else {
        Alert.alert('Error', 'Failed to fetch loan details.');
      }
    } catch (error) {
      console.error('Error fetching loan details:', error);
      // Alert.alert('Error', 'An error occurred while fetching loan details.');
    }
  };

  // Fetch Banner API call
  const fetchBanner = async () => {
    try {
      const response = await HTTPRequest.fetchBanner();
      if (response.status === 200) {
        const dd = response.data.response_data;
        setBanner(dd.banner_status);
        setBimage(dd.banners);
      } else {
        Alert.alert('Error', 'Failed to fetch banners.');
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
      Alert.alert('Error', 'An error occurred while fetching banners.');
    }
  };

  const commonList = async () => {
    try {
      const response = await HTTPRequest.common();
      if (response.status === 200) {
        // console.log('Loan Details:', response.data);
        var ds = response.data.response_data;
        const randomValue1 = { commonList: ds };
        await EncryptedStorage.setItem('commonList', JSON.stringify(randomValue1));
      } else {
        Alert.alert('Error', 'Failed to fetch loan details.');
      }
    } catch (error) {
      console.error('Error fetching loan details:', error);
      // Alert.alert('Error', 'An error occurred while fetching loan details.');
    }
  };
  const stateList = async () => {
    try {
      const response = await HTTPRequest.allState();
      if (response.status === 200) {
        // console.log('Loan Details:', response.data);
        var ds = response.data.response_data;
        const randomValue1 = { stateList: ds };
        await EncryptedStorage.setItem('stateList', JSON.stringify(randomValue1));
      } else {
        Alert.alert('Error', 'Failed to fetch loan details.');
      }
    } catch (error) {
      console.error('Error fetching loan details:', error);
      // Alert.alert('Error', 'An error occurred while fetching loan details.');
    }
  };
  const salaryMode = async () => {
    try {
      const response = await HTTPRequest.allSalaryMode();
      if (response.status === 200) {
        // console.log('Loan Details:', response.data);
        var ds = response.data.response_data;
        const randomValue1 = { salaryMode: ds };
        await EncryptedStorage.setItem('salaryMode', JSON.stringify(randomValue1));
      } else {
        Alert.alert('Error', 'Failed to fetch loan details.');
      }
    } catch (error) {
      console.error('Error fetching loan details:', error);
      // Alert.alert('Error', 'An error occurred while fetching loan details.');
    }
  };
  const employmentType = async () => {
    try {
      const response = await HTTPRequest.allEmplomentType();
      if (response.status === 200) {
        //  console.log('Loan Details:', response.data);
        var ds = response.data.response_data;
        const randomValue1 = { employmentType: ds };
        await EncryptedStorage.setItem('employmentType', JSON.stringify(randomValue1));
      } else {
        Alert.alert('Error', 'Failed to fetch loan details.');
      }
    } catch (error) {
      console.error('Error fetching loan details:', error);
      // Alert.alert('Error', 'An error occurred while fetching loan details.');
    }
  };

  const toggleShortStatus = () => {
    setShortStatusVisible(!isShortStatusVisible);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#419FB8" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Function to render content based on the condition
  const renderCardContent = () => {
    //  console.log( parseInt(condition),'condiiii')
    switch (parseInt(condition)) {
      case 0:
        return (
          <View style={styles.cardContainer}>
            {/* Loan Details */}
            <View style={styles.detailsContainer}>
              {loan.map((item, index) => (
                // Render rows, conditionally hiding the "Loan Short Status" key
                <View style={styles.detailRow} key={index}>
                  {item.key !== "Loan Short Status" ? (
                    <>
                      <Text style={styles.label}>{item.key}</Text>
                      <Text style={item.key === "Loan Status" ? styles.value1 : styles.value}>
                        {item.val}
                      </Text>
                    </>
                  ) : (
                    isShortStatusVisible && (
                      <Text style={styles.shortStatusValue}>{item.val}</Text>
                    )
                  )}

                  {/* Icon for toggling Loan Short Status */}
                  {item.key === "Loan Status" && (
                    <TouchableOpacity onPress={toggleShortStatus}>
                      <Ionicons name="information-circle-outline" size={25} color="#888" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>

            {personalDetailsStatus.pancard ?
              <>
                {personalDetailsStatus.pancard_fileverify ?
                  <TouchableOpacity style={styles.verifyContainer} onPress={() => navigation.navigate('Pancard', { status: 'Edit' })}>
                    <Text style={styles.verifyText}>* Please Upload Your Pan Card</Text>

                    <Ionicons name="chevron-forward-outline" size={20} color="#C70404" />
                  </TouchableOpacity>
                  :
                  null}
              </>
              : null}
            {personalDetailsStatus.bankstatement ?
              <>
                {personalDetailsStatus.bank_verify ?
                  <TouchableOpacity style={styles.verifyContainer} onPress={() => navigation.navigate('EstatementWeb', { status: 'Edit' })}>
                    <Text style={styles.verifyText}>* Please Upload Your Bank Statement</Text>

                    <Ionicons name="chevron-forward-outline" size={20} color="#C70404" />
                  </TouchableOpacity>
                  :
                  null}
              </>
              : null

            }


            {personalDetailsStatus.govt_aadhar ?
              <TouchableOpacity style={styles.verifyContainer} onPress={() => navigation.navigate('AddAdhar', { page: 'DASHBOARD' })}>
                <Text style={styles.verifyText}>* Please Verify Your Aadhaar</Text>

                <Ionicons name="chevron-forward-outline" size={20} color="#C70404" />
              </TouchableOpacity>
              :
              null}

            {personalDetailsStatus.salaryslip ?
              <>
                {personalDetailsStatus.salary_verify_file ?
                  <TouchableOpacity style={styles.verifyContainer} onPress={() => navigation.navigate('SalarySlip', { status: 'Edit' })}>
                    <Text style={styles.verifyText}>* Please Upload Your Salary Slip</Text>

                    <Ionicons name="chevron-forward-outline" size={20} color="#C70404" />
                  </TouchableOpacity>
                  :
                  null}
              </>
              : null}


            {personalDetailsStatus.residential ?
              <TouchableOpacity style={styles.verifyContainer} onPress={() => navigation.navigate('Address', { status: 'Edit' })}>
                <Text style={styles.verifyText}>* Please enter your Address</Text>

                <Ionicons name="chevron-forward-outline" size={20} color="#C70404" />
              </TouchableOpacity>
              :
              null}

            {bankStatus == true ?
              <TouchableOpacity style={styles.verifyContainer} onPress={() => navigation.navigate('Estatement')}>
                <Text style={styles.verifyText}>* {bankMessage}</Text>
                <Ionicons name="chevron-forward-outline" size={20} color="#C70404" />
              </TouchableOpacity>
              :
              null}


          </View>
        );
      case 1:
        return (
          <View style={styles.cardContainer}>
            {/* Loan Details */}
            <View style={styles.detailsContainer}>
              {loan.map((item, index) => (
                // Render rows, conditionally hiding the "Loan Short Status" key
                <View style={styles.detailRow} key={index}>
                  {item.key !== "Loan Short Status" ? (
                    <>
                      <Text style={styles.label}>{item.key}</Text>
                      <Text style={item.key === "Loan Status" ? styles.value2 : styles.value}>
                        {item.val}
                      </Text>
                    </>
                  ) : (
                    isShortStatusVisible && (
                      <Text style={styles.shortStatusValue}>{item.val}</Text>
                    )
                  )}

                </View>
              ))}
            </View>
            {sactions == 0 ?
              <TouchableOpacity style={styles.verifyContainer1} onPress={() => navigation.navigate(dashboardScreen.pagename, { sact: loanId, loanA: loanIds })}>
                <Text style={styles.verifyText1}>{dashboardScreen.dashboardbtn}</Text>
              </TouchableOpacity>
              : null}
          </View>
        );
      case 2:
        return (
          <View style={styles.cardContainer}>
            {/* Loan Details */}
            <View style={styles.detailsContainer}>
              {loan.map((item, index) => (
                // Render rows, conditionally hiding the "Loan Short Status" key
                <View style={styles.detailRow} key={index}>
                  {item.key !== "Loan Short Status" ? (
                    <>
                      <Text style={styles.label}>{item.key}</Text>
                      <Text style={item.key === "Loan Status" ? styles.value2 : styles.value}>
                        {item.val}
                      </Text>
                    </>
                  ) : (
                    isShortStatusVisible && (
                      <Text style={styles.shortStatusValue}>{item.val}</Text>
                    )
                  )}

                  {/* Icon for toggling Loan Short Status */}
                  {/* {item.key === "Loan Status" && (
                    <TouchableOpacity onPress={toggleShortStatus}>
                      <Ionicons name="information-circle-outline" size={25} color="#888" />
                    </TouchableOpacity>
                  )} */}
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.verifyContainer1} onPress={() => navigation.navigate('Repayment')}>
              <Text style={styles.verifyText1}>Loan Details</Text>
            </TouchableOpacity>
          </View>
        );
      case 3:
        return (
          <View style={styles.cardContainer}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Products')}
            >
              <Ionicons name="cash-outline" size={30} color="#000" />
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>New Loan</Text>
                <View style={styles.buttonContainer}>
                  <Text style={styles.cardButton}>Apply</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Products')}
            >
              <Ionicons name="calculator-outline" size={30} color="#000" />
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Calculator</Text>
                <View style={styles.buttonContainer}>
                  <Text style={styles.cardButton}>View</Text>
                </View>
              </View>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Profile')}
            >
              <Ionicons name="person-outline" size={30} color="#000" />
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Profile</Text>
                <View style={styles.buttonContainer}>
                  <Text style={styles.cardButton}>View</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        );
      // Add more cases for conditions 4–7
      case 4:
        return (
          <>
            {rejectDays > 0 ? (
              navigation.navigate('Reject') // Navigation happens here
            ) : (
              <View style={styles.cardContainer}>
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => navigation.navigate('Products')}
                >
                  <Ionicons name="cash-outline" size={30} color="#000" />
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>New Loan</Text>
                    <View style={styles.buttonContainer}>
                      <Text style={styles.cardButton}>Apply</Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* <TouchableOpacity
                  style={styles.card}
                  onPress={() => navigation.navigate('Products')}
                >
                  <Ionicons name="calculator-outline" size={30} color="#000" />
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>Calculator</Text>
                    <View style={styles.buttonContainer}>
                      <Text style={styles.cardButton}>View</Text>
                    </View>
                  </View>
                </TouchableOpacity> */}

                <TouchableOpacity
                  style={styles.card}
                  onPress={() => navigation.navigate('Profile')}
                >
                  <Ionicons name="person-outline" size={30} color="#000" />
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>Profile</Text>
                    <View style={styles.buttonContainer}>
                      <Text style={styles.cardButton}>View</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </>
        );
      case 5:
        return (
          <View style={styles.cardContainer}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Products')}
            >
              <Ionicons name="cash-outline" size={30} color="#000" />
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>New Loan</Text>
                <View style={styles.buttonContainer}>
                  <Text style={styles.cardButton}>Apply</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Products')}
            >
              <Ionicons name="calculator-outline" size={30} color="#000" />
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Calculator</Text>
                <View style={styles.buttonContainer}>
                  <Text style={styles.cardButton}>View</Text>
                </View>
              </View>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Profile')}
            >
              <Ionicons name="person-outline" size={30} color="#000" />
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Profile</Text>
                <View style={styles.buttonContainer}>
                  <Text style={styles.cardButton}>View</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        );
      case 6:
        return (
          <View style={styles.cardContainer}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Products')}
            >
              <Ionicons name="cash-outline" size={30} color="#000" />
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>New Loan</Text>
                <View style={styles.buttonContainer}>
                  <Text style={styles.cardButton}>Apply</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Products')}
            >
              <Ionicons name="calculator-outline" size={30} color="#000" />
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Calculator</Text>
                <View style={styles.buttonContainer}>
                  <Text style={styles.cardButton}>View</Text>
                </View>
              </View>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Profile')}
            >
              <Ionicons name="person-outline" size={30} color="#000" />
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Profile</Text>
                <View style={styles.buttonContainer}>
                  <Text style={styles.cardButton}>View</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        );
      case 7:
        return (
          <View style={styles.cardContainer}>
            {/* Loan Details */}
            <View style={styles.detailsContainer}>
              {loan.map((item, index) => (
                // Render rows, conditionally hiding the "Loan Short Status" key
                <View style={styles.detailRow} key={index}>
                  {item.key !== "Loan Short Status" ? (
                    <>
                      <Text style={styles.label}>{item.key}</Text>
                      <Text style={item.key === "Loan Status" ? styles.value3 : styles.value}>
                        {item.val}
                      </Text>
                    </>
                  ) : (
                    isShortStatusVisible && (
                      <Text style={styles.shortStatusValue}>{item.val}</Text>
                    )
                  )}

                  {/* Icon for toggling Loan Short Status */}
                  {/* {item.key === "Loan Status" && (
                    <TouchableOpacity onPress={toggleShortStatus}>
                      <Ionicons name="information-circle-outline" size={25} color="#888" />
                    </TouchableOpacity>
                  )} */}
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.verifyContainer1} onPress={() => navigation.navigate('Repayment')}>
              <Text style={styles.verifyText1}>Loan Details</Text>
            </TouchableOpacity>
          </View>
        );
      case 8:
        return (
          <View style={styles.cardContainer}>
            {/* Loan Details */}
            <View style={styles.detailsContainer}>
              {loan.map((item, index) => (
                // Render rows, conditionally hiding the "Loan Short Status" key
                <View style={styles.detailRow} key={index}>
                  {item.key !== "Loan Short Status" ? (
                    <>
                      <Text style={styles.label}>{item.key}</Text>
                      <Text style={item.key === "Loan Status" ? styles.value3 : styles.value}>
                        {item.val}
                      </Text>
                    </>
                  ) : (
                    isShortStatusVisible && (
                      <Text style={styles.shortStatusValue}>{item.val}</Text>
                    )
                  )}

                  {/* Icon for toggling Loan Short Status */}
                  {/* {item.key === "Loan Status" && (
                    <TouchableOpacity onPress={toggleShortStatus}>
                      <Ionicons name="information-circle-outline" size={25} color="#888" />
                    </TouchableOpacity>
                  )} */}
                </View>
              ))}
            </View>
          </View>
        );
      default:
        return (
          <View style={styles.cardContainer}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Products')}
            >
              <Ionicons name="cash-outline" size={30} color="#000" />
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>New Loan</Text>
                <View style={styles.buttonContainer}>
                  <Text style={styles.cardButton}>Apply</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Products')}
            >
              <Ionicons name="calculator-outline" size={30} color="#000" />
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Calculator</Text>
                <View style={styles.buttonContainer}>
                  <Text style={styles.cardButton}>View</Text>
                </View>
              </View>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Profile')}
            >
              <Ionicons name="person-outline" size={30} color="#000" />
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Profile</Text>
                <View style={styles.buttonContainer}>
                  <Text style={styles.cardButton}>View</Text>
                </View>
              </View>
            </TouchableOpacity>
            {personalDetailsStatus.govt_aadhar ?
              <TouchableOpacity style={styles.verifyContainer} onPress={() => navigation.navigate('AddAdhar', { page: 'DASHBOARD' })}>
                <Text style={styles.verifyText}>* Please Verify Your Aadhaar</Text>

                <Ionicons name="chevron-forward-outline" size={20} color="#C70404" />
              </TouchableOpacity>
              :
              null}
          </View>
        );
    }
  };

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setActiveIndex(index);
  };

  return (
    <ScrollView style={styles.container} refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu-outline" size={30} style={styles.menuIcon} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.welcomeText}>Welcome!</Text>
          <Text style={styles.userName}>{userDetails.fullname}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
          <Ionicons name="notifications-outline" size={25} style={styles.notificationIcon} />
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.design} onPress={() => setNewChecked(!newChecked)}>
              <CheckBox
                value={newChecked}
                onValueChange={setNewChecked}
                style={styles.checkbox}
              />
              <Text style={styles.checkboxLabel}>
                I confirm my family (me, spouse and unmarried children) annual income is more than Rs 300000/-.
              </Text>
            </TouchableOpacity>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.agreeButton1} onPress={handleAgree}>
                <Text style={styles.modalButtonText}>I Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {banner ?
        <View style={styles.sliderContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false, listener: handleScroll }
            )}
            scrollEventThrottle={16}
          >
            {bimage.map((image, index) => (
              <View style={styles.imageWrapper} key={index}>
                <Image source={{ uri: image }} style={styles.image} />
              </View>
            ))}
          </ScrollView>

          <View style={styles.paginationContainer}>
            {bimage.map((_, index) => (
              <View
                key={index}
                style={[styles.paginationDot, { opacity: activeIndex === index ? 1 : 0.3 }]}
              />
            ))}
          </View>
        </View>
        : null}
      {renderCardContent()}

      {/* Footer Section */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.chatContainer} onPress={() => navigation.navigate('Contact Us')}>

          <Text style={styles.chatText}>Hello!</Text>
          <Image source={require('../assests/support-icon.png')} style={styles.chatIcon} />
          {/* <LottieView
                        source={require('../assests/lottie/customer.json')}
                        autoPlay
                        loop
                        style={styles.chatIcon}
                    /> */}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  shortStatusContainer: {
    marginTop: 10,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
  },
  shortStatusValue: {
    color: '#333',
    flex: 3,
    textAlign: 'center',
    fontSize: 14,
    backgroundColor: '#dfdfdf',
    padding: 10,
    borderRadius: 10,
  },
  agreeButton1: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    backgroundColor: '#419fb8',
    borderRadius: 20,
    marginRight: 10,
  },
  shortStatusText: {
    color: '#555',
    fontSize: 14,
  },
  statusContainer: {
    backgroundColor: '#F4A500',
    // padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    // marginBottom: 20,
    marginLeft: 10,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#ddd',
    marginTop: 10,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  detailsContainer: {
    backgroundColor: '#F8F8F8',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,

  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  value: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value1: {
    width: '50%', // Set width to control line break, adjust as needed
    fontSize: 12,
    textAlign: 'center',
    color: '#000',
    backgroundColor: '#F4A500',
    padding: 5,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  value2: {
    width: '50%', // Set width to control line break, adjust as needed
    fontSize: 12,
    textAlign: 'center',
    color: '#000',
    backgroundColor: '#75d96c',
    padding: 5,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  value3: {
    width: '50%', // Set width to control line break, adjust as needed
    fontSize: 12,
    textAlign: 'center',
    color: '#000',
    backgroundColor: '#00BFFF',
    padding: 5,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  verifyContainer: {
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 15,
    marginTop: 10,
  },
  verifyContainer1: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#419fb8',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center', // <-- centers the button horizontally
  },
  verifyText: {
    color: '#C70404',
    fontWeight: 'bold',
  },
  verifyText1: {
    color: '#fff',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#419FB8',
  },
  menuIcon: {
    color: '#fff',
  },
  headerText: {
    flex: 1,
    marginLeft: 10,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 16,

  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationIcon: {
    color: '#fff',
  },
  sliderContainer: {
    height: 250, // Adjust height as needed
    // marginTop: 10,
  },
  imageWrapper: {
    width: width * 0.9, // 90% of the screen width for the image wrapper
    alignItems: 'center',
    marginHorizontal: 5, // Space on left and right of the image
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'contain', // Use 'contain' to prevent cutting
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  paginationDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#000',
    margin: 5,
  },
  cardContainer: {
    marginVertical: 10,
    paddingHorizontal: 5,

  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  buttonContainer: {
    backgroundColor: '#419fb8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-end',
  },
  cardButton: {
    fontSize: 14,
    color: '#fff',
    // fontWeight: 'bold',
  },
  bottomImageContainer: {
    alignItems: 'flex-end',
    marginTop: 40,
    marginEnd: 20,
  },
  bottomImageText: {
    fontSize: 18,
    marginTop: 10,
    color: '#0099ff',
  },
  bottomContainer: {
    alignItems: 'flex-end',
    // paddingVertical: 5,
    // marginTop: 5,
    // marginLeft:10,
    paddingHorizontal: 10
  },
  chatText: {
    fontSize: 16,
    color: '#333',
    // fontWeight:'bold'
    fontStyle: 'italic',
  },
  chatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 5,
  },
  chatIcon: {
    width: 50,
    height: 60,
    // marginLeft: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'flex-start',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    // textAlign: 'center',
  },
  design: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    // alignContent:'flex-start'
    marginLeft: -5,
    // backgroundColor:'#000'
  },
  modalButtonContainer: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    // borderRadius:15,

  },

  modalButtonText: {
    color: '#fff'
  },
});


export default Home;
