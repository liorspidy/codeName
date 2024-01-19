/* eslint-disable react/prop-types */
import classes from "./Board.module.scss";
import Card from "./card/Card";
import Minimap from "./minimap/Minimap";

import { useEffect, useState } from "react";
import UpperBoardZone from "./UpperBoardZone";
import LowerBoardZone from "./LowerBoardZone";

const Board = (props) => {
  const {
    randomWords,
    timer,
    setTimer,
    timerStarts,
    setTimerStarts,
    timeIsRunningOut,
    setTimeIsRunningOut,
    timeRanOut,
    setTimeRanOut,
  } = props;

  const [showMinimap, setShowMinimap] = useState(false);
  const [cards, setCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [wordLocked, setWordLocked] = useState(false);
  const [leadGroupColor, setLeadGroupColor] = useState("red");
  const [currentGroupColor, setCurrentGroupColor] = useState("red");
  const [redGroupCounter, setRedGroupCounter] = useState(
    leadGroupColor === "red" ? 9 : 8
  );
  const [blueGroupCounter, setBlueGroupCounter] = useState(
    leadGroupColor === "blue" ? 9 : 8
  );

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

  const backdropBoardHandler = () => {
    if (!wordLocked) {
      setCurrentCard(null);
      setShowMinimap(false);
    }
  };

  const restartClock = () => {
    setTimerStarts(false);
    setTimeRanOut(false);
    setTimeIsRunningOut(false);
    setTimer(30);
  };


  return (
    <div
      className={
        wordLocked
          ? `${classes.gameBoard} ${classes.wordLocked}`
          : classes.gameBoard
      }
    >
      <Minimap
        showMinimap={showMinimap}
        setShowMinimap={setShowMinimap}
        leadGroupColor={leadGroupColor}
        currentGroupColor={currentGroupColor}
      />
      <UpperBoardZone
        setShowMinimap={setShowMinimap}
        timer={timer}
        timerStarts={timerStarts}
        setTimer={setTimer}
        setTimeIsRunningOut={setTimeIsRunningOut}
        setWordLocked={setWordLocked}
        leadGroupColor={leadGroupColor}
        currentGroupColor={currentGroupColor}
        setCurrentGroupColor={setCurrentGroupColor}
        timeIsRunningOut={timeIsRunningOut}
        cards={cards}
        currentCard={currentCard}
        restartClock={restartClock}
      />
      <LowerBoardZone
        redGroupCounter={redGroupCounter}
        blueGroupCounter={blueGroupCounter}
        currentCard={currentCard}
        wordLocked={wordLocked}
        setWordLocked={setWordLocked}
        setTimerStarts={setTimerStarts}
        restartClock={restartClock}
      />
      <div className={classes.backdropBoard} onClick={backdropBoardHandler} />
    </div>
  );
};

export default Board;
