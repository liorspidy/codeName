/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import classes from "./Board.module.scss";
import { motion } from "framer-motion";
import minimapButton from "../../../../images/minimapPurple.svg";

const UpperBoardZone = (props) => {
  const {
    currentGroupColor,
    setCurrentGroupColor,
    timer,
    timerStarts,
    setTimer,
    setTimeIsRunningOut,
    setWordLocked,
    setShowMinimap,
    timeIsRunningOut,
    cards,
    currentCard,
    restartClock
  } = props;

  const [role, setRole] = useState("operator"); // "operator" or "agent"

  const minimapHandler = () => {
    if (role !== "agent") {
      setShowMinimap(true);
    }
  };

  const switchColorGroup = () => {
    setWordLocked(false);
    if (currentGroupColor === "red") {
      setCurrentGroupColor("blue");
    } else {
      setCurrentGroupColor("red");
    }
  }

  useEffect(() => {
    if (timerStarts) {
      // Timer logic
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 11) {
            setTimeIsRunningOut(true);
          }
          if (prevTimer === 1) {
            clearInterval(interval);
            restartClock();
            switchColorGroup();
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timerStarts]);



  return (
    <div className={classes.upperBoardZone}>
      <div
        className={
          currentGroupColor === "red"
            ? `${classes.upperHUD} ${classes.red}`
            : `${classes.upperHUD} ${classes.blue}`
        }
      >
        <motion.div
          className={
            role === "agent"
              ? `${classes.minimapButton} ${classes.agent}`
              : classes.minimapButton
          }
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          onClick={minimapHandler}
        >
          <img src={minimapButton} alt="minimap" />
        </motion.div>
        <div className={classes.currentAgentWordContainer}>
          <p className={classes.currentAgentWord}>בית ספר</p>
          <p className={classes.currentAgentNumber}>2</p>
        </div>
        <div
          className={`${classes.timer} ${timerStarts ? classes.starts : ""}`}
        >
          <div
            className={
              timeIsRunningOut
                ? `${classes.innerContainer} ${classes.timeout}`
                : classes.innerContainer
            }
          >
            <span className={classes.timeLeft}>{timer}</span>
          </div>
        </div>
      </div>
      <div className={classes.board}>{cards}</div>
      <div
        className={`${classes.currentCardContainer} ${
          currentCard !== null ? classes.cardPicked : ""
        }`}
      >
        <p className={classes.currentCard}>{currentCard?.word}</p>
      </div>
    </div>
  );
};

export default UpperBoardZone;
