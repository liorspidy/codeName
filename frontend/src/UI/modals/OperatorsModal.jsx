/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Modal from "./Modal";
import { useCallback } from "react";
import classes from "./Modal.module.scss";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import { useParams } from "react-router-dom";
import Button from "../button/Button";

const OperatorsModal = (props) => {
  const {
    setModalShown,
    modalShown,
    setModalOpen,
    setCurrentOperatorsWordCount,
    setCurrentOperatorsWord,
    setWordsToGuess,
    socket,
  } = props;
  const [backdropShown, setBackdropShown] = useState(false);
  const [wordsCountValue, setWordsCountValue] = useState(1);
  const [wordValue, setWordValue] = useState("");

  const [error, setError] = useState("");
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

  const wordsCountHandler = (e) => {
    // Ensure the input value is within the range of 1 to 25
    const value = Math.min(25, Math.max(1, parseInt(e.target.value, 10)));
    setWordsCountValue(value);
  };

  const moreWordsHandler = () => {
    setWordsCountValue((prevState) => Math.min(25, prevState + 1));
  };

  const lessWordsHandler = () => {
    setWordsCountValue((prevState) => Math.max(1, prevState - 1));
  };

  const setWordInDb = async () => {
    try {
      await axios.post(
        `http://localhost:4000/room/${roomId}/setOperatorsWord`,
        {
          roomId,
          word: wordValue,
          count: wordsCountValue,
          wordsToGuess: wordsCountValue + 1,
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const submitWordHandler = () => {
    if (wordsCountValue > 0 && wordsCountValue <= 25 && wordValue.length > 0) {
      // setCurrentOperatorsWordCount(wordsCountValue);
      // setCurrentOperatorsWord(wordValue);
      socket.emit("operatorsWordSet", roomId, wordValue, wordsCountValue);
      setWordsToGuess(wordsCountValue + 1);
      setWordInDb();
      closeBackdrop();
    } else {
      setError("אחד או יותר מהשדות לא מולאו כראוי");
    }
  };

  const wordValueChange = (e) => {
    const newValue = e.target.value.replace(/[^\p{L}\s]/gu, '');
    setWordValue(newValue);
  };
  

  // if the modal is shown and i press on enter the submitWordHandler will be called
  useEffect(() => {
    const keyDownHandler = (e) => {
      if (e.key === "Enter") {
        submitWordHandler();
      }
    };

    const arrowUpHandler = (e) => {
      if (e.key === "ArrowUp") {
        moreWordsHandler();
      }
    };

    const arrowDownHandler = (e) => {
      if (e.key === "ArrowDown") {
        lessWordsHandler();
      }
    };

    if (modalShown) {
      document.addEventListener("keydown", keyDownHandler);
      document.addEventListener("keydown", arrowUpHandler);
      document.addEventListener("keydown", arrowDownHandler);
    }

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keydown", arrowUpHandler);
      document.removeEventListener("keydown", arrowDownHandler);
    };
  }, [modalShown, wordValue , wordsCountValue]);

  return (
    <Modal
      closeBackdrop={closeBackdrop}
      setModalOpen={setModalOpen}
      setModalShown={setModalShown}
      modalShown={modalShown}
      setBackdropShown={setBackdropShown}
      backdropShown={backdropShown}
    >
      <div className={classes.operatorsModal}>
        <h2>הצע מילה לסוכנים</h2>
        <div className={classes.inputs}>
          <div className={classes.wordInput}>
            <input
              type="text"
              placeholder="הצע מילה"
              value={wordValue}
              onChange={wordValueChange}
              tabIndex="0"
            />
          </div>
          <div className={classes.wordsToFind}>
            <div className={classes.moreWords}>
              <IconButton
                onClick={moreWordsHandler}
                aria-label="add word"
                sx={{
                  backgroundColor: "#646cff",
                  color: "#fff",
                  ":hover": { backgroundColor: "#464cc2" },
                }}
              >
                <AddIcon />
              </IconButton>
            </div>
            <div className={classes.inputWordsCount}>
              <input
                type="number"
                value={wordsCountValue}
                onChange={wordsCountHandler}
              ></input>
            </div>
            <div className={classes.lessWords}>
              <IconButton
                onClick={lessWordsHandler}
                aria-label="reduce words"
                sx={{
                  backgroundColor: "#646cff",
                  color: "#fff",
                  ":hover": { backgroundColor: "#464cc2" },
                }}
              >
                <RemoveIcon />
              </IconButton>
            </div>
          </div>
          <div className={classes.submitWord}>
            <Button
              classname={classes.submitButton}
              onclick={submitWordHandler}
            >
              שלח מסר
            </Button>
          </div>
        </div>
        <div className={classes.error}>
          <p>{error}</p>
        </div>
      </div>
    </Modal>
  );
};

export default OperatorsModal;
