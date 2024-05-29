import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";
import { initializeApp, deleteApp } from 'firebase/app'
import type { FirebaseOptions, FirebaseApp } from 'firebase/app'
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw'
import type { Unsubscribe } from 'firebase/messaging/sw'
import { openDB } from 'idb'

const DB_NAME = 'kv-store'
const DB_VERSION = 1
const STORE_NAME = 'kv'

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    db.createObjectStore(STORE_NAME)
  }
})

async function getFCMConfig (): Promise<FirebaseOptions | null> {
  return (await dbPromise).get(STORE_NAME, 'FCM_CONFIG')
}

async function setFCMConfig(config: FirebaseOptions) {
  return (await dbPromise).put(STORE_NAME, config, 'FCM_CONFIG')
}


declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    // Change this attribute's name to your `injectionPoint`.
    // `injectionPoint` is an InjectManifest option.
    // See https://serwist.pages.dev/docs/build/configuring
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [
      {
        url: "/~offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

let firebaseApp: FirebaseApp | undefined
let unsubscribe: Unsubscribe | undefined

async function initFirebaseApp(newConfig: FirebaseOptions) {
  if (unsubscribe) {
    unsubscribe()
  }
  if (firebaseApp) {
    await deleteApp(firebaseApp)
  }

  firebaseApp = initializeApp(newConfig)
  const messaging = getMessaging(firebaseApp)
  unsubscribe = onBackgroundMessage(messaging, async (payload) => {
    console.log(
        '[firebase-messaging-sw.js] Received background message ',
        payload
    );
    const notificationTitle = 'Notification title';
    const notificationOptions = {
      body: 'notification body',
    };
    await self.registration.showNotification(notificationTitle, notificationOptions);
  })
}

self.addEventListener('activate', () => {
  console.log('TRIGGERED')
})
serwist.addEventListeners()


const fba = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FCM_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FCM_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FCM_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FCM_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FCM_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FCM_APP_ID,
})

const msg = getMessaging(fba)

onBackgroundMessage(msg, async (payload) => {
  console.log(
      '[firebase-messaging-sw.js] Received background message ',
      payload
  );
  const notificationTitle = 'Notification title';
  const notificationOptions = {
    body: 'notification body',
  };
  await self.registration.showNotification(notificationTitle, notificationOptions);
})

// self.addEventListener()

// getFCMConfig()
//     .then(cfg => {
//       console.log('CFG', cfg)
//       if (cfg) {
//         return initFirebaseApp(cfg)
//       }
//     })
