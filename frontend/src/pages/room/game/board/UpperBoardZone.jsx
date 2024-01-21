/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import classes from "./Board.module.scss";
import { motion } from "framer-motion";
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import IconButton from "@mui/material/IconButton";
import minimapButton from "../../../../images/minimapPurple.svg";
import ReportWordModal from "../../../../components/ReportWordModal";

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
    setTimeRanOut,
    cards,
    currentCard,
    restartClock,
    role,
    currentOperatorsWordCount,
    currentOperatorsWord,
    setCurrentOperatorsWord,
    setCurrentOperatorsWordCount
  } = props;

  const [reportWordModalOpen, setReportWordModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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
  };

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
            setTimeRanOut(true);
            setCurrentOperatorsWord("");
            setCurrentOperatorsWordCount(0);
            switchColorGroup();            
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timerStarts]);

  const reportWordHandler = () => {
    if (currentOperatorsWord !== "") {
      setModalOpen(!modalOpen);
      setReportWordModalOpen(!reportWordModalOpen);
    }
  };

  return (
    <div className={classes.upperBoardZone}>
      {modalOpen && (
        <ReportWordModal
          setModalOpen={setModalOpen}
          setModalShown={setReportWordModalOpen}
          modalShown={reportWordModalOpen}
        />
      )}
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
        <div
          className={`${classes.currentAgentWordContainer} ${
            currentOperatorsWord === "" && currentOperatorsWordCount === 0
              ? classes.hide
              : ""
          }`}
        >
          <IconButton
            onClick={reportWordHandler}
            aria-label="go back"
            sx={{
              backgroundColor: "orange",
              color: "white",
              ":hover": { backgroundColor: "#c1861b" },
              scale: "0.75"
            }}
          >
            <ReportProblemOutlinedIcon />
          </IconButton>
          <p className={classes.currentAgentWord}>{currentOperatorsWord}</p>
          <p className={classes.currentAgentNumber}>
            {currentOperatorsWordCount}
          </p>
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
