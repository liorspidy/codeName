/* eslint-disable react/prop-types */
import classes from "./Board.module.scss";
import { motion } from "framer-motion";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";

const LowerBoardZone = (props) => {
  const {
    redGroupCounter,
    blueGroupCounter,
    currentCard,
    wordLocked,
    setWordLocked,
    setTimerStarts,
    restartClock
  } = props;

  const lockWordHandler = () => {
    if (currentCard !== null) {
      setWordLocked((prevState) => !prevState);
      if (!wordLocked) {
        setTimerStarts(true);
      } else {
        restartClock();
      }
    } else {
      restartClock();
    }
  };

  return (
    <div className={classes.lowerBoardZone}>
      <div className={classes.scoreTable}>
        <div className={`${classes.group} ${classes.red}`}>
          <div className={classes.cardsLeft}>{redGroupCounter}</div>
        </div>
        <div className={`${classes.group} ${classes.blue}`}>
          <div className={classes.cardsLeft}>{blueGroupCounter}</div>
        </div>
      </div>
      <div className={classes.actionButtons}>
        <motion.button
          className={classes.lockWord}
          onClick={lockWordHandler}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
        >
          <span className={classes.icon}>
            {wordLocked ? <LockIcon /> : <LockOpenOutlinedIcon />}
          </span>
          <span className={classes.content}>
            {wordLocked ? "בטל בחירה" : "נעל בחירה"}
          </span>
        </motion.button>
      </div>
    </div>
  );
};

export default LowerBoardZone;
