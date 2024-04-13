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
    setTimeRanOut,
    redGroupCounter,
    setRedGroupCounter,
    blueGroupCounter,
    setBlueGroupCounter,
    gameOver,
    setGameOver,
    setModalOpen,
    setOpenGameOver,
    setWinnerGroup,
    wordsToGuess,
    setWordsToGuess,
    myDetails,
    switchColorGroup,
    revealedCards,
    resetOperatorsWord,
    minimap,
    setMyDetails,
  } = props;

  const [isFlipped, setIsFlipped] = useState(true);
  const [cardColor, setCardColor] = useState("neutral");
  const [isPressed, setIsPressed] = useState(false);
  const [showCardInfo, setShowCardInfo] = useState(false);
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
      await axios.post(
        `http://localhost:4000/room/${roomId}/updateRevealedCards`,
        {
          roomId,
          color,
          index,
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const setWinnerInDb = async (winner) => {
    try {
      await axios.post(`http://localhost:4000/room/${roomId}/setWinner`, {
        roomId,
        winner,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const setScoreInDb = async (team, score) => {
    try {
      await axios.post(`http://localhost:4000/room/${roomId}/setScore`, {
        roomId,
        team,
        score,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const setWordsToGuessCountInDb = async (updatedWordsToGuessCount) => {
    try {
      await axios.post(`http://localhost:4000/room/${roomId}/setWordsToGuess`, {
        roomId,
        wordsToGuess: updatedWordsToGuessCount,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const selectCardHandler = () => {
    if (!isFlipped && !wordLocked) {
      setCurrentCard({ index, word });
    }
  };

  const finishTurn = () => {
    setWordsToGuess(0);
    setWordsToGuessCountInDb(0);
    switchColorGroup();
    resetOperatorsWord();
  };

  const checkIfItsMyCard = (myteam) => {
    // if the card is from my team
    if (myDetails.team === myteam) {
      setMyDetails((prev) => {
        return { ...prev, cardRevealed: prev.cardRevealed + 1 };
      });
      // bonus word was guessed
      if (wordsToGuess === 1) {
        finishTurn();
        // regular word was guessed
      } else {
        setWordsToGuess((prev) => prev - 1);
        setWordsToGuessCountInDb(wordsToGuess - 1);
      }
    } else {
      finishTurn();
    }
  };

  const gameOverHandler = (winnerTeam) => {
    setWinnerGroup(winnerTeam);
    if (!gameOver) {
      setWinnerInDb(winnerTeam);
    }
    setWordsToGuess(0);
    setGameOver(true);
    setModalOpen(true);
    setOpenGameOver(true);
  };

  useEffect(() => {
    const flipCard = async () => {
      if (timeRanOut && currentCard?.index === index && !isFlipped) {
        setIsFlipped(!isFlipped);
        setTimeRanOut(false);
        const color = await checkCard();
        setCardColor(color);
        updateRevealedCardsInDb(color);

        if (color === "red") {
          setRedGroupCounter((prev) => prev - 1);
          setScoreInDb("red", redGroupCounter - 1);
          if (redGroupCounter > 1) {
            checkIfItsMyCard("red");
          } else {
            gameOverHandler("red");
          }
        } else if (color === "blue") {
          setBlueGroupCounter((prev) => prev - 1);
          setScoreInDb("blue", blueGroupCounter - 1);
          if (blueGroupCounter > 1) {
            checkIfItsMyCard("blue");
          } else {
            gameOverHandler("blue");
          }
        } else if (color === "black") {
          if (myDetails.team === "red") {
            gameOverHandler("blue");
          } else if (myDetails.team === "blue") {
            gameOverHandler("red");
          }
        } else if (color === "neutral") {
          finishTurn();
        }
      }
    };

    flipCard();
  }, [timeRanOut]);

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
      <div className={classes.cardContent}>
        <span className={classes.word}>{word}</span>
      </div>
    </button>
  );
};

export default Card;
