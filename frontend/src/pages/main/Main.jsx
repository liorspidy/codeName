/* eslint-disable react/prop-types */
import classes from "./Main.module.scss";
import CreateRoomModal from "../../UI/modals/CreateRoomModal";
import { useState } from "react";
import JoinRoomModal from "../../UI/modals/JoinRoomModal";
import Circles from "./Circles";
import LogInModal from "../../UI/modals/LogInModal";
import CreateUserModal from "../../UI/modals/CreateUserModal";
import Button from "../../UI/button/Button";

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
          <Button onclick={openCreateRoomModal}>
            <span>צור חדר</span>
          </Button>
          <Button onclick={openJoinRoomModal}>
            <span>הצטרף לחדר</span>
          </Button>
        </div>
      )}
      {logedInPlayer && (
        <div className={classes.login_logout}>
          <Button onclick={logOutHandler}>
            <span>התנתק</span>
          </Button>
        </div>
      )}
      {!logedInPlayer && (
        <div className={classes.usersActions}>
          <Button onclick={openLogInModal}>
            <span>התחבר לחשבון</span>
          </Button>
          <Button onclick={createUserModal}>
            <span>הרשמה</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Main;
