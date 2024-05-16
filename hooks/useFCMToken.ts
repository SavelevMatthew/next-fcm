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
                    // Request notification permission
                    const permission = await Notification.requestPermission();
                    setNotificationPermissionStatus(permission);
                    const messaging = getMessaging(firebaseApp);

                    if (permission === 'granted') {
                        navigator.serviceWorker.ready.then(async reg => {
                            const currentToken = await getToken(messaging, {
                                vapidKey: process.env.NEXT_PUBLIC_WEB_PUSH_KEY, // Replace with your Firebase project's VAPID key
                                serviceWorkerRegistration: reg
                            });
                            if (currentToken) {
                                setToken(currentToken);
                            } else {
                                console.log('No registration token available. Request permission to generate one.');
                            }
                        })

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