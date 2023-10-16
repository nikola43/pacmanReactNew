import { observable, action } from 'mobx';
import { Game } from './Game';
import { DebugState } from './DebugState';

export class Store {
  @observable
  game: Game = new Game(this, 0);

  debugState = new DebugState(this);

  @action.bound
  resetGame() {
    this.game = new Game(this, 0);
    this.game.readyGameForPlay();
  }

  resetGameWithScore() {
    this.game = new Game(this, this.game.score);
    this.game.readyGameForPlay();
  }

  /*
  resetGamev1() {
    this.game = new Game(this);
    this.game.readyGameForPlay();
  }
  */
}
