import { Analytics } from "@vercel/analytics/react";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DefaultSeo } from "next-seo";
import SEO from "../../seo.config";

export default function App({ Component, pageProps }) {
  return (
    <main>
      <DefaultSeo {...SEO} />
      <div className="relative selection:bg-lime-500 selection:text-white dark:selection:bg-indigo-800">
        <Navbar />
        <main>
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
      <Analytics />
    </main>
  );
}
