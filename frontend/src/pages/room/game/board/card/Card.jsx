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
    setRedGroupCounter,
    setBlueGroupCounter,
    setGameOver,
    setModalOpen,
    setOpenGameOver,
    setWinnerGroup,
    wordsToGuess,
    setWordsToGuess,
    myDetails,
    switchColorGroup,
    revealedCards,
  } = props;
  const [isFlipped, setIsFlipped] = useState(true);
  const [isPressed, setIsPressed] = useState(false);
  const [cardColor, setCardColor] = useState("neutral");
  const [showCardInfo, setShowCardInfo] = useState(false);
  const { roomId } = useParams();

  const selectCardHandler = () => {
    if (!isFlipped && !wordLocked) {
      setCurrentCard({ index, word });
    }
  };

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
            console.log(card.color); 
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
    let pressTimer;

    if (isPressed) {
      pressTimer = setTimeout(() => {
        setShowCardInfo(true);
      }, 1000);
    } else {
      setShowCardInfo(false);
    }

    return () => {
      clearTimeout(pressTimer);
    };
  }, [isPressed]);

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

  const updateRevealedCards = (color) => {
    console.log(color);
    try {
      axios.post(`http://localhost:4000/room/${roomId}/updateRevealedCards`, {
        roomId,
        color,
        index,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const flipCard = async () => {
      if (timeRanOut && currentCard?.index === index && !isFlipped) {
        setIsFlipped(!isFlipped);
        setTimeRanOut(false);
        const color = await checkCard();
        setCardColor(color);
        updateRevealedCards(color);

        if (color === "red") {
          setRedGroupCounter((prev) => prev - 1);
          if (myDetails.team === "red") {
            if (wordsToGuess === 1) {
              switchColorGroup();
            }
            setWordsToGuess((prev) => prev - 1);
          } else {
            switchColorGroup();
          }
        } else if (color === "blue") {
          setBlueGroupCounter((prev) => prev - 1);
          if (myDetails.team === "blue") {
            if (wordsToGuess === 1) {
              switchColorGroup();
            }
            setWordsToGuess((prev) => prev - 1);
          } else {
            switchColorGroup();
          }
        } else if (color === "black") {
          setGameOver(true);
          setModalOpen(true);
          setOpenGameOver(true);
          if (myDetails.team === "red") {
            setWinnerGroup("blue");
          } else if (myDetails.team === "blue") {
            setWinnerGroup("red");
          }
        } else if (color === "neutral") {
          setWordsToGuess(0);
          switchColorGroup();
        }
      }
    };

    flipCard();
  }, [timeRanOut]);

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
