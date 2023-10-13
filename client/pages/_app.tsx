import type { AppProps } from "next/app";
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";
import "../styles/globals.css";
import ThirdWebWrapper from "../context/ThirdWebWrapper";
import { Toaster } from "sonner";
import ModelProvider from "../context/ModelProvider";

/**
 * Main application component.
 *
 * @param {AppProps} props - The component properties.
 * @returns {JSX.Element} - The rendered application.
 */
function MyApp({ Component, pageProps }: AppProps) {
  return (
    // Initialize ThirdwebProvider to connect to the blockchain.
    <ThirdwebProvider
      // Client ID for authentication (replace with your own).
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
      // Set the active blockchain chain (e.g., ChainId.Goerli).
      activeChain={ChainId.Goerli}
    >
      {/* Wrap the app with custom context for blockchain interactions. */}
      <ThirdWebWrapper>
        {/* Display toasts for notifications. */}
        <Toaster />
        {/* Provide a model context for the app. */}
        <ModelProvider>
          {/* Render the main component. */}
          <Component {...pageProps} />
        </ModelProvider>
      </ThirdWebWrapper>
    </ThirdwebProvider>
  );
}

export default MyApp;
