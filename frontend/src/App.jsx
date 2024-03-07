import { Routes, Route, Navigate } from "react-router-dom";
import Main from "./pages/main/Main";
import Room from "./pages/room/Room";
import NotFound from "./pages/notFound/NotFound";
import Game from "./pages/room/game/Game";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:4000");

function App() {
  const [logedInPlayer, setLogedInPlayer] = useState(
    sessionStorage.getItem("token") ? true : false
  );
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const handleConnectionChange = () => {
      setIsConnected(socket.connected);
    };

    socket.on("connect", handleConnectionChange);
    socket.on("disconnect", handleConnectionChange);
  }, []);

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
            element={<Room socket={socket} isConnected={isConnected} />}
          />
          <Route
            path="/room/:roomId/game"
            element={<Game socket={socket} isConnected={isConnected} />}
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
