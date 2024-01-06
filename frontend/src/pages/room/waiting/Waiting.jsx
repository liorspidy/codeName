import classes from "./Waiting.module.scss";
import activatorWhite from "../../../images/activator_white.svg";
import activatorGreen from "../../../images/activator_green.svg";
import SyncAltRoundedIcon from "@mui/icons-material/SyncAltRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import FaceRoundedIcon from '@mui/icons-material/FaceRounded';
import { useState } from "react";

const Waiting = () => {
  const [playerTitle, setPlayerTitle] = useState("מפעיל");
  const [blueActivatorState, setBlueActivatorState] = useState(false);
  const [redActivatorState, setRedActivatorState] = useState(false);
  const [readyButtonText, setReadyButtonText] = useState("אני מוכן");
  const activatorListHandler = () => {
    playerTitle === "מפעיל" ? setPlayerTitle("סוכן") : setPlayerTitle("מפעיל");
  };

  const imReadyHandler = () => {
    console.log("im ready");
    setBlueActivatorState(() => !blueActivatorState);
    setRedActivatorState(() => !redActivatorState);
    setReadyButtonText(() =>
      readyButtonText === "אני מוכן" ? "בעצם לא.." : "אני מוכן"
    );
  };

  return (
    <div className={classes.waitingRoom}>
      <h1 className={classes.title}>
        ממתין לשחקנים.<span className={classes.waiting2}>.</span>
        <span className={classes.waiting3}>.</span>
      </h1>

      <div className={classes.action_buttons}>
        <button className={classes.iconButton}>
          <SyncAltRoundedIcon />
        </button>
        <button onClick={activatorListHandler} className={classes.iconButton}>
          { playerTitle === "מפעיל" && <SupportAgentRoundedIcon />}
          { playerTitle === "סוכן" && <FaceRoundedIcon />}
        </button>
      </div>

      <div className={classes.groups}>
        <div className={classes.redGroup}>
          <div className={classes.colorIndicator}>
            <p className={classes.activator_name}>ליאור פרידמן</p>
            <img
              src={redActivatorState ? activatorGreen : activatorWhite}
              alt="activator"
            />
          </div>
          <ul>
            <li>דורון דוד</li>
            <li>ג'רמי קומרוב</li>
          </ul>
        </div>
        <div className={classes.blueGroup}>
          <div className={classes.colorIndicator}>
            <p className={classes.activator_name}>אור בשן</p>
            <img
              src={blueActivatorState ? activatorGreen : activatorWhite}
              alt="activator"
            />
          </div>
          <ul>
            <li>גל מזרחי</li>
            <li>אור טורי</li>
          </ul>
        </div>
      </div>

      <div className={classes.action_buttons}>
        <button onClick={imReadyHandler}>{readyButtonText}</button>
      </div>
    </div>
  );
};

export default Waiting;
