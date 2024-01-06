import classes from './Main.module.scss';
import CreateRoomModal from './CreateRoomModal';
import { useState } from 'react';
import JoinRoomModal from './JoinRoomModal';
import Circles from './Circles';

const Main = () => {
  const [createModalShown, setCreateModalShown] = useState(false);
  const [joinModalShown, setJoinModalShown] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);


  const openCreateRoomModal = () => {
    setCreateModalShown(true);
    setModalOpen(true);
  }

  const openJoinRoomModal = () => {
    setJoinModalShown(true);
    setModalOpen(true);
  }

  return (
    <div className={classes.main}>

      {modalOpen && <CreateRoomModal setModalOpen={setModalOpen} setModalShown={setCreateModalShown} modalShown={createModalShown}/>}
      {modalOpen && <JoinRoomModal setModalOpen={setModalOpen} setModalShown={setJoinModalShown} modalShown={joinModalShown}/>}
      
      <Circles/>

    <div className={classes.title}>
      <h1>שֵׁם <span>קוֹד</span></h1>
    </div>
    <div className={classes.action_buttons}>
      <button onClick={openCreateRoomModal}>
        <span>צור חדר</span>
      </button>
      <button onClick={openJoinRoomModal}>
        <span>הצטרף לחדר</span>
      </button>
    </div>
  </div>
  )
}

export default Main