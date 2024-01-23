/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Modal from "../../UI/Modal";
import { useCallback } from "react";
import classes from "../../UI/Modal.module.scss";
import { useNavigate } from "react-router-dom";
import Loader from "../../UI/Loader";

const JoinRoomModal = ({ setModalShown, modalShown, setModalOpen }) => {
  const [backdropShown, setBackdropShown] = useState(false);
  const [error, setError] = useState("");
  const [value, setValue] = useState("");
  const [joiningRoom, setJoiningRoom] = useState(false);

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

  useEffect(() => {
    if (joiningRoom) {
      const timeout = setTimeout(() => {
        closeBackdrop();
        setJoiningRoom(false);
        navigate(`/room/${value}`);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [joiningRoom, closeBackdrop, navigate, value]);

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
          <h2>הזן את קוד החדר</h2>
          <input
            type="text"
            value={value}
            onChange={setValueHandler}
            onKeyDown={handleEnterPress}
            placeholder="קוד החדר"
          />
          {!!error.length && <p className={classes.error}>{error}</p>}
          <button className={classes.actionButton} onClick={joinRoom}>
            <span>הצטרפות</span>
          </button>
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
