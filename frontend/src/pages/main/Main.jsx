import { NavLink } from 'react-router-dom';
import classes from './Main.module.scss';
import CreateRoomModal from './CreateRoomModal';
import { useState } from 'react';
import JoinRoomModal from './JoinRoomModal';

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
      
        <div className={classes.circles}>
            <span className={classes.semi_transparent_circle} style={{width: '215vw'}}></span>
            <span className={classes.transparent_circle} style={{width: '190vw'}}></span>

            <span className={classes.semi_transparent_circle} style={{width: '170vw'}}></span>
            <span className={classes.transparent_circle} style={{width: '150vw'}}></span>

            <span className={classes.semi_transparent_circle} style={{width: '135vw'}}></span>
            <span className={classes.transparent_circle} style={{width: '120vw'}}></span>
                
            <span className={classes.semi_transparent_circle} style={{width: '108vw'}}></span>
            <span className={classes.transparent_circle} style={{width: '95vw'}}></span>

            <span className={classes.semi_transparent_circle} style={{width: '85vw'}}></span>
            <span className={classes.transparent_circle} style={{width: '75vw'}}></span>

            <span className={classes.semi_transparent_circle} style={{width: '65vw'}}></span>
            <span className={classes.transparent_circle} style={{width: '55vw'}}></span>

            <span className={classes.semi_transparent_circle} style={{width: '45vw'}}></span>
            <span className={classes.transparent_circle} style={{width: '35vw'}}></span>
        </div>

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

      {/* <NavLink to="/room/123" className={classes.navlink}>
        צור חדר
      </NavLink>
      <NavLink to="/test" className={classes.navlink}>
        הצטרף לחדר
      </NavLink> */}
    </div>
  </div>
  )
}

export default Main