import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { GamePage } from './pages/GamePage/GamePage';
import { MazePage } from './pages/MazePage/MazePage';
import { SpritePage } from './pages/SpritePage/SpritePage';
import { WayFindingPage } from './pages/WayFindingPage/WayFindingPage';
import InitialPage from "./pages/InitialPage";
import LeaderboardPage from './pages/LeaderboardPage';

export const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path="/" exact>
        <InitialPage />
      </Route>
      <Route path="/game" exact>
        <GamePage />
      </Route>
      <Route path="/sprites">
        <SpritePage />
      </Route>
      <Route path="/maze">
        <MazePage />
      </Route>
      <Route path="/way-finding">
        <WayFindingPage />
      </Route>
      <Route path="/leaderboard">
        <LeaderboardPage />
      </Route>
    </Switch>
  );
};
