/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import classes from "./Waiting.module.scss";
import { motion } from "framer-motion";

const TeamBuilder = (props) => {
  const { mainClass, teamPlayers } = props;
  const [captain, setCaptain] = useState(null);

  useEffect(() => {
    if(teamPlayers){
      setCaptain(teamPlayers[0]);
    }
  }, [teamPlayers]);

  const players = teamPlayers?.map((player, index) => {
    if (index > 0) {
      return (
        <motion.li
          key={index}
          className={classes.playerItem}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
        >
          {player}
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
        <p className={classes.activatorName}>{captain}</p>
      </motion.div>
      <ul className={classes.playersList}>{players}</ul>
    </div>
  );
};

export default TeamBuilder;
