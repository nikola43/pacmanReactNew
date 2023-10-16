import { observable } from 'mobx';
import { getPillsMatrix, TileId } from './MazeData';

export class Maze {
  @observable
  pills: TileId[][] = getPillsMatrix();

  numberOfPillsLeft: number = this.pills.reduce((sum, row) => sum + row.filter(pill => pill !== 0).length, 0) - 1;
}
