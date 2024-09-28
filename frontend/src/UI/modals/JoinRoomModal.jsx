/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Modal from "./Modal";
import { useCallback } from "react";
import classes from "./Modal.module.scss";
import { useNavigate } from "react-router-dom";
import Loader from "../loader/Loader";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Button from "../button/Button";
import RoomsList from "./RoomsList";

const JoinRoomModal = ({ setModalShown, modalShown, setModalOpen }) => {
  const [backdropShown, setBackdropShown] = useState(false);
  const [error, setError] = useState("");
  const [value, setValue] = useState("");
  const [joiningRoom, setJoiningRoom] = useState(false);
  const playerDetails = sessionStorage.getItem("token")
    ? jwtDecode(sessionStorage.getItem("token"))
    : null;

  let navigate = useNavigate();

  const setValueHandler = (e) => {
    setValue(e.target.value);
  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      joinRoom();
    }
  };

  const joinRoom = () => {
    if (value.trim() === "") {
      setError("יש להזין קוד חוקי");
      return;
    } else {
      //check if this room exists then join in
      setJoiningRoom(true);
    }
  };

  const closeBackdrop = useCallback(() => {
    const modal = document.querySelector(`.${classes.modal}.${classes.active}`);
    const backdrop = document.querySelector(
      `.${classes.backdrop}.${classes.active}`
    );
    setModalShown(false);
    modal.addEventListener(
      "animationend",
      () => {
        setBackdropShown(false);
      },
      { once: true }
    );
    backdrop.addEventListener(
      "animationend",
      () => {
        setModalOpen(false);
      },
      { once: true }
    );
  }, [setModalShown, setBackdropShown, setModalOpen]);

  useEffect(() => {
    setJoiningRoom(false);
  }, []);

  const joiningRoomHandler = async () => {
    console.log("joining room");
    try {
      await axios.post("http://localhost:4000/room/join", {
        roomId: value,
        playerName: playerDetails.name,
      });
      closeBackdrop();
      setJoiningRoom(false);
      navigate(`/room/${value}`);
    } catch (err) {
      setJoiningRoom(false);
      if (err.response.status === 404) {
        setError("החדר לא קיים");
      } else if (err.response.status === 405) {
        setError("החדר מלא");
      }
    }
  };

  useEffect(() => {
    if (joiningRoom) {
      joiningRoomHandler();
    }
  }, [joiningRoom, joiningRoomHandler]);

  return (
    <Modal
      closeBackdrop={closeBackdrop}
      setModalOpen={setModalOpen}
      setModalShown={setModalShown}
      modalShown={modalShown}
      setBackdropShown={setBackdropShown}
      backdropShown={backdropShown}
    >
      {!joiningRoom && (
        <div className={classes.joinRoomModal}>
          <h2 className={classes.title}>הזן את קוד החדר</h2>
          <input
            type="text"
            value={value}
            onChange={setValueHandler}
            onKeyDown={handleEnterPress}
            placeholder="קוד החדר"
          />
          <RoomsList setValue={setValue} />
          {!!error.length && <p className={classes.error}>{error}</p>}
          <Button classname={classes.actionButton} onclick={joinRoom}>
            <span>הצטרפות</span>
          </Button>
        </div>
      )}
      {joiningRoom && (
        <div className={classes.joinRoomModal}>
          <h2>מצטרף לחדר נא המתן...</h2>
          <Loader />
        </div>
      )}
    </Modal>
  );
};

export default JoinRoomModal;
