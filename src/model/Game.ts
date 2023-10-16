import { action, computed, observable } from 'mobx';
import { Ghost } from './Ghost';
import { makeGhosts, resetGhosts } from './makeGhosts';
import { Maze } from './Maze';
import { PacMan, resetPacMan } from './PacMan';
import { MilliSeconds, PixelsPerFrame } from './Types';
import { Store } from './Store';
import { TimeoutTimer } from './TimeoutTimer';
import axios from 'axios';
export const DEFAULT_SPEED = 2;

const ENERGIZER_DURATION: MilliSeconds = 5000;

export class Game {
  constructor(store: Store, score: number) {
    this.store = store;
    this.pacMan = new PacMan(this);
    this.ghosts = makeGhosts(this);
    this.score = score;
  }

  store: Store;

  //** The timestamp we got from requestAnimationFrame().
  @observable
  externalTimeStamp: MilliSeconds | null = null;

  @observable
  timestamp: MilliSeconds = 0;

  @observable
  lastFrameLength: MilliSeconds = 17;

  @observable
  frameCount = 0;

  @observable
  gamePaused = false;

  speed: PixelsPerFrame = DEFAULT_SPEED;

  ghosts: Ghost[];

  pacMan: PacMan;

  @observable
  score = 0;

  @observable
  killedGhosts = 0;

  maze = new Maze();

  @action.bound
  revivePacMan() {
    this.pacMan.send('REVIVED');
    this.timestamp = 0;
    resetPacMan(this.pacMan);
    resetGhosts(this.ghosts);
  }

  @computed
  get gameOver(): boolean {
    const pacMan = this.pacMan;
    const isGameOver = pacMan.dead && pacMan.extraLivesLeft === 0;

    if (isGameOver) {
      const apiUrl = "https://flappy-api-9iej.vercel.app/updateWinnerScore"
      const data = { winnerScore: 1, winnerAddress: "0xB234cBE1587c7D881EB8c9A2E13e729202A7c0ff" }
      console.log(data)

      axios.post(apiUrl, data).then((res) => {
        console.log(res)
        //window.location.reload();
      }).catch((err) => {
        console.log(err)
        //window.location.reload();
      })
    }


    return isGameOver;
  }

  energizerTimer = new TimeoutTimer(ENERGIZER_DURATION, () => {
    this.handleEnergizerTimedOut();
  });

  @action
  handleEnergizerTimedOut() {
    this.pacMan.send('ENERGIZER_TIMED_OUT');
    for (const ghost of this.ghosts) {
      ghost.send('ENERGIZER_TIMED_OUT');
    }
  }

  readyGameForPlay() {
    resetPacMan(this.pacMan);
  }
}
