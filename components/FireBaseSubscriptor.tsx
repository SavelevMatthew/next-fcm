'use client'
import React from 'react'
import useFCMToken from "../hooks/useFCMToken";

export const FireBaseHandler = () => {
    const { token, notificationPermissionStatus } = useFCMToken()

    return (
        <div>
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
