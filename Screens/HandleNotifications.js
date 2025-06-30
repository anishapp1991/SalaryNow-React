import React, { useEffect, useContext } from "react";
import messaging from "@react-native-firebase/messaging";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import { Platform, PermissionsAndroid, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AuthContext from "../ContextApi/AuthContext";

const HandleNotifications = ({ deviceToken }) => {
    const navigation = useNavigation(); // React Navigation hook for navigation
    const { token } = useContext(AuthContext);
    const isAuthenticated = !!token;
    let lastMessageId = null; // To avoid duplicate notifications
    let lastNavigatedScreen = null; // Track last navigated screen

    useEffect(() => {
        let unsubscribeOnMessage;

        const initializeNotifications = async () => {
            try {
                // Request Notification Permissions
                const androidPermissionGranted = await requestAndroidNotificationPermission();
                const notificationPermissionGranted = await requestNotificationPermissions();
                if (!androidPermissionGranted || !notificationPermissionGranted) {
                    Alert.alert("Permission Denied", "Notifications will not work without permission.");
                    return;
                }

                // Push Notification Configuration
                PushNotification.configure({
                    onRegister: (token) => {
                        console.log("Device Token (PushNotification):", token);
                    },
                    onNotification: (notification) => {
                        console.log("Notification received:", notification);
                        
                        // Avoid processing duplicate notifications
                        if (notification.messageId === lastMessageId) return;
                        lastMessageId = notification.messageId;

                        // Handle navigation and local notifications
                        if (notification.data?.screen) {
                            handleNavigation(notification.data);
                        }

                        // Show local notification
                        PushNotification.localNotification({
                            channelId: notification.data?.channelId || "reminder-channel",
                            title: notification.notification?.title || "New Notification",
                            message: notification.notification?.body || "You have a new message.",
                            playSound: true,
                            soundName: "default",
                            priority: "high",
                        });

                        if (notification.finish) {
                            notification.finish(PushNotificationIOS.FetchResult.NoData);
                        }
                    },
                    onRegistrationError: (err) => {
                        console.error("PushNotification registration error:", err.message);
                    },
                    permissions: {
                        alert: true,
                        badge: true,
                        sound: true,
                    },
                    popInitialNotification: false, // Avoid duplicate notifications
                    requestPermissions: true,
                });

                // Create Notification Channel (Android)
                PushNotification.createChannel(
                    {
                        channelId: "reminder-channel",
                        channelName: "Reminder Notifications",
                        channelDescription: "Channel for reminder notifications",
                        soundName: "default",
                        importance: 4,
                        vibrate: true,
                    },
                    (created) => console.log(`Notification channel created: ${created}`)
                );

                // Retrieve FCM Token
                const fcmToken = await messaging().getToken();
                console.log("Device Token (FCM):", fcmToken);
                if (deviceToken) deviceToken(fcmToken);

                // App Opened from Quit State
                messaging()
                    .getInitialNotification()
                    .then((remoteMessage) => {
                        if (remoteMessage) {
                            console.log("App opened from quit state:", remoteMessage);
                            handleNavigation(remoteMessage);
                        }
                    });

                // App Opened from Background
                messaging().onNotificationOpenedApp((remoteMessage) => {
                    console.log("App opened from background state:", remoteMessage);
                    handleNavigation(remoteMessage);
                });

            } catch (error) {
                console.error("Error initializing notifications:", error);
            }
        };

        initializeNotifications();

        // Cleanup listeners
        return () => {
            PushNotification.deleteChannel("reminder-channel");
        };
    }, [deviceToken, navigation]);

    // Navigate to a specific screen
    const handleNavigation = (remoteMessage) => {
        const { screen, params } = remoteMessage?.data || {};
        if (screen && screen !== lastNavigatedScreen) {
            console.log(`Navigating to screen: ${screen} with params:`, params);
            navigation.navigate(screen, params || {});
            lastNavigatedScreen = screen; // Update last navigated screen
        }
    };

    // Request Notification Permissions
    const requestNotificationPermissions = async () => {
        try {
            const authStatus = await messaging().requestPermission();
            if (
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL
            ) {
                console.log("Notification permissions granted.");
                return true;
            }
            console.log("Notification permissions denied.");
            return false;
        } catch (error) {
            console.error("Error requesting notification permissions:", error);
            return false;
        }
    };

    // Request Android Notification Permission for Android 13+
    const requestAndroidNotificationPermission = async () => {
        if (Platform.OS === "android" && Platform.Version >= 33) {
            const result = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                {
                    title: "Notification Permission",
                    message: "This app needs notification permissions to send alerts.",
                    buttonPositive: "Allow",
                }
            );
            return result === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    };

    return null; // No UI needed for this component
};

export default HandleNotifications;
