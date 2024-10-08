/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import classes from "./Board.module.scss";
import Card from "./card/Card";
import Minimap from "./minimap/Minimap";
import { useEffect, useRef, useState } from "react";
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
    socket,
    playersAmountError,
    setTimerStarts,
    timerStarts,
    setPlayersInDb,
    playerDetails,
    setIsLoading,
    minimap,
    siteUrl,
    soundEffectsAllowed
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
  const [highlitedCards, setHighlitedCards] = useState([]);
  const [operatorTypes, setOperatorTypes] = useState(false);
  const [winSound, setWinSound] = useState(null);
  const [loseSound, setLoseSound] = useState(null);
  const [boomSound, setBoomSound] = useState(null);
  const [gameWonSound, setGameWonSound] = useState(null);
  const [gameLostSound, setGameLostSound] = useState(null);

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
        redGroupCounter={redGroupCounter}
        setRedGroupCounter={setRedGroupCounter}
        blueGroupCounter={blueGroupCounter}
        setBlueGroupCounter={setBlueGroupCounter}
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
        setMyDetails={setMyDetails}
        socket={socket}
        flippingCard={flippingCard}
        setFlippingCard={setFlippingCard}
        recentlyPlayedPlayer={recentlyPlayedPlayer}
        setNextRound={setNextRound}
        setRecentlyPlayedPlayer={setRecentlyPlayedPlayer}
        minimap={minimap}
        players={players}
        highlitedCards={highlitedCards}
        siteUrl={siteUrl}
        setIsLoading={setIsLoading}
        soundEffectsAllowed={soundEffectsAllowed}
        winSound={winSound}
        loseSound={loseSound}
        boomSound={boomSound}
      />
    ));

    setCards(tempCards);
  }, [currentCard, randomWords, wordLocked, highlitedCards]);

  // Reference to store the debounce timer
  const debounceTimer = useRef(null);

  useEffect(() => {
    if (myDetails) {
      setRole(myDetails.role);

      const boom = new Audio("/music/boom.mp3");
      const lose = new Audio("/music/lose.mp3");
      const win = new Audio("/music/win.mp3");
      const gameWon = new Audio("/music/cheer.mp3");
      const gameLost = new Audio("/music/aww.mp3");

      setWinSound(win);
      setLoseSound(lose);
      setBoomSound(boom);
      setGameWonSound(gameWon);
      setGameLostSound(gameLost);

      win.volume = 0.5;
      lose.volume = 0.5;
      boom.volume = 0.5;
      gameWon.volume = 0.5;
      gameLost.volume = 0.5;
    }
  }, [myDetails]);

  useEffect(() => {
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

    socket.on("operatorIsTyping", () => {

      // Clear the previous timer if it exists
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Set a new timer to debounce the operatorTypes update
      debounceTimer.current = setTimeout(() => {
        setOperatorTypes(false);
      }, 1000);

      setOperatorTypes(true);
    });

    return () => {
      socket.off("flippingCardToAll");
      socket.off("skippingTurn");
    };
  }, [socket]);

  useEffect(() => {
    socket.on(
      "updateTimerPlayingGroup",
      (
        playersDetails,
        tempPlayers,
        finalRedTeamPlayers,
        finalBlueTeamPlayers,
        tempRoomDetails,
        action
      ) => {
        setPlayers(tempPlayers);
        setRedTeamPlayers(finalRedTeamPlayers);
        setBlueTeamPlayers(finalBlueTeamPlayers);
        setRoomDetails(tempRoomDetails);

        tempPlayers.forEach((player) => {
          if (player.cardIndex !== -1) {
            if (!highlitedCards.includes(player.cardIndex)) {
              setHighlitedCards([...highlitedCards, player.cardIndex]);
            }
          }
        });

        highlitedCards.forEach((cardIndex) => {
          if (!tempPlayers.find((player) => player.cardIndex === cardIndex)) {
            setHighlitedCards(
              highlitedCards.filter((index) => index !== cardIndex)
            );
          }
        });

        if (myDetails) {
          // if im in the playing group
          if (playersDetails.team === myDetails.team) {
            // if im the only one who picked a card in the playing group
            if (action === "start") {
              setTimerStarts(true);
            } else if (action === "stop") {
              restartClock();
            } else if (action === "next") {
              restartClock();
              setWordLocked(false);
              setCurrentCard(null);
            }
          }
        }
      }
    );
    return () => {
      socket.off("updateTimerPlayingGroup");
    };
  }, [myDetails, timerStarts]);

  // Highlight the cards that are picked by the players in the playing group (red or blue)
  useEffect(() => {
    if (players.length > 0) {
      players.forEach((player) => {
        if (player.cardIndex !== -1) {
          if (!highlitedCards.includes(player.cardIndex)) {
            setHighlitedCards([...highlitedCards, player.cardIndex]);
          }
        }
      });

      highlitedCards.forEach((cardIndex) => {
        if (!players.find((player) => player.cardIndex === cardIndex)) {
          setHighlitedCards(
            highlitedCards.filter((index) => index !== cardIndex)
          );
        }
      });
    }
  }, [players, highlitedCards]);

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
      await axios.post(`${siteUrl}/room/${roomId}/nextRound`, {
        roomId,
      });
    } catch (err) {
      console.log("Error setting next round in DB");
      throw new Error("Error setting next round in DB");
    }
  };

  const setNextTurnInDB = async () => {
    try {
      await axios.post(`${siteUrl}/room/${roomId}/nextTurn`, {
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
      await axios.post(`${siteUrl}/room/${roomId}/setOperatorsWord`, {
        roomId,
        word: "",
        count: 0,
        wordsToGuess: 0,
      });
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
          siteUrl={siteUrl}
          gameWonSound={gameWonSound}
          gameLostSound={gameLostSound}
        />
      )}
      <Minimap
        showMinimap={showMinimap}
        setShowMinimap={setShowMinimap}
        leadGroupColor={leadGroupColor}
        currentGroupColor={currentGroupColor}
        roomDetails={roomDetails}
      />
      {playersAmountError && !gameOver && (
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
          operatorTypes={operatorTypes}
          setOperatorTypes={setOperatorTypes}
        />
        <LowerBoardZone
          redGroupCounter={redGroupCounter}
          blueGroupCounter={blueGroupCounter}
          currentCard={currentCard}
          wordLocked={wordLocked}
          setWordLocked={setWordLocked}
          timerStarts={timerStarts}
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
          setWordsToGuess={setWordsToGuess}
          gameOver={gameOver}
          roomDetails={roomDetails}
          players={players}
          redTeamPlayers={redTeamPlayers}
          blueTeamPlayers={blueTeamPlayers}
          socket={socket}
          siteUrl={siteUrl}
          operatorTypes={operatorTypes}
          setOperatorTypes={setOperatorTypes}
        />
      <div className={classes.backdropBoard} onClick={backdropBoardHandler} />
    </div>
  );
};

export default Board;
