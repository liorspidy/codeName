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
  } = props;

  const [showMinimap, setShowMinimap] = useState(false);
  const [cards, setCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [newWordSetted, setNewWordSetted] = useState(false);
  const [wordLocked, setWordLocked] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winnerGroup, setWinnerGroup] = useState("");

  const [timer, setTimer] = useState(30);
  const [timerStarts, setTimerStarts] = useState(false);
  const [timeIsRunningOut, setTimeIsRunningOut] = useState(false);
  const [timeRanOut, setTimeRanOut] = useState(false);
  const [role, setRole] = useState("agent"); // "operator" or "agent"
  const [modalOpen, setModalOpen] = useState(false);
  const [openGameOver, setOpenGameOver] = useState(false);

  const [redGroupCounter, setRedGroupCounter] = useState(
    leadGroupColor === "red" ? 9 : 8
  );
  const [blueGroupCounter, setBlueGroupCounter] = useState(
    leadGroupColor === "blue" ? 9 : 8
  );

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
        setRedGroupCounter={setRedGroupCounter}
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
        setWordLocked={setWordLocked}
        setNextRoundInDB={setNextRoundInDB}
        roomDetails={roomDetails}
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
        setNewWordSetted={setNewWordSetted}
        currentGroupColor={currentGroupColor}
        myDetails={myDetails}
        setWordsToGuess={setWordsToGuess}
      />
      <div className={classes.backdropBoard} onClick={backdropBoardHandler} />
    </div>
  );
};

export default Board;
