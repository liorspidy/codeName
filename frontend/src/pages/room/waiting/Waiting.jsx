import classes from "./Waiting.module.scss";
import SyncAltRoundedIcon from "@mui/icons-material/SyncAltRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import FaceRoundedIcon from "@mui/icons-material/FaceRounded";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import TeamBuilder from "./TeamBuilder";

const Waiting = () => {
  const [playerTitle, setPlayerTitle] = useState("מפעיל");
  const [readyButtonText, setReadyButtonText] = useState("אני מוכן");
  const [redTeamPlayers, setRedTeamPlayers] = useState(["ליאור", "דורון", "ג'רמי"]);
  const [blueTeamPlayers, setBlueTeamPlayers] = useState(["גל" , "אור" , "אליאנה"]);

  const activatorListHandler = () => {
    playerTitle === "מפעיל" ? setPlayerTitle("סוכן") : setPlayerTitle("מפעיל");
  };

  return (
    <div className={classes.waitingRoom}>
      <h1 className={classes.title}>
        ממתין לשחקנים.<span className={classes.waiting2}>.</span>
        <span className={classes.waiting3}>.</span>
      </h1>

      <div className={classes.action_buttons}>
        <motion.button
          className={classes.iconButton}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
        >
          <SyncAltRoundedIcon />
        </motion.button>
        <motion.button
          onClick={activatorListHandler}
          className={classes.iconButton}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
        >
          {playerTitle === "מפעיל" && <SupportAgentRoundedIcon />}
          {playerTitle === "סוכן" && <FaceRoundedIcon />}
        </motion.button>
      </div>

      <div className={classes.groups}>
        <TeamBuilder
          teamPlayers={redTeamPlayers}
          mainClass={classes.redGroup}
        />
        <TeamBuilder
          teamPlayers={blueTeamPlayers}
          mainClass={classes.blueGroup}
        />
      </div>

      <Link to={"123/game"} className={classes.readyButton}>
        <button>{readyButtonText}</button>
      </Link>
    </div>
  );
};

export default Waiting;
