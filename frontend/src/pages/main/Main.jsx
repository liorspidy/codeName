/* eslint-disable no-inner-declarations */
/* eslint-disable react/prop-types */
import classes from "./Main.module.scss";
import CreateRoomModal from "../../UI/modals/CreateRoomModal";
import { useEffect, useState } from "react";
import JoinRoomModal from "../../UI/modals/JoinRoomModal";
import Circles from "./Circles";
import LogInModal from "../../UI/modals/LogInModal";
import CreateUserModal from "../../UI/modals/CreateUserModal";
import Button from "../../UI/button/Button";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SettingsIcon from '@mui/icons-material/Settings';
import SettingsModal from "../../UI/modals/SettingsModal";

const Main = ({
  logedInPlayer,
  setLogedInPlayer,
  siteUrl,
  backgroundMusic,
  isLoading,
  setIsLoading,
  bgMusicPlays,
  setBgMusicPlays,
  bgMusicVolume,
  setBgMusicVolume,
  soundEffectsAllowed,
  setSoundEffectsAllowed,
}) => {
  const [createRoomModalShown, setCreateRoomModalShown] = useState(false);
  const [joinModalShown, setJoinModalShown] = useState(false);
  const [logInShown, setLogInShown] = useState(false);
  const [createUserShown, setCreateUserShown] = useState(false);
  const [settingsMenuShown , setSettingsMenuShown] = useState(false);
  const [playersDetails, setPlayersDetails] = useState({});
  const [shortName, setShortName] = useState("");
  const [isDetailsClicked, setIsDetailsClicked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [backButton, setBackButton] = useState(false);

  let navigate = useNavigate();

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

  const settingsModalToggle = () => {
    setSettingsMenuShown(true);
    setModalOpen(true);
  };

  const onDetailsClick = () => {
    setIsDetailsClicked(!isDetailsClicked);
  };

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      const tokenDetails = jwtDecode(sessionStorage.getItem("token"));
      if (tokenDetails) {
        setPlayersDetails({
          email: tokenDetails.email,
          fullName: tokenDetails.fullName,
          nickname: tokenDetails.name,
          color: tokenDetails.randColor,
        });

        setShortName(tokenDetails.name.substring(0, 3).toUpperCase());
      }

      if (sessionStorage.getItem("lastRoomId") !== null) {
        setBackButton(true);
      }
    }
  }, [logedInPlayer]);

  const logOutHandler = () => {
    sessionStorage.removeItem("token");
    setLogedInPlayer(false);
    setBgMusicPlays(false);
    backgroundMusic.pause();
    sessionStorage.setItem("musicPlaying", "false");
  };

  const closePlayerDetailsHandler = () => {
    if (isDetailsClicked) {
      setIsDetailsClicked(false);
    }
  };

  const goBackToLastRoom = () => {
    navigate(`/room/${sessionStorage.getItem("lastRoomId")}`);
  };

  return (
    <div className={classes.main}>
      {modalOpen && (
        <CreateRoomModal
          setModalOpen={setModalOpen}
          setModalShown={setCreateRoomModalShown}
          modalShown={createRoomModalShown}
          siteUrl={siteUrl}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
      {modalOpen && (
        <JoinRoomModal
          setModalOpen={setModalOpen}
          setModalShown={setJoinModalShown}
          modalShown={joinModalShown}
          siteUrl={siteUrl}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
      {modalOpen && (
        <LogInModal
          setModalOpen={setModalOpen}
          setModalShown={setLogInShown}
          modalShown={logInShown}
          setLogedInPlayer={setLogedInPlayer}
          siteUrl={siteUrl}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
      {modalOpen && (
        <CreateUserModal
          setModalOpen={setModalOpen}
          setModalShown={setCreateUserShown}
          modalShown={createUserShown}
          setLogedInPlayer={setLogedInPlayer}
          siteUrl={siteUrl}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
      {modalOpen && (
        <SettingsModal 
        setModalOpen={setModalOpen}
        setModalShown={setSettingsMenuShown}
        modalShown={settingsMenuShown}
        siteUrl={siteUrl}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        backgroundMusic={backgroundMusic}
        bgMusicPlays={bgMusicPlays}
        setBgMusicPlays={setBgMusicPlays}
        bgMusicVolume={bgMusicVolume} 
        setBgMusicVolume={setBgMusicVolume} 
        soundEffectsAllowed={soundEffectsAllowed}
        setSoundEffectsAllowed={setSoundEffectsAllowed}
        />
      )}

      <Circles
        isDetailsClicked={isDetailsClicked}
        setIsDetailsClicked={setIsDetailsClicked}
      />

      {/* player details container */}
      {logedInPlayer && (
        <div className={classes.playerActions}>
          <div
            className={classes.loggedInDetails}
            onClick={closePlayerDetailsHandler}
          >
            <motion.div
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              className={classes.nameContainer}
              onClick={onDetailsClick}
            >
              <span
                className={classes.name}
                style={{ color: playersDetails.color }}
              >
                {shortName}
              </span>
            </motion.div>
            <div
              className={`${classes.dropdown} ${
                isDetailsClicked ? classes.active : ""
              }`}
            >
              <ul
                className={classes.detailsList}
                onClick={closePlayerDetailsHandler}
              >
                <li>{playersDetails.nickname}</li>
                <li>{playersDetails.fullName}</li>
                <li>{playersDetails.email}</li>
              </ul>
            </div>
          </div>

          {/* setting menu */}
            <motion.div
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              className={classes.settings}
              onClick={settingsModalToggle}
            >
              <SettingsIcon sx={{ scale: '1.2' }} />
            </motion.div>
        </div>
      )}

      <div className={classes.title} onClick={closePlayerDetailsHandler}>
        <h1>
          משחק <span>מילים</span>
        </h1>
      </div>
      {logedInPlayer && (
        <div className={classes.actionButtons}>
          <Button onclick={openCreateRoomModal}>
            <span>צור חדר</span>
          </Button>
          <Button onclick={openJoinRoomModal}>
            <span>הצטרף לחדר</span>
          </Button>
          {backButton && (
            <Button
              classname={classes.secondaryButton}
              onclick={goBackToLastRoom}
            >
              <span>חזור לחדר</span>
            </Button>
          )}
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
