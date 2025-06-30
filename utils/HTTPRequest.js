import axios from "axios";
import EncryptedStorage from 'react-native-encrypted-storage';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, BackHandler } from 'react-native';
import { closeApp } from '../Screens/AppExit';
// const liveUrl = "https://green.salarynow.in/salaryadmin/api_v21";
// const liveUrl = "https://green.salarynow.in/salaryadmin/api_v16";
// const devUrl = "https://65.0.23.14/salaryadmin/api_v12";
const liveUrl = "https://green.salarynow.in/salaryadmin/api_v21";


const apiService = axios.create({
    baseURL: liveUrl,
    // baseURL: devUrl,
});

// Function to retrieve tokens
const getTokens = async () => {
    try {
        const storedAppId = await EncryptedStorage.getItem('app_id');
        const storedId = await EncryptedStorage.getItem('token');
        const storedUserId = await EncryptedStorage.getItem('user_id');
        const appversions = await EncryptedStorage.getItem('appversion');

        // Parse the values and fallback to null if parsing fails
        const appid = storedAppId ? JSON.parse(storedAppId)?.app_id : null;
        const token = storedId ? JSON.parse(storedId)?.token : null;
        const userid = storedUserId ? JSON.parse(storedUserId)?.user_id : null;
        const appver = appversions ? JSON.parse(appversions) : null; // Directly assign parsed value
        const appversion = appver.appversion;

        return { appid, token, userid, appversion }; // Ensure you return 'appversion' instead of 'appversions'
    } catch (error) {
        console.error('Error fetching tokens:', error);
        throw new Error('Failed to retrieve tokens'); // Propagate the error
    }
};

// Add interceptor to automatically include the tokens in headers
apiService.interceptors.request.use(
    async (request) => {
        const { appid, token, userid, appversion } = await getTokens();

        if (process.env.NODE_ENV === 'development') {
            console.log("Tokens being used: ", { appid, token, userid, appversion }); // Debugging
        }

        // Adding common headers
        if (appid) request.headers['appid'] = appid;
        if (token) request.headers['token'] = token;
        if (userid) request.headers['userid'] = userid;
        if (appversion) request.headers['appversion'] = appversion; // Correct header assignment

        return request;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiService.interceptors.response.use(
    (response) => {
        // Return the response if successful
        return response;
    },
    async (error) => {
        // Check if the response is a 403 error
        if (error.response?.status === 403) {
            // Clear sensitive data and logout
            AsyncStorage.removeItem('token');

            // Optional: Display an alert or perform a navigation reset
            Alert.alert(
                "Session Expired",
                "You have been logged out due to inactivity. Please log in again.",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            // Example: Reset navigation or close app
                            closeApp();
                        },
                    },
                ],
                { cancelable: false }
            );
        }

        // Reject other errors
        return Promise.reject(error);
    }
);

// API functions
export default {
    language(formData) {
        return apiService.post('/Common/language', formData);
    },
    login(formData) {
        return apiService.post('/Auth/login', formData);
    },
    otpVerify(formData) {
        return apiService.post('/Auth/verifyotp', formData);
    },
    allPincode(formData) {
        return apiService.post('/Common/allpincode', formData);
    },
    getEmploymentTypes() {
        return apiService.get('/Common/employmenttype');
    },
    registration(formData) {
        return apiService.post('/Auth/register', formData);
    },
    fetchBanner() {
        return apiService.get('/Common/bannerSlider');
    },
    fetchLoanDetails() { // Renamed to avoid conflict
        return apiService.get('/Loan/loandetails');
    },
    // loanCharges() { // Renamed to avoid conflict
    //     return apiService.get('/Loan/loanChargesnew/');
    // },
    loanCharges() { // Renamed to avoid conflict
        return apiService.get('/Loan/loanChargesnew1/');
    },
    loanMisStatus() { // Renamed to avoid conflict
        return apiService.get('/Loan/getmisstatusnew/');
    },
    personal() {
        return apiService.get('/User/checkuserdetails/');
    },
    professionalDetails() {
        return apiService.get('/User/employmentdetails/');
    },
    residentialDetails() {
        return apiService.get('/User/Residencedetails/');
    },
    getBankDetails() {
        return apiService.get('/User/bankdetails/');
    },
    products() {
        return apiService.get('/Loan/productlist');
    },
    productDetails(formData) {
        return apiService.post('/Loan/loanCalculator/', formData);
    },
    personalDetails() {
        return apiService.get('/User/personalinfodetails/');
    },
    selfie(formData) {
        return apiService.post('/UserDocs/viewUserDocs/', formData);
    },
    common() {
        return apiService.get('/Common/usercommon/');
    },
    getPersonal(formData) {
        return apiService.get('/Profile/personal', { params: formData });
    },
    postPersonal(formData) {
        return apiService.post('/Profile/personal', formData);

    },
    allState() {
        return apiService.get('/Common/state');
    },
    allSalaryMode() {
        return apiService.get('/Common/salarymode');
    },
    allEmplomentType() {
        return apiService.get('/Common/employmenttype');
    },
    getUserData() {
        return apiService.get('/User/employmentdetails/');
    },
    prof(formData) {
        return apiService.patch('/User/updateemployement/', formData);
    },
    getBankList() {
        return apiService.get('/Common/banklist');
    },
    getBranchDetails(formData) {
        return apiService.post('/Common/ifsclist/', formData);
    },
    updateBank(formData) {
        return apiService.patch('/User/updatebank/', formData);
    },
    updateResidential(formData) {
        return apiService.patch('/User/updateresidential/', formData);
    },
    updateResidentialss(formData) {
        return apiService.patch('/User/updateresidentialdata/', formData);
    },
    updateResidentials(formData) {
        return apiService.patch('/User/updateresidentialnew/', formData);
    },
    postSelfie(formData) {
        return apiService.post('/UserDocs/uploadSelfie/', formData);
    },
    getCredential(formData) {
        return apiService.post('/UserDocs/s3Credentials', formData);
    },
    updatePersonal(formData) {
        return apiService.patch('/User/updatepersonalinfo/', formData);
    },
    updatePancard(formData) {
        return apiService.post('/UserDocs/UploadUserDocs/', formData);
    },
    bankStatement() {
        return apiService.get('/User/userconcent/');
    },
    VerifyOTP() {
        return apiService.get('/User/userconcentUrl/');
    },
    Location(formData) {
        return apiService.post('/Permission/locationTracker/', formData);
    },
    ApplyLoan(formData) {
        return apiService.post('/Loan/applyLoannewv5/', formData);
    },
    bankStatements() {
        return apiService.get('/UserDocs/dashboardbanstatementdate');
    },
    PreviousLoan() {
        return apiService.get('/Loan/previousLoannew/');
    },
    notInte() {
        return apiService.get('/Common/notInterestedReason/');
    },
    notInteSub(formData) {
        return apiService.post('/Loan/notIntrested/', formData);
    },
    LoanOtp() {
        return apiService.get('/Loan/loanagreementdata/');
    },
    sendOtp() {
        return apiService.get('/Loan/agreementOTP');
    },
    otpLoanVerify(formData) {
        return apiService.post('/Loan/agreementOTPVerify', formData);
    },
    Resident() {
        return apiService.get('/common/residenceproof');
    },
    updateSalary(formData) {
        try {
            const response = apiService.post('/UserDocs/uploadStatment', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 30000,
            });
            return response;
        } catch (error) {
            console.error('Upload Error:', error.message);
            throw error;
        }
    },

    //  updateSalary  (formData, retries = 3) {
    //     try {
    //         const response = apiService.post('/UserDocs/uploadStatment', formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //             },
    //         });
    //         return response;
    //     } catch (error) {
    //         if (retries > 0) {
    //             console.warn(`Retrying... attempts left: ${retries}`);
    //          new Promise((resolve) => setTimeout(resolve, 1000)); // Delay 1 second
    //             return updateSalary(formData, retries - 1);
    //         }
    //         console.error('Upload Error:', error.message);
    //         throw error;
    //     }
    // },
    FaqData() {
        return apiService.get('/common/getfaq');
    },
    adharVerify(formData) {
        return apiService.post('/UserDocs/aadhaarOtp', formData);
    },
    adharOtpVerify(formData) {
        return apiService.post('/UserDocs/aadhaarValidate', formData);
    },
    SaveFaqData(formData) {
        return apiService.post('/Permission/savefaqdata', formData);
    },
    updaterReference(formData) {
        return apiService.post('/Permission/contactReference', formData);
    },
    referenceStatus() {
        return apiService.get('/Permission/contactReferenceStatus');
    },
    searchCompany(formData) {
        return apiService.post('/common/companies', formData);

    },
        checkSanction(formData) {
        return apiService.post('Loan/loansanction', formData);
    },
    getDesignation() {
        return apiService.get('/Common/userDesignation');
    },
    CheckVersion() {
        return apiService.get('/Common/getVersion');
    },
    CheckMaintainance() {
        return apiService.get('Common/maintenance');
    },
    sendFCMToken(formData) {
        return apiService.post('/Common/saveCommonId', formData);
    },
    getMicro() {
        return apiService.get('/User/checkMicroRequired');
    },
    getText(formData) {
        return apiService.post('/User/microUserGetDisclaimer', formData);
    },
    updateMicroStatus(formData) {
        return apiService.post('/User/updateMicroStatus', formData);
    },
    microUser(formData) {
        return apiService.post('/User/microUserPostDisclaimer', formData);
    },
    getReligion() {
        return apiService.get('/Common/usersreligion');
    },
    microUserSave(formData) {
        return apiService.post('/User/microUserSave', formData);
    },
    getContactData() {
        return apiService.get('/Common/appcontact');
    },
    getCalls() {
        return apiService.get('/User/requestCallback');
    },
    getDelection() {
        return apiService.get('/User/accountDeleteRequest');
    },
    getCall() {
        return apiService.get('/Loan/calloptforagreement');
    },
    cancelMan(formData) {
        return apiService.post('/Loan/mandatecancelrequest', formData);
    },
    callState() {
        return apiService.get('/common/state');
    },
    fetchCitiesByState(formData) {
        return apiService.post('/common/city', formData);
    },
};
