import { Provider } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import store from './store/index'; // Update the path to your Redux store
import Main from './pages/main/Main';
import Room from './pages/room/Room';
import NotFound from './pages/notFound/NotFound';
import Game from './pages/room/game/Game';

function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/room" element={<NotFound />} />
        <Route path="/room/:roomId" element={<Room />} />
        <Route path="/room/:roomId/:token/game" element={<Game />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Provider>
  );
}

export default App;
