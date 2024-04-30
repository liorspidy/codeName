/* eslint-disable react-hooks/exhaustive-deps */
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
import PlayersAmountError from "../../../../UI/modals/PlayersAmountError";

const Board = (props) => {
  const {
    randomWords,
    leadGroupColor,
    roomDetails,
    setRoomDetails,
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
    players,
    setPlayers,
    redTeamPlayers,
    setRedTeamPlayers,
    blueTeamPlayers,
    setBlueTeamPlayers,
    redGroupCounter,
    setRedGroupCounter,
    blueGroupCounter,
    setBlueGroupCounter,
    setMyDetails,
    minimap,
    socket,
    playersAmountError,
    setTimerStarts,
    timerStarts,
    setPlayersInDb,
    playerDetails,
    setIsLoading
  } = props;

  const [showMinimap, setShowMinimap] = useState(false);
  const [cards, setCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [newWordSetted, setNewWordSetted] = useState(false);
  const [wordLocked, setWordLocked] = useState(false);
  const [timer, setTimer] = useState(30);
  const [timeIsRunningOut, setTimeIsRunningOut] = useState(false);
  const [timeRanOut, setTimeRanOut] = useState(false);
  const [flippingCard, setFlippingCard] = useState(false);
  const [recentlyPlayedPlayer, setRecentlyPlayedPlayer] = useState(null);
  const [role, setRole] = useState("agent"); // "operator" or "agent"
  const [lastPlayerSkipped, setLastPlayerSkipped] = useState(false);

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
        setMyDetails={setMyDetails}
        socket={socket}
        flippingCard={flippingCard}
        setFlippingCard={setFlippingCard}
        recentlyPlayedPlayer={recentlyPlayedPlayer}
        setNextRound={setNextRound}
        setRecentlyPlayedPlayer={setRecentlyPlayedPlayer}
      />
    ));

    setCards(tempCards);
  }, [currentCard, randomWords, wordLocked]);

  useEffect(() => {
    if (myDetails) {
      setRole(myDetails.role);
    }
  }, [myDetails]);

  useEffect(() => {
    socket.on(
      "updateTimerPlayingGroup",
      (
        playersDetails,
        tempPlayers,
        finalRedTeamPlayers,
        finalBlueTeamPlayers,
        tempRoomDetails
      ) => {
        if (myDetails) {
          setPlayers(tempPlayers);
          setRedTeamPlayers(finalRedTeamPlayers);
          setBlueTeamPlayers(finalBlueTeamPlayers);
          setRoomDetails(tempRoomDetails);

          if (
            playersDetails.team === myDetails.team &&
            playersDetails.name !== myDetails.name
          ) {
            if (!timerStarts) {
              setTimerStarts(true);
            } else {
              restartClock();
            }
          }
        }
      }
    );

    socket.on(
      "flippingCardToAll",
      (playersDetails, currentCardIndex, currentWord) => {
        setCurrentCard({ index: currentCardIndex, word: currentWord });
        setRecentlyPlayedPlayer(playersDetails);
        setTimeRanOut(false);
        setFlippingCard(true);
      }
    );

    socket.on("skippingTurn", (playersDetails) => {
      setRecentlyPlayedPlayer(playersDetails);
      setLastPlayerSkipped(true);
    });

    return () => {
      socket.off("updateTimerPlayingGroup");
      socket.off("flippingCardToAll");
      socket.off("skippingTurn");
    };
  }, [timerStarts, myDetails, socket]);

  useEffect(() => {
    if (recentlyPlayedPlayer !== null && lastPlayerSkipped) {
      skipTurn();
      setLastPlayerSkipped(false);
    }
  }, [recentlyPlayedPlayer, lastPlayerSkipped]);

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
      console.log("Error setting next round in DB");
      throw new Error("Error setting next round in DB");
    }
  };

  const setNextTurnInDB = async () => {
    try {
      await axios.post(`http://localhost:4000/room/${roomId}/nextTurn`, {
        roomId,
      });
    } catch (err) {
      console.log("Error setting next turn in DB");
      throw new Error("Error setting next turn in DB");
    }
  };

  const switchColorGroup = async () => {
    setWordLocked(false);
    if (currentGroupColor === "red") {
      setCurrentGroupColor("blue");
    } else {
      setCurrentGroupColor("red");
    }
    if (myDetails.name === recentlyPlayedPlayer.name) {
      await setNextTurnInDB();
    }
  };

  const resetOperatorsWordInDb = async () => {
    try {
      await axios.post(
        `http://localhost:4000/room/${roomId}/setOperatorsWord`,
        {
          roomId,
          word: "",
          count: 0,
          wordsToGuess: 0,
        }
      );
    } catch (err) {
      console.log("Error resetting operators word in DB");
      throw new Error("Error resetting operators word in DB");
    }
  };

  const resetOperatorsWord = async () => {
    setCurrentOperatorsWord("");
    setCurrentOperatorsWordCount(0);
    if (myDetails.name === recentlyPlayedPlayer.name) {
      await resetOperatorsWordInDb();
    }
  };

  const setNextRound = async () => {
    setWordLocked(false);
    if (myDetails.name === recentlyPlayedPlayer.name) {
      await setNextRoundInDB();
    }
  };

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

  const skipTurn = () => {
    setWordsToGuess(0);
    switchColorGroup();
    resetOperatorsWord();
    setRecentlyPlayedPlayer(null);
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
          roomId={roomId}
          playerDetails={playerDetails}
          setPlayersInDb={setPlayersInDb}
          setIsLoading={setIsLoading}
          setRedTeamPlayers={setRedTeamPlayers}
          setBlueTeamPlayers={setBlueTeamPlayers}
          setPlayers={setPlayers}
        />
      )}
      <Minimap
        showMinimap={showMinimap}
        setShowMinimap={setShowMinimap}
        leadGroupColor={leadGroupColor}
        currentGroupColor={currentGroupColor}
        roomDetails={roomDetails}
        minimap={minimap}
      />
      {playersAmountError && !gameOver &&(
        <PlayersAmountError
          setModalOpen={setModalOpen}
          setModalShown={setOpenGameOver}
          modalShown={openGameOver}
        />
      )}
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
        players={players}
        redTeamPlayers={redTeamPlayers}
        blueTeamPlayers={blueTeamPlayers}
        setNextRound={setNextRound}
        socket={socket}
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
        setTimeRanOut={setTimeRanOut}
        currentOperatorsWord={currentOperatorsWord}
        currentOperatorsWordCount={currentOperatorsWordCount}
        setCurrentOperatorsWordCount={setCurrentOperatorsWordCount}
        setCurrentOperatorsWord={setCurrentOperatorsWord}
        setNewWordSetted={setNewWordSetted}
        currentGroupColor={currentGroupColor}
        myDetails={myDetails}
        wordsToGuess={wordsToGuess}
        skipTurn={skipTurn}
        setWordsToGuess={setWordsToGuess}
        gameOver={gameOver}
        roomDetails={roomDetails}
        setRoomDetails={setRoomDetails}
        players={players}
        redTeamPlayers={redTeamPlayers}
        blueTeamPlayers={blueTeamPlayers}
        socket={socket}
      />
      <div className={classes.backdropBoard} onClick={backdropBoardHandler} />
    </div>
  );
};

export default Board;
