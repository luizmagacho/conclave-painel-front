import type { AppProps } from "next/app";
import { useEffect, useState } from "react";

import { AuthProvider } from "@/context/AuthContext";

import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css";

import { PrimeReactProvider } from "primereact/api";

import Head from "next/head";
import GlobalStyle from "@/styles/global";
import ErrorBoundary from "./ErrorBoundary";
const Logo = "/Logo_conclave.png";

function MyApp({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div>
      <Head>
        <title>Conclave Engenharia - Portal</title>
        <link rel="shortcut icon" href={Logo} />
      </Head>
      <AuthProvider>
        <PrimeReactProvider>
          <GlobalStyle />
          <ErrorBoundary>
            {mounted ? <Component {...pageProps} /> : <div />}
          </ErrorBoundary>
        </PrimeReactProvider>
      </AuthProvider>
    </div>
  );
}

export default MyApp;
