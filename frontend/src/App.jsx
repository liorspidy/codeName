import { Routes, Route, Navigate } from "react-router-dom";
import Main from "./pages/main/Main";
import Room from "./pages/room/Room";
import NotFound from "./pages/notFound/NotFound";
import Game from "./pages/room/game/Game";
import { useState } from "react";

function App() {
  const [logedInPlayer, setLogedInPlayer] = useState(
    sessionStorage.getItem("token") ? true : false
  );

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
          <Route path="/room/:roomId" element={<Room />} />
          <Route path="/room/:roomId/game" element={<Game />} />
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
