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

const LeaveRoomModal = ({ setModalShown, modalShown, setModalOpen, roomDetails , updatePlayers ,socket}) => {
  const [backdropShown, setBackdropShown] = useState(false);
  const [error, setError] = useState("");
  const [leavingRoom, setleavingRoom] = useState(false);
  const playerDetails = sessionStorage.getItem("token")
    ? jwtDecode(sessionStorage.getItem("token"))
    : null;

  let navigate = useNavigate();

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
    setleavingRoom(false);
  }, []);

  const leaveRoomHandler = async () => {
    try {
      setleavingRoom(true);
      await axios.post(`http://localhost:4000/room/${roomDetails.id}/leaveRoom`, {
        roomId: roomDetails.id,
        username: playerDetails.name,
      });

      navigate("/");
      setleavingRoom(false);
      socket.emit("playerLeft", roomDetails, playerDetails.name);
      sessionStorage.removeItem("lastRoomId");
    } catch (error) {
      setError("אירעה שגיאה, אנא נסה שוב מאוחר יותר");
      console.log(error);
    }
  };

  return (
    <Modal
      closeBackdrop={closeBackdrop}
      setModalOpen={setModalOpen}
      setModalShown={setModalShown}
      modalShown={modalShown}
      setBackdropShown={setBackdropShown}
      backdropShown={backdropShown}
    >
      {!leavingRoom && (
        <div className={classes.leaveRoomModal}>
          <h2>האם אתה בטוח שתרצה לעזוב את החדר?</h2>
          <p>
            <strong>שים לב! פעולה זו תמחק את המשתמש שלך מהחדר לצמיתות.</strong>
          </p>
          {!!error.length && <p className={classes.error}>{error}</p>}
          <div className={classes.leaveRoomButtons}>
            <Button
              classname={classes.leaveRoom}
              onclick={leaveRoomHandler}
              tabIndex="0"
            >
              <span>כן, עזוב את החדר</span>
            </Button>
            <Button classname={classes.cancel} onclick={closeBackdrop}>
              <span>ביטול</span>
            </Button>
          </div>
        </div>
      )}

      {leavingRoom && (
        <div className={classes.leaveRoomModal}>
          <h2>עוזב את החדר...</h2>
          <Loader />
        </div>
      )}
    </Modal>
  );
};

export default LeaveRoomModal;
