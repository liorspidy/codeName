/* eslint-disable react/prop-types */
import { useState } from "react";
import Modal from "../../UI/Modal"
import { useCallback } from "react";
import classes from '../../UI/Modal.module.scss';

const JoinRoomModal = ({ setModalShown , modalShown ,setModalOpen}) => {
  const [backdropShown, setBackdropShown] = useState(false);

    const closeBackdrop = useCallback((e) => {
      e.stopPropagation();
      const modal = document.querySelector(`.${classes.modal}.${classes.active}`);
      const backdrop = document.querySelector(`.${classes.backdrop}.${classes.active}`);
      setModalShown(false);
      modal.addEventListener('animationend', () => {
      setBackdropShown(false);
      }, { once: true });
      backdrop.addEventListener('animationend', () => {
        setModalOpen(false);
      }, { once: true });
    }, [setModalShown, setBackdropShown , setModalOpen]);

  return (
  <Modal closeBackdrop={closeBackdrop} setModalOpen={setModalOpen} setModalShown={setModalShown} modalShown={modalShown} setBackdropShown={setBackdropShown} backdropShown={backdropShown}>
    <h2>הזן את קוד החדר</h2>
    <input type="text"  placeholder='קוד החדר'/>
    <button onClick={closeBackdrop}>
      הצטרף
    </button>
  </Modal>
  )
}

export default JoinRoomModal