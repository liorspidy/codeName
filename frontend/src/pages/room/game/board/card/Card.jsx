/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import classes from "../Board.module.scss";

const Card = ({ word, index, wordLocked , setCurrentCard, currentCard }) => {
  const [isFlipped, setIsFlipped] = useState(true);

  const selectCardHandler = () => {
    if (!isFlipped && !wordLocked) {
      setCurrentCard({ index, word });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFlipped(false);
    }, index * 100);

    return () => {
      clearTimeout(timer);
    };
  }, [index]);

  return (
    <div
      key={index}
      className={`${
        isFlipped
          ? classes.flippedCard
          : currentCard?.index === index
          ? `${classes.card} ${classes.picked}`
          : classes.card
      }`}
      style={{ "--word": `"${word}"` }}
      onClick={selectCardHandler}
    >
      <div className={classes.cardContent}>
        <span className={classes.word}>{word}</span>
      </div>
    </div>
  );
};

export default Card;
