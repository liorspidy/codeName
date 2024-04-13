/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import classes from "./Board.module.scss";
import { motion } from "framer-motion";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import IconButton from "@mui/material/IconButton";
import minimapButton from "../../../../images/minimapPurple.svg";
import ReportWordModal from "../../../../UI/modals/ReportWordModal";

const UpperBoardZone = (props) => {
  const {
    timer,
    timerStarts,
    setTimer,
    setTimeIsRunningOut,
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
    setCurrentOperatorsWordCount,
    myDetails,
    setNextRound,
    wordsToGuess,
    switchColorGroup,
    roomDetails,
    redTeamPlayers,
    blueTeamPlayers,
  } = props;

  const [reportWordModalOpen, setReportWordModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [groupMembersLength, setGroupMembersLength] = useState(2);
  const [calculatedGroupMembersLength, setCalculatedGroupMembersLength] =
    useState(false);

  const minimapHandler = () => {
    if (role !== "agent") {
      setShowMinimap(true);
    }
  };

  useEffect(() => {
    if (myDetails && redTeamPlayers.length > 0 && blueTeamPlayers.length > 0) {
      const tempGroupMembersLength =
        myDetails.team === "red"
          ? redTeamPlayers.length - 1
          : blueTeamPlayers.length - 1;

      setGroupMembersLength(tempGroupMembersLength);
      setCalculatedGroupMembersLength(true);
    }
  }, [redTeamPlayers, blueTeamPlayers, myDetails]);

  useEffect(() => {
    // if groupMembersLength is calculated
    if (calculatedGroupMembersLength) {
      // if timer starts and lastTimePlayed exists and groupMembersLength is more than 1
      if (timerStarts && roomDetails.lastTimePlayed && groupMembersLength > 1) {
        const calculateTimeLeft = () => {
          const currentTime = Date.now();
          const lastTimePlayed = new Date(roomDetails.lastTimePlayed).getTime();
          const timeDifference = currentTime - lastTimePlayed;
          return lastTimePlayed
            ? Math.floor((30000 - timeDifference) / 1000)
            : 30;
        };

        // Set initial time left
        const initialTimeLeft = calculateTimeLeft();
        setTimer(initialTimeLeft);

        // Start the timer
        const interval = setInterval(() => {
          setTimer((prevTimer) => {
            const timeLeftInSeconds = prevTimer - 1;
            if (timeLeftInSeconds === 11) {
              setTimeIsRunningOut(true);
            }
            // If timer reaches 0
            if (timeLeftInSeconds === 0) {
              clearInterval(interval);
              restartClock();
              setTimeRanOut(true);
              if (myDetails.role === "operator") {
                setNextRound();
              }

              // If all words are guessed
              if (wordsToGuess === 0) {
                switchColorGroup();
                setCurrentOperatorsWord("");
                setCurrentOperatorsWordCount(0);
              }
            }
            return Math.max(0, timeLeftInSeconds); // Ensure timer doesn't go negative
          });
        }, 1000);

        return () => clearInterval(interval);
      } else {
        // if timer is not started or lastTimePlayed doesn't exist or groupMembersLength is less than 2
        setNextRound();
      }
    }
  }, [
    timerStarts,
    roomDetails,
    calculatedGroupMembersLength,
    groupMembersLength,
    myDetails,
  ]);

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
          roomDetails={roomDetails}
        />
      )}
      <div
        className={
          myDetails?.team === "red"
            ? `${classes.upperHUD} ${classes.red}`
            : `${classes.upperHUD} ${classes.blue}`
        }
      >
        <div
          className={
            role === "agent"
              ? `${classes.minimapButtonContainer} ${classes.agent}`
              : classes.minimapButtonContainer
          }
        >
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            onClick={minimapHandler}
            className={classes.minimapButton}
          >
            <img src={minimapButton} alt="minimap" />
          </motion.button>
        </div>
        <div
          className={`${classes.currentOperatorsWordContainer} ${
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
              scale: "0.75",
            }}
          >
            <ReportProblemOutlinedIcon />
          </IconButton>
          <p className={classes.currentOperatorsWord}>{currentOperatorsWord}</p>
          <p className={classes.currentOperatorsNumber}>
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
