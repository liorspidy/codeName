/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Modal from "./Modal";
import { useCallback } from "react";
import SendIcon from "@mui/icons-material/Send";
import classes from "./Modal.module.scss";
import IconButton from "@mui/material/IconButton";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "../loader/Loader";

const ChatModal = ({
  setModalShown,
  modalShown,
  setModalOpen,
  siteUrl,
  socket,
  isLoading,
  setIsLoading,
}) => {
  const [backdropShown, setBackdropShown] = useState(false);
  const [messageValue, setMessageValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [sendingMessage, setSendingMessage] = useState(false);
  const playerDetails = sessionStorage.getItem("token")
    ? jwtDecode(sessionStorage.getItem("token"))
    : null;

  const { roomId } = useParams();

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

  const getMessages = async () => {
    try {
      setIsLoading(true);
      axios.get(`${siteUrl}/room/${roomId}/getMessages`).then((res) => {
        const messages = res.data;
        setMessages(messages);
      });
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMessages();
  }, [roomId, siteUrl]);

  useEffect(() => {
    socket.on("messageReceived", (myDetails, message) => {
      if (myDetails.name === playerDetails.name) return;
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("messageReceived");
    };
  }, [socket]);

  const sendMessageHandler = async () => {
    try {
      setIsLoading(true);
      setSendingMessage(true);
      await axios
        .post(`${siteUrl}/room/${roomId}/sendMessage`, {
          roomId,
          content: messageValue,
          sender: playerDetails,
        })
        .then((response) => {
          const messageSent = response.data;
          socket.emit("messageSent", roomId, messageSent, playerDetails);
          setMessages((prevMessages) => [...prevMessages, messageSent]);
          setMessageValue("");
        });
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
      setSendingMessage(false);
    }
  };

  const handleEnterPress = async (e) => {
    if (e.key === "Enter") {
      await sendMessageHandler();
    }
  };

  const typeMessage = (e) => {
    setMessageValue(e.target.value);
  };

  const parsedMessages = messages.map((message) => {
    const isSenderMe = playerDetails.name === message.senderNick;
    return (
      <li
        key={message._id}
        className={`${classes.chatMessage} ${
          isSenderMe ? classes.right : classes.left
        }`}
      >
        {!isSenderMe && (
          <span
            className={classes.senderName}
            style={{ "--sender-color": message.senderColor }}
          >
            {message.senderNick}
          </span>
        )}
        <span className={classes.messageContent}>{message.content}</span>
      </li>
    );
  });

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
          {isLoading && (
            <div className={classes.loaderContainer}>
              <Loader />
            </div>
          )}
          {!isLoading && messages.length > 0 && (
            <ul className={classes.chatBoxBody}>{parsedMessages}</ul>
          )}
          {!isLoading && (!messages.length) && (
            <span className={classes.noMessages}>אין הודעות</span>
          )}
        </div>
        <div className={classes.chatInput}>
          {!sendingMessage && !isLoading && (
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
          )}
          {sendingMessage && (
            <div className={classes.loadingMessageWrapper}>
              <Loader />
            </div>
          )}
          <input
            type="text"
            placeholder="כתוב הודעה..."
            value={messageValue}
            onChange={typeMessage}
            onKeyDown={handleEnterPress}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ChatModal;
