import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Navbar from "../components/Navbar"; // Ensure correct path
import { ToastContainer } from "react-toastify";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Code Sharda</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/sharda.png" />
        <meta
          name="description"
          content="Web application that contains LeetCode problems and video solutions"
        />
      </Head>

      {/* Navbar component */}
      <Navbar />

      {/* Toast notifications */}
      <ToastContainer />

      {/* Render the current page component */}
      <Component {...pageProps} />
      
    </>
  );
}
