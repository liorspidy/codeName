/* eslint-disable react/prop-types */
import { useState } from "react";
import Modal from "./Modal";
import { useCallback } from "react";
import classes from "./Modal.module.scss";
import Button from "../button/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GameOverModal = ({
  setModalShown,
  modalShown,
  setModalOpen,
  winnerGroup,
  roomId,
  playerDetails,
  setPlayersInDb
}) => {
  const [backdropShown, setBackdropShown] = useState(false);
  const navigate = useNavigate();

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

    // Set teams in db
    const setPlayerNotReadyInDb = async (name) => {
      try {
        console.log("setting player not ready");
        const response = await axios.post(
          `http://localhost:4000/room/${roomId}/setPlayerNotReady`,
          {
            roomId,
            playerName: name,
          }
        );
        const room = response.data;
        await setPlayersInDb(roomId, room.players, room.redTeam, room.blueTeam);
      } catch (error) {
        console.error("An error occurred while setting player not ready:", error);
      }
    };

  const backToLobbyHandler = () => {
    setPlayerNotReadyInDb(playerDetails.name);
    closeBackdrop();
    navigate("/");
    sessionStorage.removeItem("lastRoomId");
  };

  const winnerGroupName =
    winnerGroup === "red" ? "האדומים" : winnerGroup === "blue" ? "הכחולים" : "";

  return (
    <Modal
      closeBackdrop={closeBackdrop}
      setModalOpen={setModalOpen}
      setModalShown={setModalShown}
      modalShown={modalShown}
      setBackdropShown={setBackdropShown}
      backdropShown={backdropShown}
    >
      <div className={classes.gameOverModal}>
        <h2 className={classes.title}>המשחק נגמר!</h2>
        <p className={classes.winnerIs}>הקבוצה המנצחת היא:</p>
        <p className={`${classes.winnerName} ${classes[winnerGroup]}`}>
          {winnerGroupName}
        </p>
        <div>
          <Button onclick={backToLobbyHandler}>חזרה למסך הראשי</Button>
        </div>
      </div>
    </Modal>
  );
};

export default GameOverModal;
