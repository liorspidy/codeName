import { useEffect, useState } from "react";
import Header from "../../../components/header/Header";
import classes from "./Game.module.scss";
import Board from "./board/Board";
import wordsList from "../../../words.json";

const Game = () => {
  const [pickedRandomWords, setPickedRandomWords] = useState();

  useEffect(() => {
    const randomWords = wordsList.words
      .slice(0, 25)
      .sort(() => Math.random() - 0.5);
    setPickedRandomWords(randomWords);
  }, []);

  return (
    <div className={classes.gamePage}>
      <Header />
      <Board randomWords={pickedRandomWords} />
    </div>
  );
};

export default Game;
