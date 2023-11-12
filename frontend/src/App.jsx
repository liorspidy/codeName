import Main from "./pages/main/Main"
import Room from "./pages/room/Room"
import { Routes, Route } from 'react-router-dom';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/room/:roomId" element={<Room />} />
      <Route path="*" element={<h1>Not Found</h1>} />
    </Routes>
  )
}

export default App
