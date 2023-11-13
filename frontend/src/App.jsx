import Main from "./pages/main/Main"
import Room from "./pages/room/Room"
import NotFound from "./pages/notFound/NotFound";

import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route
        path="/room"
        element={<NotFound />}
      />
      <Route path="/room/:roomId" element={<Room />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App;
