/* eslint-disable react/prop-types */
import classes from "./Main.module.scss";
import CreateRoomModal from "./CreateRoomModal";
import { useEffect, useState } from "react";
import JoinRoomModal from "./JoinRoomModal";
import Circles from "./Circles";
import { motion } from "framer-motion";
import LogInModal from "./LogInModal";
import CreateUserModal from "./CreateUserModal";

const Main = ({ logedInPlayer, setLogedInPlayer }) => {
  const [createRoomModalShown, setCreateRoomModalShown] = useState(false);
  const [joinModalShown, setJoinModalShown] = useState(false);
  const [logInShown, setLogInShown] = useState(false);
  const [createUserShown, setCreateUserShown] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const openCreateRoomModal = () => {
    setCreateRoomModalShown(true);
    setModalOpen(true);
  };

  const openJoinRoomModal = () => {
    setJoinModalShown(true);
    setModalOpen(true);
  };

  const openLogInModal = () => {
    setLogInShown(true);
    setModalOpen(true);
  };

  const createUserModal = () => {
    setCreateUserShown(true);
    setModalOpen(true);
  };

  // useEffect(() => {
  //   const playersDetailsFromLocalStorage = localStorage.getItem("playerGoogleObject");
  //   if(!playersDetailsFromLocalStorage){
  //     dispatch(setPlayerGoogleObject({"name":"lior"}));
  //     localStorage.setItem("playerGoogleObject",JSON.stringify({"name":"lior"}));
  //   }
  // },[])

  const logOutHandler = () => {
    sessionStorage.removeItem("token");
    setLogedInPlayer(false);
  };

  return (
    <div className={classes.main}>
      {modalOpen && (
        <CreateRoomModal
          setModalOpen={setModalOpen}
          setModalShown={setCreateRoomModalShown}
          modalShown={createRoomModalShown}
        />
      )}
      {modalOpen && (
        <JoinRoomModal
          setModalOpen={setModalOpen}
          setModalShown={setJoinModalShown}
          modalShown={joinModalShown}
        />
      )}
      {modalOpen && (
        <LogInModal
          setModalOpen={setModalOpen}
          setModalShown={setLogInShown}
          modalShown={logInShown}
          setLogedInPlayer={setLogedInPlayer}
        />
      )}
      {modalOpen && (
        <CreateUserModal
          setModalOpen={setModalOpen}
          setModalShown={setCreateUserShown}
          modalShown={createUserShown}
        />
      )}

      <Circles />

      <div className={classes.title}>
        <h1>
          שֵׁם <span>קוֹד</span>
        </h1>
      </div>
      {logedInPlayer && (
        <div className={classes.action_buttons}>
          <motion.button
            onClick={openCreateRoomModal}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
          >
            <span>צור חדר</span>
          </motion.button>
          <motion.button
            onClick={openJoinRoomModal}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
          >
            <span>הצטרף לחדר</span>
          </motion.button>
        </div>
      )}
      {logedInPlayer && (
        <div className={classes.login_logout}>
          <motion.button
            onClick={logOutHandler}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
          >
            התנתק
          </motion.button>
        </div>
      )}
      {!logedInPlayer && (
        <div className={classes.usersActions}>
          <motion.button
            onClick={openLogInModal}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
          >
            התחבר לחשבון
          </motion.button>
          <motion.button
            onClick={createUserModal}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
          >
            הרשמה
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default Main;
