import { useEffect } from "react";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";

export default function App({ Component, pageProps }) {
  return (
    <main>
      <div className="fixed inset-0 flex justify-center sm:px-8">
        <div className="flex w-full max-w-7xl lg:px-8">
          <div className="w-full bg-white dark:bg-black" />
        </div>
      </div>
      <div className="relative selection:bg-indigo-500 selection:text-white dark:selection:bg-indigo-800">
        <Navbar />
        <main>
          <Component {...pageProps} />
        </main>
      </div>
    </main>
  );
}
