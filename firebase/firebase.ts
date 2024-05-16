import { initializeApp } from 'firebase/app'

const config = {
    apiKey: process.env.NEXT_PUBLIC_FCM_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FCM_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FCM_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FCM_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FCM_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FCM_APP_ID,
}

const app = initializeApp(config)

export default app
