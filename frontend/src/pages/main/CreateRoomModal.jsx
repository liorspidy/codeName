/* eslint-disable react/prop-types */
import { useState } from "react";
import Modal from "../../UI/Modal";
import { useCallback } from "react";
import classes from "../../UI/Modal.module.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setRoomId } from '../../store/slices/roomSlice';

const CreateRoomModal = ({ setModalShown, modalShown, setModalOpen }) => {
  const [backdropShown, setBackdropShown] = useState(false);
  const [error, setError] = useState('');
  const [value, setValue] = useState("");
  
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const setValueHandler = (e) => {
    setValue(e.target.value);
  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter" && value.trim() !== "") {
      createRoom();
    }
  };

  const createRoom = () => {
    console.log("Room created:", value);
    if (value.trim() === "") {
      setError('יש להזין את שם או מספר החדר');
      return;
    } else {
      // Dispatch action to set room ID in Redux store
      dispatch(setRoomId(value));
      navigate(`/room/${value}`);
    }
    closeBackdrop();
  };

  const closeBackdrop = useCallback(
    () => {
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
      <h2>הזן את שם או מספר החדר</h2>
      <input
        type="text"
        value={value}
        onChange={setValueHandler}
        onKeyDown={handleEnterPress}
      />
      {!!error.length && <p className={classes.error}>{error}</p>}
      <button className={classes.actionButton} onClick={createRoom}>
        <span>יצירה</span>
      </button>
    </Modal>
  );
};

export default CreateRoomModal;
