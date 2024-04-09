/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import classes from "./Waiting.module.scss";
import { motion } from "framer-motion";

const TeamBuilder = (props) => {
  const { mainClass, teamPlayers, playerDetails, setReadyButton } = props;
  const [captain, setCaptain] = useState(null);

  useEffect(() => {
    if (teamPlayers) {
      setCaptain(teamPlayers[0]);
      if (teamPlayers.find((player) => player.name === playerDetails.name)?.ready) {
        setReadyButton(true);
      }
    }
  }, [teamPlayers]);

  const players = teamPlayers?.map((player, index) => {
    if (index > 0) {
      return (
        <motion.li
          key={index}
          className={`${classes.playerItem} ${
            playerDetails.name === player.name ? classes.myPlayer : ""
          } ${player.ready ? classes.ready : ""}`}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
        >
          {player.name}
        </motion.li>
      );
    } else {
      return;
    }
  });

  return (
    <div className={mainClass}>
      <motion.div
        className={classes.colorIndicator}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
      >
        <p
          className={`${classes.activatorName} ${
            playerDetails.name === captain?.name ? classes.myPlayer : ""
          } ${captain?.ready ? classes?.ready : ""}`}
        >
          {captain?.name}
        </p>
      </motion.div>
      <ul className={classes.playersList}>{players}</ul>
    </div>
  );
};

export default TeamBuilder;
