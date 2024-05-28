import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";
import { initializeApp, deleteApp } from 'firebase/app'
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw'
import isEqual from 'lodash/isEqual'

import type { FirebaseApp, FirebaseOptions } from 'firebase/app'
import type { Unsubscribe } from 'firebase/messaging/sw'

// SERWIST SECTION

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

serwist.addEventListeners();

// FIREBASE SECTION
const keysToCheck = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId']

let firebaseApp: FirebaseApp | undefined
let config: FirebaseOptions | undefined
let unsubscribe: Unsubscribe | undefined

function isValidConfig (data: any): data is FirebaseOptions {
  return (
      typeof data === 'object' &&
      !Array.isArray(data) &&
      data !== null &&
      keysToCheck.every(key => data.hasOwnProperty(key) && typeof data[key] === 'string')
  )
}

async function initFirebaseApp (newConfig: FirebaseOptions) {
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

  config = newConfig
}

self.addEventListener('message', async (event) => {
  const data = event.data
  if (isValidConfig(data)) {
    if (!isEqual(config, data)) {
      await initFirebaseApp(data)
    }
  }
})
