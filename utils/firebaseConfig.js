import { FirebaseAuthTypes } from '@react-native-firebase/auth';

export const firebaseConfig = {
  apiKey: 'AIzaSyCML1b_CJvUslUf5NORXVPtkIbKM0jcLdw', // From the api_key field
  authDomain: 'salarynow-12d23.firebaseapp.com', // Typically <project_id>.firebaseapp.com
  projectId: 'salarynow-12d23', // From project_info.project_id
  storageBucket: 'salarynow-12d23.appspot.com', // From project_info.storage_bucket
  messagingSenderId: '19120401926', // From project_info.project_number
  appId: '1:19120401926:android:c44437c8f91bedd1', // From mobilesdk_app_id
  measurementId: '', // Optional field, can be left empty unless you have one
};

// Initialize Firebase
if (!FirebaseAuthTypes.Apps.length) {
  // Initialize Firebase only once
  Firebase.initializeApp(firebaseConfig);
}
