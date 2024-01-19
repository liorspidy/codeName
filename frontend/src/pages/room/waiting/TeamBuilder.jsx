/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import classes from "./Waiting.module.scss";

const TeamBuilder = (props) => {
  const { mainClass, teamPlayers } = props;
  const [captain, setCaptain] = useState(null);

  useEffect(() => {
    setCaptain(teamPlayers[0]);
  }, [teamPlayers]);

  const players = teamPlayers.map((player, index) => {
    if (index>0){
        return (
          <li key={index} className={classes.playerItem}>
            {player}
          </li>
        );
    }else{
        return ;
    }
  });

  return (
    <div className={mainClass}>
      <div className={classes.colorIndicator}>
        <p className={classes.activatorName}>{captain}</p>
      </div>
      <ul className={classes.playersList}>
        {players}
      </ul>
    </div>
  );
};

export default TeamBuilder;
