/* eslint-disable react/prop-types */
import { useState } from "react";
import Modal from "../../UI/Modal";
import { useCallback } from "react";
import classes from "../../UI/Modal.module.scss";
import { Link , useNavigate} from "react-router-dom";

const CreateRoomModal = ({ setModalShown, modalShown, setModalOpen }) => {
  const [backdropShown, setBackdropShown] = useState(false);
  const [value, setValue] = useState("");

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
    navigate(`/room/${value}`);
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
      <h2>הזן את שם החדר</h2>
      <input
        type="text"
        placeholder="שם החדר"
        value={value}
        onChange={setValueHandler}
        onKeyDown={handleEnterPress}
      />
      <Link to={`/room/${value}`}>
        <button className={classes.actionButton} onClick={createRoom}>
          <span>יצירה</span>
        </button>
      </Link>
    </Modal>
  );
};

export default CreateRoomModal;
