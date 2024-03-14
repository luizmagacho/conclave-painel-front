import type { AppProps } from "next/app";

import { AuthProvider } from "@/context/AuthContext";

import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/saga-blue/theme.css";

import { PrimeReactProvider } from "primereact/api";

import Head from "next/head";
import GlobalStyle from "@/styles/global";
import ErrorBoundary from "./ErrorBoundary";
import Link from "next/link";
import Logo from "../../public/Logo_conclave.png";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Head>
        <title>Conclave Engenharia - Portal</title>
        <Link
          rel="icon"
          href="../../public/Logo_conclave.png"
          type="image/x-con"
        />
      </Head>
      <AuthProvider>
        <PrimeReactProvider>
          <GlobalStyle />
          <ErrorBoundary>
            <Component {...pageProps} />
          </ErrorBoundary>
        </PrimeReactProvider>
      </AuthProvider>
    </div>
  );
}

export default MyApp;
