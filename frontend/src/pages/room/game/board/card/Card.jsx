/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import classes from "../Board.module.scss";

const Card = ({ word, index, wordLocked, setCurrentCard, currentCard }) => {
  const [isFlipped, setIsFlipped] = useState(true);
  const [isPressed, setIsPressed] = useState(false);
  const [showCardInfo, setShowCardInfo] = useState(false);

  const selectCardHandler = () => {
    if (!isFlipped && !wordLocked) {
      setCurrentCard({ index, word });
    }
  };

  const handlePress = () => {
    setIsPressed(true);
  };

  const handleRelease = () => {
    setIsPressed(false);
    setShowCardInfo(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFlipped(false);
    }, index * 100);

    return () => {
      clearTimeout(timer);
    };
  }, [index]);

  useEffect(() => {
    let pressTimer;

    if (isPressed) {
      pressTimer = setTimeout(() => {
        setIsPressed(false);
        console.log("long press activated");
        setShowCardInfo(true);
      }, 2000);
    }

    return () => {
      clearTimeout(pressTimer);
    };
  }, [isPressed]);

  return (
    <div
      key={index}
      className={`${isFlipped
        ? classes.flippedCard
        : currentCard?.index === index
          ? `${classes.card} ${classes.picked}`
          : classes.card
        } ${isPressed ? classes.overlay : ""}`}
      style={{ "--word": `"${word}"` }}
      onClick={selectCardHandler}
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      onTouchStart={handlePress}
      onTouchEnd={handleRelease}
    >
      <div className={`${classes.cardInfo} ${showCardInfo ? classes.show : ""}`} />
      <div className={classes.cardContent}>
        <span className={classes.word}>{word}</span>
      </div>
    </div>
  );
};

export default Card;
