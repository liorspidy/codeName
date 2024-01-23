/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Modal from "../../UI/Modal";
import { useCallback } from "react";
import classes from "../../UI/Modal.module.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setRoomId } from "../../store/slices/roomSlice";
import Loader from "../../UI/Loader";

const CreateRoomModal = ({ setModalShown, modalShown, setModalOpen }) => {
  const [backdropShown, setBackdropShown] = useState(false);
  const [error, setError] = useState("");
  const [value, setValue] = useState("");
  const [creatingRoom, setCreatingRoom] = useState(false);

  const dispatch = useDispatch();
  let navigate = useNavigate();

  const setValueHandler = (e) => {
    setValue(e.target.value);
  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      createRoom();
    }
  };

  const createRoom = () => {
    if (value.trim() === "") {
      console.log("empty")
      setError("יש להזין את שם או מספר החדר");
      return;
    } else {
      // Dispatch action to set room ID in Redux store
      dispatch(setRoomId(value));
      //check if this room exists, if not, create it
      setCreatingRoom(true);
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
    setCreatingRoom(false);
  }, []);

  useEffect(() => {
    if (creatingRoom) {
      const timeout = setTimeout(() => {
        closeBackdrop();
        setCreatingRoom(false);
        navigate(`/room/${value}`);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [creatingRoom, closeBackdrop, navigate, value]);

  return (
    <Modal
      closeBackdrop={closeBackdrop}
      setModalOpen={setModalOpen}
      setModalShown={setModalShown}
      modalShown={modalShown}
      setBackdropShown={setBackdropShown}
      backdropShown={backdropShown}
    >
      {!creatingRoom && (
        <div className={classes.createRoomModal}>
          <h2>הזן את שם או מספר החדר</h2>
          <input
            type="text"
            value={value}
            onChange={setValueHandler}
            onKeyDown={handleEnterPress}
            placeholder="מספר החדר"
          />
          {!!error.length && <p className={classes.error}>{error}</p>}
          <button className={classes.actionButton} onClick={createRoom}>
            <span>יצירה</span>
          </button>
        </div>
      )}
      {creatingRoom && (
        <div className={classes.createRoomModal}>
          <h2>החדר נוצר נא המתן...</h2>
          <Loader />
        </div>
      )}
    </Modal>
  );
};

export default CreateRoomModal;
