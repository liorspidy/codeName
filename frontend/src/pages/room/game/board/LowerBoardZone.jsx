/* eslint-disable react/prop-types */
import classes from "./Board.module.scss";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import { useEffect, useState } from "react";
import OperatorsModal from "../../../../UI/modals/OperatorsModal";
import Button from "../../../../UI/button/Button";
import { useParams } from "react-router-dom";
import axios from "axios";

const LowerBoardZone = (props) => {
  const {
    redGroupCounter,
    blueGroupCounter,
    currentCard,
    wordLocked,
    setWordLocked,
    setTimerStarts,
    restartClock,
    role,
    currentOperatorsWord,
    currentOperatorsWordCount,
    setCurrentOperatorsWordCount,
    setCurrentOperatorsWord,
    setNewWordSetted,
    currentGroupColor,
    myDetails,
    wordsToGuess,
    setWordsToGuess,
    gameOver,
    switchColorGroup,
    resetOperatorsWord,
    socket,
  } = props;

  const [opanOperatorsModal, setOpenOperatorsModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { roomId } = useParams();

  const updateTimerInDb = async () => {
    try {
      await axios.post(`http://localhost:4000/room/${roomId}/updateTimer`, {
        roomId,
        team: myDetails.team,
      });
    } catch (error) {
      console.error("Error updating timer in db:", error.message);
    }
  };

  const lockWordHandler = () => {
    if (currentCard !== null) {
      setWordLocked((prevState) => !prevState);
      updateTimerInDb();
      socket.emit("lockCard", roomId, currentCard, myDetails);
      if (!wordLocked) {
        setTimerStarts(true);
      } else {
        restartClock();
      }
    } else {
      restartClock();
    }
  };

  const openOperatorsModalHandler = () => {
    setModalOpen(!modalOpen);
    setOpenOperatorsModal(!opanOperatorsModal);
  };

  const skipTurnHandler = () => {
    setWordsToGuess(0);
    switchColorGroup();
    resetOperatorsWord();
  };

  useEffect(() => {
    socket.on("playerLockedCard", (playersPickedCard, playersDetails) => {
      setTimerStarts(true);
    });
  }, []);

  return (
    <div className={classes.lowerBoardZone}>
      {modalOpen && (
        <OperatorsModal
          setModalOpen={setModalOpen}
          setModalShown={setOpenOperatorsModal}
          modalShown={opanOperatorsModal}
          setCurrentOperatorsWordCount={setCurrentOperatorsWordCount}
          setCurrentOperatorsWord={setCurrentOperatorsWord}
          setNewWordSetted={setNewWordSetted}
          setWordsToGuess={setWordsToGuess}
          socket={socket}
        />
      )}
      <div className={classes.scoreTable}>
      <div
          className={`${classes.group} ${classes.blue} ${
            currentGroupColor === "blue" ? classes.glow : ""
          } ${
            wordsToGuess === 1 && currentGroupColor === "blue"
              ? classes.bonus
              : ""
          }`}
        >
          <div className={classes.cardsLeft}>{blueGroupCounter}</div>
          <span
            className={`${
              wordsToGuess === 1 && currentGroupColor === "blue"
                ? classes.bonus1
                : ""
            }`}
          ></span>
          <span
            className={`${
              wordsToGuess === 1 && currentGroupColor === "blue"
                ? classes.bonus2
                : ""
            }`}
          ></span>
          <span
            className={`${
              wordsToGuess === 1 && currentGroupColor === "blue"
                ? classes.bonus3
                : ""
            }`}
          ></span>
        </div>
        <div
          className={`${classes.group} ${classes.red} ${
            currentGroupColor === "red" ? classes.glow : ""
          } ${
            wordsToGuess === 1 && currentGroupColor === "red"
              ? classes.bonus
              : ""
          }`}
        >
          <div className={classes.cardsLeft}>{redGroupCounter}</div>
          <span
            className={`${
              wordsToGuess === 1 && currentGroupColor === "red"
                ? classes.bonus1
                : ""
            }`}
          ></span>
          <span
            className={`${
              wordsToGuess === 1 && currentGroupColor === "red"
                ? classes.bonus2
                : ""
            }`}
          ></span>
          <span
            className={`${
              wordsToGuess === 1 && currentGroupColor === "red"
                ? classes.bonus3
                : ""
            }`}
          ></span>
        </div>
      </div>
      {role === "agent" && (
        <div className={classes.actionButtons}>
          {wordsToGuess === 1 && (
            <Button classname={classes.skipTurn} onclick={skipTurnHandler}>
              <span className={classes.content}>דלג</span>
            </Button>
          )}
          <Button
            classname={classes.lockWord}
            onclick={lockWordHandler}
            disabled={
              myDetails?.team !== currentGroupColor ||
              (currentOperatorsWord === "" &&
                currentOperatorsWordCount === 0) ||
              gameOver
            }
          >
            <span className={classes.icon}>
              {wordLocked ? <LockIcon /> : <LockOpenOutlinedIcon />}
            </span>
            <span className={classes.content}>
              {wordLocked ? "בטל בחירה" : "נעל בחירה"}
            </span>
          </Button>
        </div>
      )}
      {role === "operator" && (
        <div className={classes.actionButtons}>
          <Button
            onclick={openOperatorsModalHandler}
            disabled={myDetails?.team !== currentGroupColor || gameOver}
          >
            <span className={classes.content}>הפעל סוכנים</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default LowerBoardZone;
