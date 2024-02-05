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
  } = props;

  const [isFlipped, setIsFlipped] = useState(true);
  const [cardColor, setCardColor] = useState("neutral");
  const [isPressed, setIsPressed] = useState(false);
  const [showCardInfo, setShowCardInfo] = useState(false);
  const { roomId } = useParams();

  const checkCard = async () => {
    try {
      const response = await axios.post(
        `http://localhost:4000/room/${roomId}/checkCard`,
        {
          roomId,
          index,
        }
      );
      return response.data.color;
    } catch (err) {
      console.log(err);
    }
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
    if (myDetails.team === myteam) {
      if (wordsToGuess === 1) {
        finishTurn();
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
    <div
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
    </div>
  );
};

export default Card;
