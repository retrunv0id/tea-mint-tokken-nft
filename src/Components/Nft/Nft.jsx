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
import abi from "../abiNft.json";
import { TEAnft } from "../TEAnft";
import "./Nft.css";

const Nft = () => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const [totalMinted, setTotalMinted] = React.useState(0n);
  const { isConnected } = useAccount();

  const contractConfig = {
    address: "0x8d68DbFE90e587df172722356af47f6A46b2EFaE",
    abi: abi,
    enabled: true,
    chainId: TEAnft.chainId,
  };

  const { config: contractWriteConfig } = usePrepareContractWrite({
    ...contractConfig,
    functionName: "mint",
    args: [],
    value: "600000000000000",
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
    <Container id="NFT">
                  <div>
              <marquee
                direction="left"
                speed="normal"
                behavior="loop"
                className="marquee"
              >
                Twitter : @retrunvold - Medium : retrunvoid - Github :
                retrunv0id
              </marquee>
            </div>
      <header>
        <Row>
          <Col>
            <div className="product-info">
              <div className="product-text">
                <h1 className="movie-night">MINT NFT</h1>
              </div>
              <a>{Number(totalMinted)} minted so far!</a>
              {mintError && <a>Only 1 Nft To Mint </a>}
              {txError && <a>Error: {txError.message}</a>}
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

export default Nft;