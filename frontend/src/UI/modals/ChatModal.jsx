/* eslint-disable react/prop-types */
import { useState } from "react";
import Modal from "./Modal";
import { useCallback } from "react";
import SendIcon from '@mui/icons-material/Send';
import classes from "./Modal.module.scss";
import IconButton from "@mui/material/IconButton";

const ChatModal = ({ setModalShown, modalShown, setModalOpen }) => {
  const [backdropShown, setBackdropShown] = useState(false);
  const [messageValue , setMessageValue] = useState("");

  const closeBackdrop = useCallback(() => {
    const modal = document.querySelector(`.${classes.modal}.${classes.active}`);
    const backdrop = document.querySelector(
      `.${classes.backdrop}.${classes.active}`
    );

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

  const sendMessageHandler = () => {
    console.log(messageValue);
  };

  const typeMessage = (e) => {
    setMessageValue(e.target.value);
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
        <IconButton
                onClick={sendMessageHandler}
                aria-label="send message"
                sx={{
                  backgroundColor: "#646cff",
                  color: "#fff",
                  ":hover": { backgroundColor: "#464cc2" },
                  width: "45px",
                  height: "45px",
                  alignSelf: "center",
                }}
              >
                <SendIcon />
              </IconButton>
          <input type="text" placeholder="כתוב הודעה..." value={messageValue} onChange={typeMessage} />
        </div>
      </div>
    </Modal>
  );
};

export default ChatModal;
