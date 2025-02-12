import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import abi from "../abiToken.json";
import { TEAToken } from "../TEAToken";

const Token = () => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const [totalMinted, setTotalMinted] = React.useState(0n);
  const { isConnected } = useAccount();

  const contractConfig = {
    address: "0xd6755d41732B9ca4a62dB83533DbB91607d3c7F7",
    abi: abi,
    enabled: true,
    chainId: TEAToken.chainId,
  };

  const { config: contractWriteConfig } = usePrepareContractWrite({
    ...contractConfig,
    functionName: "claimTokens",
    args: [],
    value: "6000000000000",
  });

  const {
    data: mintData,
    write: mint,
    isLoading: isMintLoading,
    isSuccess: isMintStarted,
    error: mintError,
  } = useContractWrite(contractWriteConfig);

  const { data: totalSupplyData } = useContractRead({
    ...contractConfig,
    functionName: "totalSupply",
    watch: true,
  });

  const {
    data: txData,
    isSuccess: txSuccess,
    error: txError,
  } = useWaitForTransaction({
    hash: mintData?.hash,
  });

  React.useEffect(() => {
    if (totalSupplyData) {
      setTotalMinted(totalSupplyData);
    }
  }, [totalSupplyData]);

  const isMinted = txSuccess;

  return (
    <Container id="TOKEN">
      <header>
      <div className="user-login-box">
          <span className="user-icon"></span>
          </div>
        <Row className="text-center">
          <Col>
            <div className="product-info">
              <div className="product-text">
                <h1 className="movie-night">MINT TOKEN</h1>
              </div>
              <p>{Number(totalMinted)} minted so far!</p>
              {mintError && <p>Only 1 Token To Mint </p>}
              {txError && <p>Error: {txError.message}</p>}
              <ConnectButton showBalance={false} chainStatus="name" />
              {mounted && isConnected && !isMinted && (
                <button
                  className="connectButton"
                  disabled={!mint || isMintLoading || isMintStarted}
                  data-mint-loading={isMintLoading}
                  data-mint-started={isMintStarted}
                  onClick={() => mint?.()}
                >
                  {isMintLoading && "Waiting for approval"}
                  {isMintStarted && "Minting..."}
                  {!isMintLoading && !isMintStarted && "Mint"}
                </button>
              )}
              {isMinted && (
                <div>
                  <a
                    style={{ margin: "40px auto" }}
                    href={`https://explorer-tea-assam-fo46m5b966.t.conduit.xyz/tx/${mintData?.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    testnet.Tea-assam
                  </a>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </header>
    </Container>
  );
};

export default Token;