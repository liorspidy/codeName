/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import classes from "../Board.module.scss";
import axios from "axios";
import { useParams } from "react-router-dom";

const Card = (props) => {
  const {
    word,
    index,
    wordLocked,
    setCurrentCard,
    currentCard,
    timeRanOut,
    redGroupCounter,
    setRedGroupCounter,
    blueGroupCounter,
    setBlueGroupCounter,
    gameOver,
    setModalOpen,
    setOpenGameOver,
    setWinnerGroup,
    wordsToGuess,
    setWordsToGuess,
    myDetails,
    switchColorGroup,
    revealedCards,
    resetOperatorsWord,
    setMyDetails,
    socket,
    minimap,
    flippingCard,
    setFlippingCard,
    recentlyPlayedPlayer,
    setNextRound,
    setRecentlyPlayedPlayer,
    players,
    highlitedCards,
    siteUrl,
    setIsLoading,
    soundEffectsAllowed,
    winSound,
    loseSound,
    boomSound,
  } = props;

  const [isFlipped, setIsFlipped] = useState(true);
  const [cardColor, setCardColor] = useState("neutral");
  const [isPressed, setIsPressed] = useState(false);
  const [showCardInfo, setShowCardInfo] = useState(false);
  const [highlightedCard, setHighlightedCard] = useState(false);
  const { roomId } = useParams();

  const checkCard = () => {
    const checkInMap = (colorMap) => {
      let tempColor = "";
      colorMap.forEach((color) => {
        if (minimap[index].props.subclass.includes(color)) {
          tempColor = color;
        }
      });
      return tempColor;
    };

    const cardsColor = checkInMap(["red", "blue", "black", "neutral"]);
    return cardsColor;
  };

  const updateRevealedCardsInDb = async (color) => {
    try {
      setIsLoading(true);
      await axios.post(`${siteUrl}/room/${roomId}/updateRevealedCards`, {
        roomId,
        color,
        index,
      });
    } catch (err) {
      console.log(err);
      throw new Error("Could not update the revealed cards");
    } finally {
      setIsLoading(false);
    }
  };

  const setScoreInDb = async (team, score) => {
    try {
      setIsLoading(true);
      await axios.post(`${siteUrl}/room/${roomId}/setScore`, {
        roomId,
        team,
        score,
      });
    } catch (err) {
      console.log(err);
      throw new Error("Could not set the score");
    } finally {
      setIsLoading(false);
    }
  };

  const setWinnerInDb = async (winner) => {
    try {
      setIsLoading(true);
      await axios.post(`${siteUrl}/room/${roomId}/setWinner`, {
        roomId,
        winner,
      });
      socket.emit("gameOver", roomId, winner, recentlyPlayedPlayer);
    } catch (err) {
      console.log(err);
      throw new Error("Could not set the winner");
    } finally {
      setIsLoading(false);
    }
  };

  const setWordsToGuessCountInDb = async (updatedWordsToGuessCount) => {
    try {
      setIsLoading(true);
      await axios.post(`${siteUrl}/room/${roomId}/setWordsToGuess`, {
        roomId,
        wordsToGuess: updatedWordsToGuessCount,
      });
    } catch (err) {
      console.log(err);
      throw new Error("Could not set the words to guess count");
    } finally {
      setIsLoading(false);
    }
  };

  const selectCardHandler = () => {
    if (!isFlipped && !wordLocked) {
      setCurrentCard({ index, word });
    }
  };

  const finishTurn = () => {
    setWordsToGuess(0);
    if (myDetails.name === recentlyPlayedPlayer.name) {
      setWordsToGuessCountInDb(0);
    }
    switchColorGroup();
    resetOperatorsWord();
  };

  const checkIfItsMyCard = (myteam) => {
    // if the card is from my team and I guessed it correctly
    if (recentlyPlayedPlayer.team === myteam) {
      if (myDetails.name === recentlyPlayedPlayer.name) {
        setMyDetails((prev) => {
          return { ...prev, cardRevealed: prev.cardRevealed + 1 };
        });
      }
      // if bonus word was guessed
      if (wordsToGuess === 1) {
        finishTurn();

        // if regular word was guessed
      } else {
        setWordsToGuess((prev) => prev - 1);
        if (myDetails.name === recentlyPlayedPlayer.name) {
          setWordsToGuessCountInDb(wordsToGuess - 1);
        }
      }

      if (soundEffectsAllowed) {
        winSound.play();
      }
    } else {
      if (soundEffectsAllowed) {
        loseSound.play();
      }

      finishTurn();
    }
  };

  const gameOverHandler = async (winnerTeam) => {
    setWinnerGroup(winnerTeam);
    setWordsToGuess(0);
    setModalOpen(true);
    setOpenGameOver(true);
    if (!gameOver) {
      if (myDetails.name === recentlyPlayedPlayer.name) {
        await setWinnerInDb(winnerTeam);
      }
    }
  };

  const flipCard = async () => {
    if (currentCard.index === index && !isFlipped) {
      setFlippingCard(false);
      setIsFlipped(!isFlipped);
      const color = checkCard();
      setCardColor(color);

      // if the card is black
      if (color === "black") {
        if (soundEffectsAllowed) {
          boomSound.play();
        }
        if (recentlyPlayedPlayer.team === "red") {
          await gameOverHandler("blue");
        } else {
          await gameOverHandler("red");
        }

        // if the card is red or blue
      } else if (color === "red") {
        setRedGroupCounter((prev) => prev - 1);
        if (redGroupCounter > 1) {
          checkIfItsMyCard("red");
        } else {
          await gameOverHandler("red");
        }
      } else if (color === "blue") {
        setBlueGroupCounter((prev) => prev - 1);
        if (blueGroupCounter > 1) {
          checkIfItsMyCard("blue");
        } else {
          await gameOverHandler("blue");
        }

        // if the card is neutral
      } else if (color === "neutral") {
        if (soundEffectsAllowed) {
          loseSound.play();
        }
        finishTurn();
      }

      if (myDetails.name === recentlyPlayedPlayer.name) {
        await updateRevealedCardsInDb(color);
        if (color === "red") {
          await setScoreInDb("red", redGroupCounter - 1);
        } else if (color === "blue") {
          await setScoreInDb("blue", blueGroupCounter - 1);
        }
      }
    }

    setRecentlyPlayedPlayer(null);
    setNextRound();
    setCurrentCard(null);
  };

  useEffect(() => {
    if (
      index !== null &&
      currentCard !== undefined &&
      currentCard?.index === index &&
      !isFlipped
    ) {
      if (myDetails && index !== null && word) {
        if (timeRanOut) {
          socket.emit("flipCard", roomId, myDetails, index, word);
        }
        if (flippingCard) {
          flipCard();
        }
      }
    }
  }, [
    timeRanOut,
    myDetails,
    index,
    word,
    currentCard,
    isFlipped,
    flippingCard,
  ]);

  // flip the cards after the timer
  useEffect(() => {
    const revealCardAfterTimer = () => {
      setIsFlipped(false);
    };

    const timer = setTimeout(revealCardAfterTimer, index * 100);

    return () => {
      clearTimeout(timer);
    };
  }, [index]);

  // flip the already revealed cards
  useEffect(() => {
    const flipCardIfRevealed = () => {
      if (!isFlipped) {
        revealedCards.forEach((card) => {
          if (card.index === index) {
            setIsFlipped(true);
            setCardColor(card.color);
          }
        });
      }
    };

    const timer = setTimeout(flipCardIfRevealed, 600);

    return () => {
      clearTimeout(timer);
    };
  }, [index, isFlipped, revealedCards]);

  useEffect(() => {
    if (highlitedCards.find((cardIndex) => cardIndex === index) !== undefined) {
      setHighlightedCard(true);
    } else {
      setHighlightedCard(false);
    }
  }, [highlitedCards]);

  // useEffect(() => {
  //   let pressTimer;

  //   if (isPressed) {
  //     pressTimer = setTimeout(() => {
  //       setShowCardInfo(true);
  //     }, 1000);
  //   } else {
  //     setShowCardInfo(false);
  //   }

  //   return () => {
  //     clearTimeout(pressTimer);
  //   };
  // }, [isPressed]);

  return (
    <button
      key={index}
      className={`${
        isFlipped
          ? classes.flippedCard
          : currentCard?.index === index
          ? `${classes.card} ${classes.picked}`
          : classes.card
      } ${`${classes[cardColor]}`} ${isPressed ? classes.overlay : ""}`}
      style={{ "--word": `"${word}"` }}
      onClick={selectCardHandler}
    >
      <div
        className={`${classes.cardInfo} ${showCardInfo ? classes.show : ""}`}
      />
      <div
        className={`${classes.cardContent} ${
          highlightedCard ? `${classes.highlited}` : ""
        } `}
      >
        <span className={classes.word}>{word}</span>
      </div>
    </button>
  );
};

export default Card;
