/* eslint-disable react/prop-types */
import classes from "./Board.module.scss";
import Card from "./card/Card";
import Minimap from "./minimap/Minimap";
import axios from "axios";
import { useEffect, useState } from "react";
import UpperBoardZone from "./UpperBoardZone";
import LowerBoardZone from "./LowerBoardZone";
import { useParams } from "react-router-dom";

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
    leadGroupColor,
    roomDetails,
    myDetails,
    currentGroupColor,
    setCurrentGroupColor,
  } = props;

  const [showMinimap, setShowMinimap] = useState(false);
  const [cards, setCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [currentOperatorsWord, setCurrentOperatorsWord] = useState("");
  const [currentOperatorsWordCount, setCurrentOperatorsWordCount] = useState(0);
  const [wordLocked, setWordLocked] = useState(false);
  const [role, setRole] = useState("agent"); // "operator" or "agent"

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
    setTimeIsRunningOut(false);
    setTimer(30);
  };

  useEffect(() => {
    if (myDetails) {
      setRole(myDetails.role);
    }
  }, [myDetails]);

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
        roomDetails={roomDetails}
      />
      <UpperBoardZone
        setShowMinimap={setShowMinimap}
        timer={timer}
        timerStarts={timerStarts}
        setTimer={setTimer}
        setTimeIsRunningOut={setTimeIsRunningOut}
        timeIsRunningOut={timeIsRunningOut}
        setTimeRanOut={setTimeRanOut}
        restartClock={restartClock}
        setWordLocked={setWordLocked}
        leadGroupColor={leadGroupColor}
        currentGroupColor={currentGroupColor}
        setCurrentGroupColor={setCurrentGroupColor}
        cards={cards}
        currentCard={currentCard}
        role={role}
        currentOperatorsWord={currentOperatorsWord}
        currentOperatorsWordCount={currentOperatorsWordCount}
        setCurrentOperatorsWordCount={setCurrentOperatorsWordCount}
        setCurrentOperatorsWord={setCurrentOperatorsWord}
        myDetails={myDetails}
      />
      <LowerBoardZone
        redGroupCounter={redGroupCounter}
        blueGroupCounter={blueGroupCounter}
        currentCard={currentCard}
        wordLocked={wordLocked}
        setWordLocked={setWordLocked}
        setTimerStarts={setTimerStarts}
        restartClock={restartClock}
        role={role}
        setCurrentOperatorsWordCount={setCurrentOperatorsWordCount}
        setCurrentOperatorsWord={setCurrentOperatorsWord}
        currentGroupColor={currentGroupColor}
        myDetails={myDetails}
      />
      <div className={classes.backdropBoard} onClick={backdropBoardHandler} />
    </div>
  );
};

export default Board;
