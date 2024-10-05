/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
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
  setNotificationsNumber,
  messages,
  setMessages,
}) => {
  const [backdropShown, setBackdropShown] = useState(false);
  const [messageValue, setMessageValue] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const playerDetails = sessionStorage.getItem("token")
    ? jwtDecode(sessionStorage.getItem("token"))
    : null;

  const { roomId } = useParams();
  const messageRefs = useRef({}); // Store refs for each message
  const unreadMessageBuffer = useRef([]); // Buffer to store unread messages
  const debounceTimeout = useRef(null); // Ref to hold the debounce timer

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

  const debounceMarkMessagesAsRead = () => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (unreadMessageBuffer.current.length > 0) {
        // Send unread messages in bulk
        axios
          .post(`${siteUrl}/room/${roomId}/readMessages`, {
            roomId,
            messageIds: unreadMessageBuffer.current,
            playerName: playerDetails.name,
          })
          .then(() => {
            unreadMessageBuffer.current = []; // Clear the buffer
          })
          .catch((err) => console.error(err));
      }
    }, 500); // 500ms debounce period
  };

  const handleMarkMessageAsRead = (messageId) => {
    unreadMessageBuffer.current.push(messageId);
    debounceMarkMessagesAsRead();
  };

  // Get messages on initial load and reset notifications number
  useEffect(() => {
    getMessages().then(() => {
      setNotificationsNumber(0);
    });
  }, [roomId, siteUrl]);

  // Set up the observer to mark messages as read
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageId = entry.target.dataset.messageId;
            const message = messages.find((msg) => msg._id === messageId);

            if (message && !message.readBy.includes(playerDetails.name)) {
              handleMarkMessageAsRead(messageId); // Debounced message read
            }
          }
        });
      },
      {
        root: document.querySelector(`.${classes.chatBoxBody}`), // Observe within chat box
        threshold: 0.5, // Trigger when 10% of the message is visible
      }
    );

    // Observe each message
    Object.values(messageRefs.current).forEach((messageRef) => {
      if (messageRef) {
        observer.observe(messageRef);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [messages]);

  // Handle sending message to the server
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

  // Handle sending message on Enter key press
  const handleEnterPress = async (e) => {
    if (e.key === "Enter") {
      await sendMessageHandler();
    }
  };

  //  Handle typing message in input
  const typeMessage = (e) => {
    setMessageValue(e.target.value);
  };

  // Parse messages to display in chat box body
  const parsedMessages = messages.map((message) => {
    const isSenderMe = playerDetails.name === message.senderNick;
    return (
      <li
        key={message._id}
        className={`${classes.chatMessage} ${
          isSenderMe ? classes.right : classes.left
        }`}
        data-message-id={message._id} // Add data attribute for message ID
        ref={(el) => (messageRefs.current[message._id] = el)} // Set ref for each message
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
          {isLoading && messages.length === 0 && (
            <div className={classes.loaderContainer}>
              <Loader />
            </div>
          )}
          {!isLoading && messages.length > 0 && (
            <ul className={classes.chatBoxBody}>{parsedMessages}</ul>
          )}
          {!isLoading && !messages.length && (
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
