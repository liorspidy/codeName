/* eslint-disable react/prop-types */
import { useState } from "react";
import Modal from "../../UI/Modal";
import { useCallback } from "react";
import classes from "../../UI/Modal.module.scss";
import {useNavigate } from "react-router-dom";

const JoinRoomModal = ({ setModalShown, modalShown, setModalOpen }) => {
  const [backdropShown, setBackdropShown] = useState(false);
  const [value, setValue] = useState("");
  const navigate = useNavigate(); // Add the useNavigate hook

  const setValueHandler = (e) => {
    setValue(e.target.value);
  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter" && value.trim() !== "") {
      e.preventDefault();
      joinRoom();
    }
  };

  const joinRoom = () => {
    console.log("Joined room with code:", value);
    navigate(`/room/${value}`); // Use the navigate function to navigate to the room
    closeBackdrop();
  };

  const closeBackdrop = useCallback(
    (e) => {
      e.stopPropagation();
      const modal = document.querySelector(
        `.${classes.modal}.${classes.active}`
      );
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
    },
    [setModalShown, setBackdropShown, setModalOpen]
  );

  return (
    <Modal
      closeBackdrop={closeBackdrop}
      setModalOpen={setModalOpen}
      setModalShown={setModalShown}
      modalShown={modalShown}
      setBackdropShown={setBackdropShown}
      backdropShown={backdropShown}
    >
      <h2>הזן את קוד החדר</h2>
      <input
        type="text"
        value={value}
        onChange={setValueHandler}
        onKeyDown={handleEnterPress}
      />
      <button onClick={joinRoom}>הצטרף</button>
    </Modal>
  );
};

export default JoinRoomModal;
