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
    myDetails
  } = props;
  const [isFlipped, setIsFlipped] = useState(true);
  const [isPressed, setIsPressed] = useState(false);
  const [cardColor , setCardColor] = useState("neutral");
  const [showCardInfo, setShowCardInfo] = useState(false);
  const { roomId } = useParams();

  const selectCardHandler = () => {
    if (!isFlipped && !wordLocked) {
      setCurrentCard({ index, word });
    }
  };

  // const handlePress = () => {
  //   setIsPressed(true);
  // };

  // const handleRelease = () => {
  //   setIsPressed(false);
  //   setShowCardInfo(false);
  // };

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


  useEffect(() => {
    const flipCard = async () => {
      if (timeRanOut && currentCard?.index === index && !isFlipped) {
        setIsFlipped(!isFlipped);
        setTimeRanOut(false);
        const color = await checkCard();
        setCardColor(color);
        if(color === "red"){
          setRedGroupCounter((prev) => prev - 1);
        }else if(color === "blue"){
          setBlueGroupCounter((prev) => prev - 1);
        }else if(color === "black"){
          setGameOver(true);
          setModalOpen(true);
          setOpenGameOver(true);
          if(myDetails.team === "red"){
            setWinnerGroup("blue");
          }else if(myDetails.team === "blue"){
            setWinnerGroup("red");
          }
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
      // onMouseDown={handlePress}
      // onMouseUp={handleRelease}
      // onTouchStart={handlePress}
      // onTouchEnd={handleRelease}
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
