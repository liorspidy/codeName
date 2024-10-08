/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Header from "../../../components/header/Header";
import classes from "./Game.module.scss";
import Board from "./board/Board";
import axios from "axios";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Loader from "../../../UI/loader/Loader";

const Game = (props) => {
  const [roomName, setRoomName] = useState("");
  const [pickedRandomWords, setPickedRandomWords] = useState([]);
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
  const [timerStarts, setTimerStarts] = useState(false);

  const [redGroupCounter, setRedGroupCounter] = useState(
    leadGroupColor === "red" ? 9 : 8
  );
  const [blueGroupCounter, setBlueGroupCounter] = useState(
    leadGroupColor === "blue" ? 9 : 8
  );

  const playerDetails = sessionStorage.getItem("token")
    ? jwtDecode(sessionStorage.getItem("token"))
    : null;

  const {
    socket,
    isConnected,
    setIsConnected,
    setPlayersInDb,
    setIsGoingBack,
    isGoingBack,
    uniqueRandomWords,
    randomLeadGroupColor,
    roomDetails,
    setRoomDetails,
    playersAmountError,
    setPlayersAmountError,
    players,
    setPlayers,
    redTeamPlayers,
    setRedTeamPlayers,
    blueTeamPlayers,
    setBlueTeamPlayers,
    minimap,
    setMinimap,
    siteUrl,
    setIsLoading,
    isLoading,
    soundEffectsAllowed,
    notificationsNumber, 
    setNotificationsNumber,
    openChat,
    setOpenChat,
  } = props;

  const { roomId } = useParams();
  let navigate = useNavigate();

  const fetchRoomDetails = async () => {
    try {
      const response = await axios.get(
        `${siteUrl}/room/${roomId}/getRoom`
      );
      const room = response.data;
      return room;
    } catch (err) {
      console.log(err);
      throw new Error("Room not found");
    }
  };

  useEffect(() => {
    setIsConnected(socket.connected);

    socket.on("updatingOperatorsWord", (word, count) => {
      setCurrentOperatorsWord(word);
      setCurrentOperatorsWordCount(count);
      setWordsToGuess(count + 1);
    });

    socket.on("showPlayersAmountError", (name) => {
      if (name !== playerDetails.name) {
        setPlayersAmountError(true);
      }
    });

    socket.on("playerJoinedToGame", (room) => {
      if (room.players.length >= 4) {
        setPlayersAmountError(false);
      }
    });

    socket.on("gameOverToAll", (winnerGroup, lastPlayerDetails) => {
      setGameOver(true);
    });

    return () => {
      socket.off("updatingOperatorsWord");
      socket.off("showPlayersAmountError");
      socket.off("playerJoinedToGame");
      socket.off("gameOverToAll");
    };
    // }
  }, [socket]);

  useEffect(() => {
    // if (minimap.length > 0) {
      fetchRoomDetails()
        .then((room) => {
          setPickedRandomWords(
            room.cards.length > 0 ? room.cards : uniqueRandomWords
          );

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
              setBlueGroupCounter(8);
            } else if (randomLeadGroupColor === "blue") {
              setBlueGroupCounter(9);
              setRedGroupCounter(8);
            }
          }

          const myName = playerDetails.name;
          const myTeam = room.blueTeam.find(
            (p) => p.name === playerDetails.name
          )
            ? "blue"
            : "red";
          const myRole =
            myTeam === "red"
              ? room.redTeam[0].name === myName
                ? "operator"
                : "agent"
              : room.blueTeam[0].name === myName
              ? "operator"
              : "agent";

          const fullPlayerDetails = {
            name: myName,
            team: myTeam,
            role: myRole,
            cardRevealed: 0,
          };

          setPlayers(room.players);
          setRedTeamPlayers(room.redTeam);
          setBlueTeamPlayers(room.blueTeam);
          setRoomDetails(room);
          setRoomName(room.name);
          setMinimap(room.map);
          setMyDetails(fullPlayerDetails);
          setCurrentOperatorsWord(room.currentWord);
          setCurrentOperatorsWordCount(room.currentWordCount);
          setWordsToGuess(room.wordsToGuess);
          setRevealedCards(room.revealedCards);

          if (room.players.length < 4) {
            setPlayersAmountError(true);
          }

          if (room.status === "finished") {
            setOpenGameOver(true);
            setGameOver(true);
            setModalOpen(true);
            setWinnerGroup(room.winner);
          }
        })
        .catch((err) => {
          console.log(err);
          navigate("/404");
        })
        .finally(() => {
          setIsLoading(false);
        });
    // }
  }, []);

  useEffect(() => {
    if (redTeamPlayers.length < 2 || blueTeamPlayers.length < 2) {
      setPlayersAmountError(true);
    } else if (redTeamPlayers.length >= 2 && blueTeamPlayers.length >= 2) {
      setPlayersAmountError(false);
    }
  }, [redTeamPlayers, blueTeamPlayers]);

  return (
    <div className={classes.gamePage}>
      {(isLoading || isGoingBack) && (
        <div className={classes.loaderContainer}>
          <Loader />
        </div>
      )}
      <Header
        roomName={roomName}
        roomId={roomId}
        isConnected={isConnected}
        playerDetails={playerDetails}
        socket={socket}
        setPlayersInDb={setPlayersInDb}
        setIsGoingBack={setIsGoingBack}
        roomDetails={roomDetails}
        siteUrl={siteUrl}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        notificationsNumber={notificationsNumber}
        setNotificationsNumber={setNotificationsNumber}
        openChat={openChat}
        setOpenChat={setOpenChat}
      />
      <Board
        randomWords={pickedRandomWords}
        leadGroupColor={leadGroupColor}
        roomDetails={roomDetails}
        setRoomDetails={setRoomDetails}
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
        socket={socket}
        playersAmountError={playersAmountError}
        setTimerStarts={setTimerStarts}
        timerStarts={timerStarts}
        players={players}
        setPlayers={setPlayers}
        redTeamPlayers={redTeamPlayers}
        setRedTeamPlayers={setRedTeamPlayers}
        blueTeamPlayers={blueTeamPlayers}
        setBlueTeamPlayers={setBlueTeamPlayers}
        setPlayersInDb={setPlayersInDb}
        playerDetails={playerDetails}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        minimap={minimap}
        siteUrl={siteUrl}
        soundEffectsAllowed={soundEffectsAllowed}
      />
    </div>
  );
};

export default Game;
