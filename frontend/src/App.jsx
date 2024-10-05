/* eslint-disable react-hooks/exhaustive-deps */
import { Routes, Route, Navigate } from "react-router-dom";
import Main from "./pages/main/Main";
import Room from "./pages/room/Room";
import NotFound from "./pages/notFound/NotFound";
import Game from "./pages/room/game/Game";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:4000");
// const socket = io("https://wordsplaylfbe.glitch.me");
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
  const [minimap, setMinimap] = useState([]);
  const [playersAmountError, setPlayersAmountError] = useState(false);
  const [players, setPlayers] = useState([]);
  const [redTeamPlayers, setRedTeamPlayers] = useState([]);
  const [blueTeamPlayers, setBlueTeamPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notificationsNumber, setNotificationsNumber] = useState(0);
  const [openChat, setOpenChat] = useState(false);

  const [bgMusicPlays, setBgMusicPlays] = useState(
    sessionStorage.getItem("musicPlaying") === "true" ? true : false
  );
  const [bgMusicVolume, setBgMusicVolume] = useState(
    sessionStorage.getItem("musicVolume")
      ? sessionStorage.getItem("musicVolume")
      : 1
  );
  const [backgroundMusic, setBackgroundMusic] = useState(null);
  const [soundEffectsAllowed, setSoundEffectsAllowed] = useState(
    sessionStorage.getItem("soundEffects") === "true" ? true : false
  );

  const siteUrl = "http://localhost:4000";
  // const siteUrl = "https://wordsplaylfbe.glitch.me";

  // Check if the user is connected to the socket
  useEffect(() => {
    const handleConnectionChange = () => {};

    socket.on("connect", handleConnectionChange);
    socket.on("disconnect", handleConnectionChange);

    return () => {
      socket.off("connect", handleConnectionChange);
      socket.off("disconnect", handleConnectionChange);
    };
  }, []);

  // Set background music and play it on user interaction only when logged in and music is enabled 
  useEffect(() => {
    const audio = new Audio("/music/loop.mp3");
    audio.loop = true;
    audio.volume = bgMusicVolume;
    setBackgroundMusic(audio);

    const playMusicOnInteraction = () => {
      audio.play().catch((error) => {
        console.log("User interaction required to start music", error);
      });
    };

    // Attach the interaction listener only when the user is logged in
    if (logedInPlayer && bgMusicPlays) {
      document.addEventListener("click", playMusicOnInteraction, {
        once: true,
      });
    }

    // Cleanup listener and stop music on logout
    return () => {
      if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        setBgMusicPlays(false);
        sessionStorage.setItem("musicPlaying", "false");
      }
      document.removeEventListener("click", playMusicOnInteraction);
    };
  }, [logedInPlayer]);

  useEffect(() => {
    if (backgroundMusic && bgMusicPlays) {
      backgroundMusic.play();
    } else if (backgroundMusic && !bgMusicPlays) {
      backgroundMusic.pause();
    }
  }, [bgMusicPlays, backgroundMusic]);

  // Handle volume changes
  useEffect(() => {
    if (backgroundMusic) {
      backgroundMusic.volume = bgMusicVolume;
    }
  }, [bgMusicVolume, backgroundMusic]);

  // Set players and teams in db
  const setPlayersInDb = (roomId, tempPlayers, tempRed, tempBlue) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${siteUrl}/room/${roomId}/setPlayers`, {
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
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Main
              setLogedInPlayer={setLogedInPlayer}
              logedInPlayer={logedInPlayer}
              siteUrl={siteUrl}
              setIsLoading={setIsLoading}
              isLoading={isLoading}
              bgMusicPlays={bgMusicPlays}
              setBgMusicPlays={setBgMusicPlays}
              bgMusicVolume={bgMusicVolume}
              setBgMusicVolume={setBgMusicVolume}
              backgroundMusic={backgroundMusic}
              soundEffectsAllowed={soundEffectsAllowed}
              setSoundEffectsAllowed={setSoundEffectsAllowed}
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
                  setPlayersAmountError={setPlayersAmountError}
                  setPlayers={setPlayers}
                  players={players}
                  setRedTeamPlayers={setRedTeamPlayers}
                  redTeamPlayers={redTeamPlayers}
                  setBlueTeamPlayers={setBlueTeamPlayers}
                  blueTeamPlayers={blueTeamPlayers}
                  siteUrl={siteUrl}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  notificationsNumber={notificationsNumber}
                  setNotificationsNumber={setNotificationsNumber}
                  openChat={openChat}
                  setOpenChat={setOpenChat}
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
                  playersAmountError={playersAmountError}
                  setPlayersAmountError={setPlayersAmountError}
                  setPlayers={setPlayers}
                  players={players}
                  setRedTeamPlayers={setRedTeamPlayers}
                  redTeamPlayers={redTeamPlayers}
                  setBlueTeamPlayers={setBlueTeamPlayers}
                  blueTeamPlayers={blueTeamPlayers}
                  setMinimap={setMinimap}
                  minimap={minimap}
                  siteUrl={siteUrl}
                  setIsLoading={setIsLoading}
                  isLoading={isLoading}
                  soundEffectsAllowed={soundEffectsAllowed}
                  notificationsNumber={notificationsNumber}
                  setNotificationsNumber={setNotificationsNumber}
                  openChat={openChat}
                  setOpenChat={setOpenChat}
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
    </>
  );
}

export default App;
