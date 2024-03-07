/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Header from "../../../components/header/Header";
import classes from "./Game.module.scss";
import Board from "./board/Board";
import wordsList from "../../../words.json";
import axios from "axios";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Game = (props) => {
  const [roomName, setRoomName] = useState("");
  const [pickedRandomWords, setPickedRandomWords] = useState([]);
  const [roomDetails, setRoomDetails] = useState(null);
  const [myDetails, setMyDetails] = useState(null);
  const [currentGroupColor, setCurrentGroupColor] = useState("red");
  const [leadGroupColor, setLeadGroupColor] = useState("red");
  const [currentOperatorsWord, setCurrentOperatorsWord] = useState("");
  const [currentOperatorsWordCount, setCurrentOperatorsWordCount] = useState(0);
  const [wordsToGuess, setWordsToGuess] = useState(0);
  const [revealedCards, setRevealedCards] = useState([]);
  const [openGameOver, setOpenGameOver] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winnerGroup, setWinnerGroup] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [usersScoreWasSet, setUsersScoreWasSet] = useState(false);
  const [redGroupCounter, setRedGroupCounter] = useState(
    leadGroupColor === "red" ? 9 : 8
  );
  const [blueGroupCounter, setBlueGroupCounter] = useState(
    leadGroupColor === "blue" ? 9 : 8
  );

  const playerDetails = sessionStorage.getItem("token")
    ? jwtDecode(sessionStorage.getItem("token"))
    : null;

    const { socket, isConnected } = props;

  const { roomId } = useParams();
  let navigate = useNavigate();

  const fetchRoomDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/room/${roomId}/getRoom`
      );
      const room = response.data;
      return room;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  const setCardsAndTurnInDb = async (
    roomDetails,
    pickedRandomWords,
    leadGroupColor
  ) => {
    try {
      // Only set cards in the database if roomDetails is not null and roomDetails.cards is not already full
      if (roomDetails && roomDetails.cards.length < 25) {
        const setCardsPromise = axios.post(
          `http://localhost:4000/room/${roomId}/setCards`,
          {
            roomId,
            cards: pickedRandomWords,
          }
        );

        const setTurnPromise = axios.post(
          `http://localhost:4000/room/${roomId}/setTurn`,
          {
            roomId,
            turn: leadGroupColor,
          }
        );

        await Promise.all([setCardsPromise, setTurnPromise]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setStatusInDb = async (status) => {
    try {
      await axios.post(`http://localhost:4000/room/${roomId}/setStatus`, {
        roomId,
        status,
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

  const setUserScoreInDb = async (winnigTeam) => {
    try {
      await axios.post(`http://localhost:4000/room/${roomId}/setUsersScore`, {
        roomId,
        winnigTeam,
        scoreToAdd: 50,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [socket]);

  useEffect(() => {
    fetchRoomDetails()
      .then((room) => {
        // set unique cards
        const uniqueRandomWords = [];

        while (uniqueRandomWords.length < 25) {
          const randomWord =
            wordsList.words[Math.floor(Math.random() * wordsList.words.length)];

          if (!uniqueRandomWords.includes(randomWord)) {
            uniqueRandomWords.push(randomWord);
          }
        }

        setPickedRandomWords(
          room.cards.length > 0 ? room.cards : uniqueRandomWords
        );

        const randomLeadGroupColor = Math.random() < 0.5 ? "red" : "blue";

        if (room.turn === "") {
          setLeadGroupColor(randomLeadGroupColor);
          setCurrentGroupColor(randomLeadGroupColor);
        } else {
          setLeadGroupColor(room.turn);
          setCurrentGroupColor(room.turn);
        }

        setRedGroupCounter(room.redScore);
        setBlueGroupCounter(room.blueScore);

        if (room.round === 1 && room.redScore === 0 && room.blueScore === 0) {
          if (randomLeadGroupColor === "red") {
            setRedGroupCounter(9);
            setScoreInDb("red", 9);
            setBlueGroupCounter(8);
            setScoreInDb("blue", 8);
          } else if (randomLeadGroupColor === "blue") {
            setBlueGroupCounter(9);
            setScoreInDb("blue", 9);
            setRedGroupCounter(8);
            setScoreInDb("red", 8);
          }
        }

        const leadColorToPass =
          room.turn !== "" ? room.turn : randomLeadGroupColor;

        setCardsAndTurnInDb(room, uniqueRandomWords, leadColorToPass);

        const myName = playerDetails.name;
        const myTeam = room.blueTeam.includes(playerDetails.name)
          ? "blue"
          : "red";
        const myRole =
          myTeam === "red"
            ? room.redTeam[0] === myName
              ? "operator"
              : "agent"
            : room.blueTeam[0] === myName
            ? "operator"
            : "agent";

        const fullPlayerDetails = {
          name: myName,
          team: myTeam,
          role: myRole,
          cardRevealed: 0,
        };
        setRoomDetails(room);
        setRoomName(room.name);
        setMyDetails(fullPlayerDetails);
        setCurrentOperatorsWord(room.currentWord);
        setCurrentOperatorsWordCount(room.currentWordCount);
        setWordsToGuess(room.wordsToGuess);
        setRevealedCards(room.revealedCards);
        setUsersScoreWasSet(room.usersScoreWasSet);

        if (room.status === "finished") {
          setOpenGameOver(true);
          setGameOver(true);
          setModalOpen(true);
          setWinnerGroup(room.winner);
        }

        if (room.status === "waiting") {
          setStatusInDb("playing");
        }
      })
      .catch((err) => {
        console.log(err);
        navigate("/404");
      });
  }, []);

  // Set the user score in the database when the game is over
  useEffect(() => {
    if (gameOver && !usersScoreWasSet) {
      if (winnerGroup === "red") {
        setUserScoreInDb(roomDetails.redTeam);
      } else if (winnerGroup === "blue") {
        setUserScoreInDb(roomDetails.blueTeam);
      }
      setUsersScoreWasSet(true);
    }
  }, [gameOver]);

  return (
    <div className={classes.gamePage}>
      <Header roomName={roomName} roomId={roomId} isConnected={isConnected}/>
      <Board
        randomWords={pickedRandomWords}
        leadGroupColor={leadGroupColor}
        roomDetails={roomDetails}
        myDetails={myDetails}
        setCurrentGroupColor={setCurrentGroupColor}
        currentGroupColor={currentGroupColor}
        setCurrentOperatorsWord={setCurrentOperatorsWord}
        setCurrentOperatorsWordCount={setCurrentOperatorsWordCount}
        currentOperatorsWord={currentOperatorsWord}
        currentOperatorsWordCount={currentOperatorsWordCount}
        setWordsToGuess={setWordsToGuess}
        wordsToGuess={wordsToGuess}
        revealedCards={revealedCards}
        setOpenGameOver={setOpenGameOver}
        openGameOver={openGameOver}
        gameOver={gameOver}
        setGameOver={setGameOver}
        winnerGroup={winnerGroup}
        setWinnerGroup={setWinnerGroup}
        setModalOpen={setModalOpen}
        modalOpen={modalOpen}
        redGroupCounter={redGroupCounter}
        setRedGroupCounter={setRedGroupCounter}
        blueGroupCounter={blueGroupCounter}
        setBlueGroupCounter={setBlueGroupCounter}
        setMyDetails={setMyDetails}
      />
    </div>
  );
};

export default Game;
