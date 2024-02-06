/* eslint-disable react/prop-types */
import classes from "./Board.module.scss";
import Card from "./card/Card";
import Minimap from "./minimap/Minimap";
import { useEffect, useState } from "react";
import UpperBoardZone from "./UpperBoardZone";
import LowerBoardZone from "./LowerBoardZone";
import GameOverModal from "../../../../UI/modals/GameOverModal";
import axios from "axios";
import { useParams } from "react-router-dom";

const Board = (props) => {
  const {
    randomWords,
    leadGroupColor,
    roomDetails,
    myDetails,
    currentGroupColor,
    setCurrentGroupColor,
    setCurrentOperatorsWord,
    setCurrentOperatorsWordCount,
    currentOperatorsWord,
    currentOperatorsWordCount,
    setWordsToGuess,
    wordsToGuess,
    revealedCards,
    setOpenGameOver,
    openGameOver,
    gameOver,
    setGameOver,
    winnerGroup,
    setWinnerGroup,
    modalOpen,
    setModalOpen,
    redGroupCounter,
    setRedGroupCounter,
    blueGroupCounter,
    setBlueGroupCounter,
  } = props;

  const [showMinimap, setShowMinimap] = useState(false);
  const [cards, setCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [newWordSetted, setNewWordSetted] = useState(false);
  const [wordLocked, setWordLocked] = useState(false);
  const [minimap, setMinimap] = useState([]);

  const [timer, setTimer] = useState(30);
  const [timerStarts, setTimerStarts] = useState(false);
  const [timeIsRunningOut, setTimeIsRunningOut] = useState(false);
  const [timeRanOut, setTimeRanOut] = useState(false);
  const [role, setRole] = useState("agent"); // "operator" or "agent"


  const { roomId } = useParams();

  useEffect(() => {
    const tempCards = randomWords?.map((word, index) => (
      <Card
        word={word}
        index={index}
        key={index}
        wordLocked={wordLocked}
        currentCard={currentCard}
        setCurrentCard={setCurrentCard}
        timeRanOut={timeRanOut}
        setTimeRanOut={setTimeRanOut}
        redGroupCounter={redGroupCounter}
        setRedGroupCounter={setRedGroupCounter}
        blueGroupCounter={blueGroupCounter}
        setBlueGroupCounter={setBlueGroupCounter}
        setGameOver={setGameOver}
        setModalOpen={setModalOpen}
        setOpenGameOver={setOpenGameOver}
        setWinnerGroup={setWinnerGroup}
        myDetails={myDetails}
        wordsToGuess={wordsToGuess}
        setWordsToGuess={setWordsToGuess}
        switchColorGroup={switchColorGroup}
        revealedCards={revealedCards}
        setCurrentOperatorsWord={setCurrentOperatorsWord}
        setCurrentOperatorsWordCount={setCurrentOperatorsWordCount}
        resetOperatorsWord={resetOperatorsWord}
        minimap={minimap}
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

  useEffect(() => {
    if (blueGroupCounter === 0) {
      setModalOpen(true);
      setOpenGameOver(true);
      setGameOver(true);
      setWinnerGroup("blue");
    } else if (redGroupCounter === 0) {
      setModalOpen(true);
      setOpenGameOver(true);
      setGameOver(true);
      setWinnerGroup("red");
    }
  }, [blueGroupCounter, redGroupCounter]);

  const setNextRoundInDB = async () => {
    try {
      await axios.post(`http://localhost:4000/room/${roomId}/nextRound`, {
        roomId,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const setNextTurnInDB = async () => {
    try {
      await axios.post(`http://localhost:4000/room/${roomId}/nextTurn`, {
        roomId,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const switchColorGroup = () => {
    setWordLocked(false);
    if (currentGroupColor === "red") {
      setCurrentGroupColor("blue");
    } else {
      setCurrentGroupColor("red");
    }
    setNextTurnInDB();
  };

  const resetOperatorsWordInDb = async () => {
    try {
      await axios.post(`http://localhost:4000/room/${roomId}/setOperatorsWord`, {
        roomId,
        word: "",
        count: 0,
        wordsToGuess: 0
      });
    } catch (err) {
      console.log(err);
    }
  };

  const resetOperatorsWord = () => {
    setCurrentOperatorsWord("");
    setCurrentOperatorsWordCount(0);
    resetOperatorsWordInDb();
  };

  const setNextRound = () => {
    setWordLocked(false);
    setNextRoundInDB();
  };

  return (
    <div
      className={
        wordLocked
          ? `${classes.gameBoard} ${classes.wordLocked}`
          : classes.gameBoard
      }
    >
      {modalOpen && gameOver && (
        <GameOverModal
          setModalOpen={setModalOpen}
          setModalShown={setOpenGameOver}
          modalShown={openGameOver}
          winnerGroup={winnerGroup}
        />
      )}
      <Minimap
        showMinimap={showMinimap}
        setShowMinimap={setShowMinimap}
        leadGroupColor={leadGroupColor}
        currentGroupColor={currentGroupColor}
        roomDetails={roomDetails}
        setMinimap={setMinimap}
        minimap={minimap}
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
        leadGroupColor={leadGroupColor}
        cards={cards}
        currentCard={currentCard}
        role={role}
        currentOperatorsWord={currentOperatorsWord}
        currentOperatorsWordCount={currentOperatorsWordCount}
        setCurrentOperatorsWordCount={setCurrentOperatorsWordCount}
        setCurrentOperatorsWord={setCurrentOperatorsWord}
        newWordSetted={newWordSetted}
        setNewWordSetted={setNewWordSetted}
        wordsToGuess={wordsToGuess}
        setWordsToGuess={setWordsToGuess}
        myDetails={myDetails}
        switchColorGroup={switchColorGroup}
        roomDetails={roomDetails}
        setNextRound={setNextRound}
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
        currentOperatorsWord={currentOperatorsWord}
        currentOperatorsWordCount={currentOperatorsWordCount}
        setCurrentOperatorsWordCount={setCurrentOperatorsWordCount}
        setCurrentOperatorsWord={setCurrentOperatorsWord}
        setNewWordSetted={setNewWordSetted}
        currentGroupColor={currentGroupColor}
        myDetails={myDetails}
        wordsToGuess={wordsToGuess}
        setWordsToGuess={setWordsToGuess}
        gameOver={gameOver}
        switchColorGroup={switchColorGroup}
        resetOperatorsWord={resetOperatorsWord}
      />
      <div className={classes.backdropBoard} onClick={backdropBoardHandler} />
    </div>
  );
};

export default Board;
