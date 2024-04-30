import { Routes, Route, Navigate } from "react-router-dom";
import Main from "./pages/main/Main";
import Room from "./pages/room/Room";
import NotFound from "./pages/notFound/NotFound";
import Game from "./pages/room/game/Game";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:4000");
import axios from "axios";

function App() {
  const [logedInPlayer, setLogedInPlayer] = useState(
    sessionStorage.getItem("token") ? true : false
  );
  const [isConnected, setIsConnected] = useState(false);
  const [isGoingBack, setIsGoingBack] = useState(false);
  const [uniqueRandomWords, setUniqueRandomWords] = useState([]);
  const [randomLeadGroupColor, setRandomLeadGroupColor] = useState("");
  const [roomDetails, setRoomDetails] = useState(null);
  const [playersAmountError, setPlayersAmountError] = useState(false);
  const [minimap, setMinimap] = useState([]);
  const [players, setPlayers] = useState([]);
  const [redTeamPlayers, setRedTeamPlayers] = useState([]);
  const [blueTeamPlayers, setBlueTeamPlayers] = useState([]);

  useEffect(() => {
    const handleConnectionChange = () => {};

    socket.on("connect", handleConnectionChange);
    socket.on("disconnect", handleConnectionChange);

    return () => {
      socket.off("connect", handleConnectionChange);
      socket.off("disconnect", handleConnectionChange);
    };
  }, []);

  // useEffect(() => {
  //   const randomLeadGroupColor = Math.random() < 0.5 ? "red" : "blue";
  //   const minimapMappingArray =
  //     randomLeadGroupColor === "red" ? [9, 8, 7, 1] : [8, 9, 7, 1];

  //   // Fisher-Yates shuffle algorithm
  //   function shuffleArray(array) {
  //     for (let i = array.length - 1; i > 0; i--) {
  //       const j = Math.floor(Math.random() * (i + 1));
  //       [array[i], array[j]] = [array[j], array[i]];
  //     }
  //     return array;
  //   }

  //   const cellIndexes = Array.from({ length: 25 }, (_, index) => index);

  //   const blackCellIndex = cellIndexes.splice(
  //     Math.floor(Math.random() * cellIndexes.length),
  //     1
  //   )[0];
  //   minimapMappingArray[3]--;

  //   const shuffledIndexes = shuffleArray(cellIndexes);

  //   const redCellsIndexes = shuffledIndexes.splice(0, 8);
  //   minimapMappingArray[0] -= redCellsIndexes.length;

  //   const whiteCellsIndexes = shuffledIndexes.splice(0, 9);
  //   minimapMappingArray[2] -= whiteCellsIndexes.length;

  //   const blueCellsIndexes = shuffledIndexes;
  //   minimapMappingArray[1] -= blueCellsIndexes.length;

  //   const tempMinimap = Array(25)
  //     .fill()
  //     .map((_, index) => {
  //       let subclass = "";
  //       let color = "";

  //       if (index === blackCellIndex) {
  //         subclass = "black";
  //         color = "#3d3b3a";
  //       } else if (redCellsIndexes.includes(index)) {
  //         subclass = "red";
  //         color = "#ec4542";
  //       } else if (blueCellsIndexes.includes(index)) {
  //         subclass = "blue";
  //         color = "#008ed5";
  //       } else if (whiteCellsIndexes.includes(index)) {
  //         subclass = "neutral";
  //         color = "#d1c499";
  //       }

  //       return {
  //         subclass: subclass,
  //       };
  //     });

  //   console.log(tempMinimap);
  // }, []);

  // Set players and teams in db
  const setPlayersInDb = (roomId, tempPlayers, tempRed, tempBlue) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`http://localhost:4000/room/${roomId}/setPlayers`, {
          roomId,
          players: tempPlayers,
          redTeamPlayers: tempRed,
          blueTeamPlayers: tempBlue,
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
          reject(new Error("Could not set players in db"));
        });
    });
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Main
            setLogedInPlayer={setLogedInPlayer}
            logedInPlayer={logedInPlayer}
          />
        }
      />
      {logedInPlayer ? (
        <>
          <Route path="/room" element={<NotFound />} />
          <Route
            path="/room/:roomId"
            element={
              <Room
                socket={socket}
                isConnected={isConnected}
                setIsConnected={setIsConnected}
                setPlayersInDb={setPlayersInDb}
                setIsGoingBack={setIsGoingBack}
                setUniqueRandomWords={setUniqueRandomWords}
                setRandomLeadGroupColor={setRandomLeadGroupColor}
                setRoomDetails={setRoomDetails}
                roomDetails={roomDetails}
                playersAmountError={playersAmountError}
                setPlayersAmountError={setPlayersAmountError}
                setMinimap={setMinimap}
                setPlayers={setPlayers}
                players={players}
                setRedTeamPlayers={setRedTeamPlayers}
                redTeamPlayers={redTeamPlayers}
                setBlueTeamPlayers={setBlueTeamPlayers}
                blueTeamPlayers={blueTeamPlayers}
              />
            }
          />
          <Route
            path="/room/:roomId/game"
            element={
              <Game
                socket={socket}
                isConnected={isConnected}
                setIsConnected={setIsConnected}
                setPlayersInDb={setPlayersInDb}
                setIsGoingBack={setIsGoingBack}
                isGoingBack={isGoingBack}
                uniqueRandomWords={uniqueRandomWords}
                randomLeadGroupColor={randomLeadGroupColor}
                roomDetails={roomDetails}
                setRoomDetails={setRoomDetails}
                minimap={minimap}
                setMinimap={setMinimap}
                playersAmountError={playersAmountError}
                setPlayersAmountError={setPlayersAmountError}
                setPlayers={setPlayers}
                players={players}
                setRedTeamPlayers={setRedTeamPlayers}
                redTeamPlayers={redTeamPlayers}
                setBlueTeamPlayers={setBlueTeamPlayers}
                blueTeamPlayers={blueTeamPlayers}
              />
            }
          />
        </>
      ) : (
        <Route path="*" element={<Navigate to="/" replace />} />
      )}
      {/* <>
          <Route path="/room" element={<NotFound />} />
          <Route path="/room/:roomId" element={<Room />} />
          <Route path="/room/:roomId/:token/game" element={<Game />} />
        </> */}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
