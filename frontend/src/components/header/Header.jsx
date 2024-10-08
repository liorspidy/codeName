/* eslint-disable react/prop-types */
import classes from "./Header.module.scss";
import { useNavigate } from "react-router-dom";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import InfoIcon from "@mui/icons-material/Info";
import IconButton from "@mui/material/IconButton";
import ChatIcon from "@mui/icons-material/Chat";
import Menu from "./menu/Menu";
import { useEffect, useState } from "react";
import InfoModal from "../../UI/modals/InfoModal";
import ChatModal from "../../UI/modals/ChatModal";
import axios from "axios";

const Header = ({
  roomName,
  roomId,
  isConnected,
  playerDetails,
  socket,
  setPlayersInDb,
  setIsGoingBack,
  roomDetails,
  siteUrl,
  setIsLoading,
  isLoading,
  notificationsNumber,
  setNotificationsNumber,
  openChat,
  setOpenChat,
}) => {
  const [openInfo, setOpenInfo] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isGame, setIsGame] = useState(false);
  const [messages, setMessages] = useState([]);

  let navigate = useNavigate();

  useEffect(() => {
    if (playerDetails) {
      const url = window.location.href;
      url.includes("game") ? setIsGame(true) : setIsGame(false);
    }
  }, [playerDetails]);

  useEffect(() => {
    socket.on("messageReceived", (myDetails, message) => {
      if (myDetails.name === playerDetails.name) return;

      setMessages((prevMessages) => [...prevMessages, message]);
      if (!openChat) {
        console.log("New message received:", message);
        setNotificationsNumber((prev) => prev + 1);
      }
    });

    return () => {
      socket.off("messageReceived");
    };
  }, [socket]);

  const goBackHandler = () => {
    setPlayerNotReadyInDb(playerDetails.name);
  };

  // Set teams in db
  const setPlayerNotReadyInDb = async (name) => {
    try {
      setIsLoading(true);
      setIsGoingBack(true);
      const response = await axios.post(
        `${siteUrl}/room/${roomId}/setPlayerNotReady`,
        {
          roomId,
          playerName: name,
        }
      );
      const room = response.data;
      setPlayersInDb(roomId, room.players, room.redTeam, room.blueTeam).then(
        () => {
          setIsGoingBack(false);
          navigate(-1);
        }
      );
    } catch (error) {
      console.error("An error occurred while setting player not ready:", error);
      throw new Error("Could not set player not ready in db");
    } finally {
      setIsLoading(false);
    }
  };

  const infoHandler = () => {
    setModalOpen(!modalOpen);
    setOpenInfo(!openInfo);
  };

  const chatHandler = () => {
    setModalOpen(!modalOpen);
    setOpenChat(!openChat);
  };

  return (
    <header>
      {modalOpen && (
        <InfoModal
          setModalOpen={setModalOpen}
          setModalShown={setOpenInfo}
          modalShown={openInfo}
          roomDetails={roomDetails}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
        />
      )}
      {modalOpen && (
        <ChatModal
          setModalOpen={setModalOpen}
          setModalShown={setOpenChat}
          modalShown={openChat}
          siteUrl={siteUrl}
          socket={socket}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          setNotificationsNumber={setNotificationsNumber}
          messages={messages}
          setMessages={setMessages}
        />
      )}
      <div className={classes.rightSection}>
        {/* <Toolbar sx={{ padding: 0 }}> */}
        <IconButton
          onClick={goBackHandler}
          aria-label="go back"
          sx={{
            backgroundColor: "#646cff",
            color: "#fff",
            ":hover": { backgroundColor: "#464cc2" },
          }}
        >
          <ChevronRightIcon />
        </IconButton>

        <IconButton
          onClick={infoHandler}
          aria-label="go back"
          sx={{
            backgroundColor: "#646cff",
            color: "#fff",
            ":hover": { backgroundColor: "#464cc2" },
          }}
        >
          <InfoIcon />
        </IconButton>
        {/* </Toolbar> */}
      </div>
      <div className={classes.middleSection}>
        <div className={classes.content}>
          <h1 className={classes.roomName}>{roomName}</h1>
          <p className={classes.roomId}>{roomId}</p>
        </div>
        <span
          className={`${classes.isConnected} ${
            isConnected ? classes.active : classes.inactive
          }`}
        ></span>
      </div>
      <div className={classes.leftSection}>
        <div
          className={`${classes.chatButton} ${
            notificationsNumber > 0 ? classes.hasNotif : ""
          }`}
          data-count={notificationsNumber > 0 ? notificationsNumber : ""}
        >
          <IconButton
            onClick={chatHandler}
            aria-label="go back"
            sx={{
              backgroundColor: "#646cff",
              color: "#fff",
              ":hover": { backgroundColor: "#464cc2" },
            }}
          >
            <ChatIcon className={classes.chatIcon} sx={{ scale: "0.9" }} />
          </IconButton>
        </div>
        <Menu />
      </div>
    </header>
  );
};

export default Header;
