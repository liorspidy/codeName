/* eslint-disable react/prop-types */
import classes from "./Header.module.scss";
import { useNavigate } from "react-router-dom";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import InfoIcon from "@mui/icons-material/Info";
import IconButton from "@mui/material/IconButton";
import ChatIcon from "@mui/icons-material/Chat";
import Menu from "./menu/Menu";
import { useState } from "react";
import InfoModal from "../../UI/modals/InfoModal";
import ChatModal from "../../UI/modals/ChatModal";

const Header = ({ roomName, roomId, isConnected }) => {
  const [openChat, setOpenChat] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [notificationsNumber, setNotificationsNumber] = useState(1);

  let navigate = useNavigate();

  const goBackHandler = () => {
    navigate(-1);
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
        />
      )}
      {modalOpen && (
        <ChatModal
          setModalOpen={setModalOpen}
          setModalShown={setOpenChat}
          modalShown={openChat}
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
          style={{ "--notifCount": toString(notificationsNumber) }}
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
