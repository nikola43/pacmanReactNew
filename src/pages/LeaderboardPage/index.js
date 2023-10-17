import style from "./leaderboardPage.module.css";
import { useEffect, useState } from "react";
import axios from "axios";

const LeaderboardPage = () => {
  const [rankList, setRankList] = useState([]);
  const apiUrl = "https://packman-api.vercel.app/getRanking"

  useEffect(() => {
    axios
      .get(apiUrl)
      .then((res) => {
        setRankList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function getRankEmoji(rank) {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return "";
    }
  }

  return (
    <div className={style.container}>
      <h1>Leaderboard</h1>

      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Wallet</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {rankList.map((row, index) => {
            return (
              <tr key={index}>
                {<td>{index + 1}  {getRankEmoji(index + 1)}</td>}
                <td>{row.address}</td>
                <td>{row.score}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardPage;
