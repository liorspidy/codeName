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

const Game = () => {
  const [pickedRandomWords, setPickedRandomWords] = useState([]);
  const [roomDetails, setRoomDetails] = useState(null);
  const [myDetails, setMyDetails] = useState(null);
  const [currentGroupColor, setCurrentGroupColor] = useState("red");
  const [leadGroupColor, setLeadGroupColor] = useState("red");
  const [currentOperatorsWord, setCurrentOperatorsWord] = useState("");
  const [currentOperatorsWordCount, setCurrentOperatorsWordCount] = useState(0);
  const [wordsToGuess, setWordsToGuess] = useState(0);
  const [revealedCards , setRevealedCards] = useState([]);

  const playerDetails = sessionStorage.getItem("token")
    ? jwtDecode(sessionStorage.getItem("token"))
    : null;

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

  useEffect(() => {
    fetchRoomDetails()
      .then((room) => {
        setRoomDetails(room);

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
        if (room.turn !== "") {
          setLeadGroupColor(room.turn);
          setCurrentGroupColor(room.turn);
        } else {
          setLeadGroupColor(randomLeadGroupColor);
          setCurrentGroupColor(randomLeadGroupColor);
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
        };
        setMyDetails(fullPlayerDetails);

        setCurrentOperatorsWord(room.currentWord);
        setCurrentOperatorsWordCount(room.currentWordCount);
        setWordsToGuess(room.wordsToGuess);
        setRevealedCards(room.revealedCards);
      })
      .catch((err) => {
        console.log(err);
        navigate("/404");
      });
  }, []);

  return (
    <div className={classes.gamePage}>
      <Header />
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
      />
    </div>
  );
};

export default Game;
