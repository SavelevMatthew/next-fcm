'use client'
import { useState, useEffect } from 'react'
import { getMessaging, getToken } from 'firebase/messaging'
import firebaseApp from '../firebase/firebase'

const useFcmToken = () => {
    const [token, setToken] = useState('');
    const [notificationPermissionStatus, setNotificationPermissionStatus] = useState('');

    useEffect(() => {
        const retrieveToken = async () => {
            try {
                if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                    const messaging = getMessaging(firebaseApp);

                    // Request notification permission
                    const permission = await Notification.requestPermission();
                    setNotificationPermissionStatus(permission);

                    if (permission === 'granted') {
                        const currentToken = await getToken(messaging, {
                            vapidKey: process.env.NEXT_PUBLIC_WEB_PUSH_KEY, // Replace with your Firebase project's VAPID key
                        });
                        if (currentToken) {
                            setToken(currentToken);
                        } else {
                            console.log('No registration token available. Request permission to generate one.');
                        }
                    }
                }
            } catch (error) {
                console.log('Error retrieving token:', error);
            }
        };

        retrieveToken();
    }, []);

    return { token, notificationPermissionStatus };
};

export default useFcmToken;