/* eslint-disable react/prop-types */
import { useParams } from "react-router-dom"; // Import useParams hook
import classes from "./Header.module.scss";
import { useNavigate } from "react-router-dom";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import InfoIcon from "@mui/icons-material/Info";
// import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import ChatIcon from "@mui/icons-material/Chat";
import Menu from "./menu/Menu";
import { useState } from "react";
import InfoModal from "./InfoModal";

const Header = () => {
  const { roomId } = useParams();
  const [openChat, setOpenChat] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  let navigate = useNavigate();

  const goBackHandler = () => {
    navigate("/");
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
        <h1 className={classes.roomId}>{roomId}</h1>
      </div>
      <div className={classes.leftSection}>
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
        <Menu />
      </div>
    </header>
  );
};

export default Header;
