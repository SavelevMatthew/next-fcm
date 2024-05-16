import type { Metadata } from "next";
import rdd from "react-device-detect";
import useFcmToken from '../hooks/useFCMToken'

export const metadata: Metadata = {
  title: "Home",
};

export default function Page() {
  const { token, notificationPermissionStatus } = useFcmToken()

  return (
    <>
      <h1>Next.js + Serwist</h1>
        <details style={{ marginBottom: 40 }}>
            <summary>Информация о девайсе</summary>
            <pre>
          {JSON.stringify(rdd, null, 2)}
        </pre>
        </details>
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
    </>
  );
}
