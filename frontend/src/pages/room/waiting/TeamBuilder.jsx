/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import classes from "./Waiting.module.scss";

const TeamBuilder = (props) => {
  const { mainClass, teamPlayers, playerDetails, setReadyButton } = props;
  const [captain, setCaptain] = useState(null);

  useEffect(() => {
    if (teamPlayers) {
      setCaptain(teamPlayers[0]);
      if (
        teamPlayers.find((player) => {
          return player?.name === playerDetails?.name;
        })?.ready
      ) {
        setReadyButton(true);
      }
    }
  }, [teamPlayers]);

  const players = teamPlayers?.map((player, index) => {
    if (index > 0) {
      return (
        <li
          key={index}
          className={`${classes.playerItem} ${
            playerDetails.name === player.name ? classes.myPlayer : ""
          } ${player.ready ? classes.ready : ""}`}
        >
          {player.name}
        </li>
      );
    } else {
      return;
    }
  });

  return (
    <div className={mainClass}>
      <div className={classes.colorIndicator}>
        <span
          className={`${classes.activatorName} ${
            playerDetails.name === captain?.name ? classes.myPlayer : ""
          } ${captain?.ready ? classes?.ready : ""}`}
        >
          {captain?.name}
        </span>
      </div>
      <ul className={classes.playersList}>{players}</ul>
    </div>
  );
};

export default TeamBuilder;
