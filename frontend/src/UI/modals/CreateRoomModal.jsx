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

const CreateRoomModal = ({ setModalShown, modalShown, setModalOpen }) => {
  const [backdropShown, setBackdropShown] = useState(false);
  const [error, setError] = useState("");
  const [value, setValue] = useState("");
  const [creatingRoom, setCreatingRoom] = useState(false);
  const playerDetails = sessionStorage.getItem("token")
    ? jwtDecode(sessionStorage.getItem("token"))
    : null;
  let navigate = useNavigate();

  const setValueHandler = (e) => {
    setValue(e.target.value);
  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      createRoom();
    }
  };

  useEffect(() => {
    setCreatingRoom(false);
  }, []);

  const createRoom = () => {
    if (value.trim() === "") {
      setError("יש להזין את שם או מספר החדר");
      return;
    } else {
      setCreatingRoom(true);
    }
  };

  const createRoomInDb = async () => {
    try {
      const response = await axios.post("http://localhost:4000/room/create", {
        roomName: value,
        createdBy: playerDetails.name,
      });
      closeBackdrop();
      setCreatingRoom(false);
      navigate(`/room/${response.data.id}`);
    } catch (error) {
      if (error.response) {
        setCreatingRoom(false);
        if (error.response.status === 400) {
          setError("שם החדר כבר קיים במערכת, אנא בחר שם אחר");
        } else if (error.response.status === 401) {
          setError("שם החדר לא יכול להיות מעל 20 תווים");
        } else {
          setError("ארעה שגיאה בעת יצירת החדר");
        }
      }
    }
  };

  useEffect(() => {
    if (creatingRoom) {
      createRoomInDb();
    }
  }, [createRoomInDb, creatingRoom]);

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
          <h2 className={classes.title}>הזן את שם החדר</h2>
          <input
            type="text"
            value={value}
            onChange={setValueHandler}
            onKeyDown={handleEnterPress}
            placeholder="שם החדר"
          />
          {!!error.length && <p className={classes.error}>{error}</p>}
          <Button classname={classes.actionButton} onclick={createRoom}>
            <span>יצירה</span>
          </Button>
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
