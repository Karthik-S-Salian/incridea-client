import { ApolloProvider } from "@apollo/client";
import { Analytics } from "@vercel/analytics/react";
import { AnimatePresence, motion } from "framer-motion";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { Press_Start_2P } from "next/font/google";
import LocalFont from "next/font/local";
import { useRouter } from "next/router";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

import Footer from "~/components/footer";
import HeadComponent from "~/components/head";
import Loader from "~/components/loader";
import { useApollo } from "~/lib/apollo";
import { cn } from "~/lib/utils";
import "~/styles/globals.css";

const Navbar = dynamic(() => import("~/components/navbar"), { ssr: false });

export const VikingHell = LocalFont({
  src: "../font/Viking Hell.otf",
  variable: "--font-viking-hell",
});

export const garetFont = LocalFont({
  src: "../font/Garet-Book.otf",
  variable: "--font-Garet",
});

export const gilroy = LocalFont({
  src: [
    {
      path: "../font/Gilroy-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../font/Gilroy-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../font/Gilroy-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../font/Gilroy-SemiBold.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-gilroy",
  display: "swap",
});

export const pressStart = Press_Start_2P({
  weight: ["400"],
  subsets: ["latin"],
  style: ["normal"],
  display: "swap",
  variable: "--font-Press_Start_2P",
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState);
  const [isLoading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  if (
    router.pathname === "/theme" ||
    router.pathname === "/test" ||
    router.pathname === "/"
  )
    return (
      <ApolloProvider client={apolloClient}>
        <HeadComponent
          title="Incridea"
          description="Official Website of Incridea 2024, National level techno-cultural fest, NMAMIT, Nitte. Innovate. Create. Ideate."
        />
        <div
          className={cn(
            "min-h-scree",
            // VikingHell.variable,
            // pressStart.variable,
            // garetFont.variable,
            // gilroy.variable,
          )}
        >
          <Component {...pageProps} />
          <Toaster />
        </div>
      </ApolloProvider>
    );
  if (router.pathname.startsWith("/explore"))
    return (
      <ApolloProvider client={apolloClient}>
        <HeadComponent
          title="Incridea"
          description="Official Website of Incridea 2024, National level techno-cultural fest, NMAMIT, Nitte. Innovate. Create. Ideate."
        />
        <Loader />
        <div
          className={cn(
            "min-h-screen",
            // VikingHell.variable,
            // pressStart.variable,
            // garetFont.variable,
          )}
        >
          <Component {...pageProps} />
          <Toaster />
        </div>
      </ApolloProvider>
    );
  return (
    <>
      <ApolloProvider client={apolloClient}>
        <HeadComponent
          title="Incridea"
          description="Official Website of Incridea 2024, National level techno-cultural fest, NMAMIT, Nitte. Innovate. Create. Ideate."
        />
        <Toaster />
        <Loader />
        <div
          className={cn(
            "min-h-screen bg-[#7528cf]",
            // VikingHell.variable,
            // pressStart.variable,
            // garetFont.variable,
          )}
        >
          {!isLoading && <Navbar />}
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="min-h-screen"
            >
              <Component setLoading={setLoading} {...pageProps} />
            </motion.div>
          </AnimatePresence>
          <Footer />
        </div>
      </ApolloProvider>
      <Analytics />
    </>
  );
}
