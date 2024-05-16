import type { Metadata } from "next";
import rdd from "react-device-detect";

export const metadata: Metadata = {
  title: "Home",
};

export default function Page() {
  return (
    <>
      <h1>Next.js + Serwist</h1>
        <details style={{ marginBottom: 40 }}>
            <summary>Информация о девайсе</summary>
            <pre>
          {JSON.stringify(rdd, null, 2)}
        </pre>
        </details>
    </>
  );
}
