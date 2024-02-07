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

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Head>
        <title>Conclave Engenharia - Portal</title>
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
