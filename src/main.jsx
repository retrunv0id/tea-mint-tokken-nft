import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./App.css";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { TEAToken } from "./Components/TEAToken.jsx";
import { TEAnft } from "./Components/TEAnft.jsx";

const { chains, publicClient } = configureChains(
  [sepolia, TEAToken, TEAnft],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "TEA BY RETRUNVOID",
  projectId: "YOUR_PROJECT_ID",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        coolMode
        showRecentTransactions={true}
        modalSize="compact"
        theme={darkTheme()}
        chains={chains}
      >
        <App />{" "}
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);