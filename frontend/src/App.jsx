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
  const [isConnected, setIsConnected] = useState(socket.connected);
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
    const handleConnectionChange = () => {
      setIsConnected(socket.connected);
    };

    socket.on("connect", handleConnectionChange);
    socket.on("disconnect", handleConnectionChange);
  }, []);

  // Set players and teams in db
  const setPlayersInDb = async (roomId, tempPlayers, tempRed, tempBlue) => {
    try {
      await axios.post(`http://localhost:4000/room/${roomId}/setPlayers`, {
        roomId,
        players: tempPlayers,
        redTeamPlayers: tempRed,
        blueTeamPlayers: tempBlue,
      });
    } catch (error) {
      console.log(error);
    }
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
