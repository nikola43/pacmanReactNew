import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import PacManGameAbi from "../../blockchain/abi/PacManGame.json";
import { injected } from "../../blockchain/metamaskConnector";
import { useHistory } from "react-router-dom";
import style from "./initialPage.module.css";
const InitialPage = () => {
  const [gamePrice, setGamePrice] = useState();
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const history = useHistory();

  const { active, account, library, activate, deactivate, chainId } =
    useWeb3React();
  const selectedNetwork = 80001;

  let pancmanGameAddress = "0x0000fF0d724a25FBBcB1504642CF1713D3c13fac";
  let pancmanGameContract: any;

  if (account && library) {
    pancmanGameContract = new library.eth.Contract(
      PacManGameAbi,
      pancmanGameAddress
    );
  }

  const toHex = (num: number) => {
    const val = Number(num);
    return "0x" + val.toString(16);
  };

  async function disconnect() {
    try {
      deactivate();
      localStorage.setItem("isWalletConnected", "false");
      localStorage.removeItem("connector");
      localStorage.removeItem("wallet");
    } catch (ex) {
      console.log(ex);
    }
  }

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(selectedNetwork) }],
      });
    } catch (switchError: any) {
      console.log(switchError);

      if (switchError.code === 4902) {
        //await addNetwork(selectedNetwork.toString());
      }
    }
  };

  function getWalletAbreviation(walletAddress: string) {
    if (walletAddress !== null && walletAddress !== undefined) {
      return walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);
    }
    return "";
  }

  useEffect(() => {
    const isWalletConnected = localStorage.getItem("isWalletConnected");
    const connector = localStorage.getItem("connector");
    if (isWalletConnected === "true" && connector === "injected") {
      activate(injected);
    }
  }, [active]);

  async function connectMetamask() {
    try {
      if (
        window.ethereum &&
        window.ethereum.networkVersion !== selectedNetwork.toString()
      ) {
        switchNetwork();
      }

      await activate(injected, undefined, true);
      localStorage.setItem("isWalletConnected", "true");
      localStorage.setItem("connector", "injected");
    } catch (ex) {
      console.log("Please install Metamask");
      console.log(ex);
    }
  }

  const isGameStarted = async () => {
    return pancmanGameContract.methods
      .gameStarted()
      .call()
      .then((res: any) => {
        console.log("res", res);
        return res;
      });
  };

  const getGamePrice = async () => {
    return pancmanGameContract.methods
      .playPrice()
      .call()
      .then((res: any) => {
        console.log("res", res);
        return res;
      });
  };

  const playGame = async (gamePrice: any) => {
    return pancmanGameContract.methods
      .play()
      .send({ from: account, value: gamePrice })
      .then((res: any) => {
        console.log("res", res);
        return res;
      })
      .catch((ex: any) => {
        console.error(ex.message);
        return undefined;
      });
  };

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.code === "Space") {
        setIsSpacePressed(true);
      }
    };

    const handleKeyUp = (e: any) => {
      if (e.code === "Space") {
        setIsSpacePressed(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);


  useEffect(() => {
    if (isSpacePressed && account) {
      console.log("isSpacePressed", isSpacePressed);
      playGame(gamePrice).then((res: any) => {
        if (res) {
          //dispatch(gameStart());
          history.push("/game");
        }
      })
    }
  }, [isSpacePressed]);



  useEffect(() => {
    if (chainId !== selectedNetwork) {
      switchNetwork();
    }

    if (account && library) {
      isGameStarted().then((res: any) => {
        console.log("isGameStarted", res);
        localStorage.setItem("wallet", account!);
      });

      getGamePrice().then((res: any) => {
        setGamePrice(res);
        console.log("getGamePrice", res);
      });
    }
  }, [activate, chainId, account]);

  //const dispatch = useDispatch();

  return (
    <div className={style.container}>
      <div>
        <Toaster />
      </div>

      <h1 style={{ color: "white" }} className={style.buttonText} onClick={() => {
        playGame(gamePrice).then((res: any) => {
          if (res) {
            //dispatch(gameStart());
            history.push("/game");
          }
        })
      }}>
        Press Space to Start Game
      </h1>

      <h1
        onClick={active ? disconnect : connectMetamask}
        className={style.buttonText}
      >
        {active
          ? `Connected: ${getWalletAbreviation(account!)}`
          : "Connect Metamask"}
      </h1>

      <h1 onClick={() => {

        if (!active) {
          toast.error("Please connect your wallet before accessing the leaderboard");
          return;
        }

        history.push("/leaderboard");
      }} className={style.buttonText}>
        Leaderboard
      </h1>
    </div >
  );
};

export default InitialPage;
