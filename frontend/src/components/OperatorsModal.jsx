/* eslint-disable react/prop-types */
import { useState } from "react";
import Modal from "../UI/Modal";
import { useCallback } from "react";
import classes from "../UI/Modal.module.scss";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";

const OperatorsModal = ({ setModalShown, modalShown, setModalOpen }) => {
  const [backdropShown, setBackdropShown] = useState(false);
  const [wordsCountValue, setWordsCountValue] = useState(1);

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

  const submitWordHandler = () => {
    
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
      <div className={classes.operatorsModal}>
        <h2>הצע מילה לסוכנים</h2>
        <div className={classes.inputs}>
          <div className={classes.wordInput}>
            <input type="text" placeholder="הצע מילה" />
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
                aria-label="remove word"
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
            <button className={classes.submitButton} onClick={submitWordHandler}>שלח מסר</button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default OperatorsModal;
