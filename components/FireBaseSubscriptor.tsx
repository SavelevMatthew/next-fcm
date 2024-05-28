'use client'
import React, {useEffect} from 'react'
import useFCMToken from "../hooks/useFCMToken";

export const FireBaseHandler = () => {
    const { token, notificationPermissionStatus, retrieveToken } = useFCMToken()

    const windowType = typeof window
    const navigatorType = typeof navigator

    useEffect(() => {
        if (windowType !== 'undefined' && navigatorType !== 'undefined' && 'serviceWorker' in navigator && window.serwist !== undefined) {
            navigator.serviceWorker.ready.then((reg) => {
                if (reg.active) {
                    reg.active.postMessage({
                        apiKey: process.env.NEXT_PUBLIC_FCM_API_KEY,
                        authDomain: process.env.NEXT_PUBLIC_FCM_AUTH_DOMAIN,
                        projectId: process.env.NEXT_PUBLIC_FCM_PROJECT_ID,
                        storageBucket: process.env.NEXT_PUBLIC_FCM_STORAGE_BUCKET,
                        messagingSenderId: process.env.NEXT_PUBLIC_FCM_SENDER_ID,
                        appId: process.env.NEXT_PUBLIC_FCM_APP_ID,
                    })
                }
            })
        }
    }, [windowType, navigatorType]);

    return (
        <div>
            {!token && (
                <button onClick={retrieveToken}>Subscribe</button>
            )}
            {notificationPermissionStatus && (
                <div style={{ marginBottom: 40 }}>
                    Status: {notificationPermissionStatus}
                </div>
            )}
            {token && (
                <div style={{ marginBottom: 40 }}>
                    FCM token: {token}
                </div>
            )}
        </div>
    )
}
