/* eslint-disable react/prop-types */
import classes from "./Board.module.scss";
import Card from "./card/Card";
import Minimap from "./minimap/Minimap";
import minimapButton from "../../../../images/minimapPurple.svg";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import { useEffect, useState } from "react";

const Board = ({ randomWords }) => {
  const [showMinimap, setShowMinimap] = useState(false);
  const [cards, setCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [timer, setTimer] = useState(30);
  const [timeIsRunningOut, setTimeIsRunningOut] = useState(false);
  const [timeRanOut, setTimeRanOut] = useState(false);
  const [wordLocked, setWordLocked] = useState(false);
  const [timerStarts, setTimerStarts] = useState(false);
  const [role, setRole] = useState("operator");
  const [groupColor , setGroupColor] = useState("red");

  useEffect(() => {
    const tempCards = randomWords?.map((word, index) => (
      <Card
        word={word}
        index={index}
        key={index}
        wordLocked={wordLocked}
        currentCard={currentCard}
        setCurrentCard={setCurrentCard}
      />
    ));

    setCards(tempCards);
  }, [currentCard, randomWords, wordLocked]);

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
            setTimeIsRunningOut(false);
            setTimeRanOut(true);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timerStarts]);

  const backdropBoardHandler = () => {
    if (!wordLocked) {
      setCurrentCard(null);
      setShowMinimap(false);
    }
  };

  const minimapHandler = () => {
    if (role !== "agent") {
      setShowMinimap(true);
    }
  };

  const lockWordHandler = () => {
    setWordLocked((prevState) => !prevState);
    setTimerStarts(true);
  };

  return (
    <div
      className={
        wordLocked
          ? `${classes.gameBoard} ${classes.wordLocked}`
          : classes.gameBoard
      }
    >
      <Minimap showMinimap={showMinimap} setShowMinimap={setShowMinimap} groupColor={groupColor}/>
      <div className={classes.upperBoardZone}>
        <div className={groupColor === "red" ? `${classes.upperHUD} ${classes.red}` : `${classes.upperHUD} ${classes.blue}`}>
          <div
            className={
              role === "agent"
                ? `${classes.minimapButton} ${classes.agent}`
                : classes.minimapButton
            }
          >
            <img src={minimapButton} alt="minimap" onClick={minimapHandler} />
          </div>
          <div className={classes.currentAgentWordContainer}>
            <p className={classes.currentAgentWord}>בית ספר</p>
            <p className={classes.currentAgentNumber}>2</p>
          </div>
          <div className={classes.timer}>
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
        <div className={classes.currentCardContainer}>
          <p className={classes.currentCard}>{currentCard?.word}</p>
        </div>
      </div>
      <div className={classes.lowerBoardZone}>
        <div className={classes.scoreTable}>
          <div className={`${classes.group} ${classes.red}`}>
            <div className={classes.cardsLeft}>
                8
            </div>
          </div>
          <div className={`${classes.group} ${classes.blue}`}>
            <div className={classes.cardsLeft}>
                9
            </div>
          </div>
        </div>
        <div className={classes.actionButtons}>
          <button className={classes.lockWord} onClick={lockWordHandler}>
            <span className={classes.icon}>
              {wordLocked ? <LockIcon /> : <LockOpenOutlinedIcon />}
            </span>
            <span className={classes.content}>{wordLocked ? "בטל בחירה" : "נעל בחירה" }</span>
          </button>
        </div>
      </div>
      <div className={classes.backdropBoard} onClick={backdropBoardHandler} />
    </div>
  );
};

export default Board;
