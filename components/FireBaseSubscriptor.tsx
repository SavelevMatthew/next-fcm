'use client'
import React from 'react'
import useFCMToken from "../hooks/useFCMToken";

export const FireBaseHandler = () => {
    const { token, notificationPermissionStatus, retrieveToken } = useFCMToken()

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
