import { useEffect, useState } from "react";
import Header from "../../../components/header/Header";
import classes from "./Game.module.scss";
import Board from "./board/Board";
import wordsList from "../../../words.json";

const Game = () => {
  const [pickedRandomWords, setPickedRandomWords] = useState();
  const [timer, setTimer] = useState(30);
  const [timerStarts, setTimerStarts] = useState(false);
  const [timeIsRunningOut, setTimeIsRunningOut] = useState(false);
  const [timeRanOut, setTimeRanOut] = useState(true);

  useEffect(() => {
    const randomWords = wordsList.words
      .slice(0, 25)
      .sort(() => Math.random() - 0.5);
    setPickedRandomWords(randomWords);
  }, []);

  return (
    <div className={classes.gamePage}>
      <Header />
      <Board
        randomWords={pickedRandomWords}
        timer={timer}
        setTimer={setTimer}
        timerStarts={timerStarts}
        setTimerStarts={setTimerStarts}
        timeIsRunningOut={timeIsRunningOut}
        setTimeIsRunningOut={setTimeIsRunningOut}
        timeRanOut={timeRanOut}
        setTimeRanOut={setTimeRanOut}
      />
    </div>
  );
};

export default Game;
