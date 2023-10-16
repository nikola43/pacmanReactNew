import { Row } from 'antd';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { Board } from '../../components/Board';
import { DebugView } from './components/DebugView';
import { ExtraLives } from './components/ExtraLives';
import { GameOver } from './components/GameOver';
import { GhostsGameView } from './components/GhostsView';
import { MazeView } from './components/MazeView';
import { PacManView } from './components/PacManView';
import { PillsView } from './components/PillsView';
import { Score } from './components/Score';
import { useStore } from '../../components/StoreContext';
import { useKeyboardActions } from './components/useKeyboardActions';
import { VSpace } from '../../components/Spacer';
import { useGameLoop } from '../../model/useGameLoop';
import PacManGameAbi from "../../blockchain/abi/PacManGame.json";
import { injected } from "../../blockchain/metamaskConnector";
import { useWeb3React } from "@web3-react/core";
export const GamePage: React.FC = observer(() => {
  const { active, account, library, activate, deactivate, chainId } =
    useWeb3React();
  const selectedNetwork = 80001;
  const [gamePrice, setGamePrice] = useState();


  let pancmanGameAddress = "0x0000fF0d724a25FBBcB1504642CF1713D3c13fac";
  let pancmanGameContract: any;

  if (account && library) {
    pancmanGameContract = new library.eth.Contract(
      PacManGameAbi,
      pancmanGameAddress
    );
  }

  const store = useStore();
  useEffect(() => {
    store.resetGame();
    return () => {
      store.game.gamePaused = true;
    };
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, []);

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

  useEffect(() => {


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

  useGameLoop();
  useKeyboardActions();

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

  return (
    <Layout data-testid="GamePage">
      <ScoreArea>
        <Row justify="center">
          <Score />
        </Row>
        <VSpace size="small" />
      </ScoreArea>

      <EmptyArea />

      <BoardArea>
        <Board>
          <MazeView />
          <PillsView />
          <PacManView />
          <GhostsGameView />
          <GameOver />
        </Board>
        <VSpace size="large" />
        <Row justify="center">
          <ExtraLives />

        </Row>
        <Row justify="center">
          <button onClick={() => {
            playGame(gamePrice).then((res: any) => {
              console.log("playGame", res);
              store.resetGame();
            })

          }}>Play</button>
        </Row>
      </BoardArea>

      <DebugArea>
        <DebugView />
      </DebugArea>
    </Layout>
  );
});

const Layout = styled.div`
  margin-left: 16px;
  margin-right: 16px;

  display: grid;

  @media (min-width: 1280px) {
    grid-template-columns: 1fr 1fr;
    justify-items: center;
  }
  @media (max-width: 1280px) {
    grid-template-columns: 1fr;
    justify-items: center;
  }
`;

const ScoreArea = styled.div``;

const EmptyArea = styled.div``;

const BoardArea = styled.div``;

const DebugArea = styled.div`
  @media (max-width: 1280px) {
    display: none;
  }
`;
