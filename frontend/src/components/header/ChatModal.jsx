/* eslint-disable react/prop-types */
import { useState } from "react";
import Modal from "../../UI/Modal";
import { useCallback } from "react";
import classes from "../../UI/Modal.module.scss";

const ChatModal = ({ setModalShown, modalShown, setModalOpen }) => {
  const [backdropShown, setBackdropShown] = useState(false);

  const closeBackdrop = useCallback(() => {
    const modal = document.querySelector(`.${classes.modal}.${classes.active}`);
    const backdrop = document.querySelector(
      `.${classes.backdrop}.${classes.active}`
    );
    console.log(modal, backdrop);

    if (modal) {
      modal.addEventListener(
        "animationend",
        () => {
          setBackdropShown(false);
        },
        { once: true }
      );
    }

    if (backdrop) {
      backdrop.addEventListener(
        "animationend",
        () => {
          setModalOpen(false);
        },
        { once: true }
      );
    }

    setModalShown(false);
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
      <div className={classes.chatModal}>
        <div className={classes.chatBox}>
          <div className={classes.chatBoxBody}>
            <div
              className={`${classes.chatBoxBodyChatMessage} ${classes.left}`}
            >
              <p>Message</p>
            </div>
            <div
              className={`${classes.chatBoxBodyChatMessage} ${classes.left}`}
            >
              <p>Message</p>
            </div>
            <div
              className={`${classes.chatBoxBodyChatMessage} ${classes.left}`}
            >
              <p>Message</p>
            </div>
            <div
              className={`${classes.chatBoxBodyChatMessage} ${classes.left}`}
            >
              <p>Message</p>
            </div>
            <div
              className={`${classes.chatBoxBodyChatMessage} ${classes.left}`}
            >
              <p>Message</p>
            </div>
            <div
              className={`${classes.chatBoxBodyChatMessage} ${classes.left}`}
            >
              <p>Message</p>
            </div>
            <div
              className={`${classes.chatBoxBodyChatMessage} ${classes.left}`}
            >
              <p>Message</p>
            </div>
            <div
              className={`${classes.chatBoxBodyChatMessage} ${classes.left}`}
            >
              <p>Message</p>
            </div>
          </div>
        </div>
        <div className={classes.chatInput}>
          <input type="text" placeholder="כתוב הודעה..." />
        </div>
      </div>
    </Modal>
  );
};

export default ChatModal;
