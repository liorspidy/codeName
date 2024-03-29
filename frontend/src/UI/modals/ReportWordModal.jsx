/* eslint-disable react/prop-types */
import { useState } from "react";
import Modal from "./Modal";
import { useCallback } from "react";
import classes from "./Modal.module.scss";
import axios from "axios";
import { useParams } from "react-router-dom";

const ReportWordModal = (props) => {
  const { setModalShown, modalShown, setModalOpen, roomDetails } = props;
  const [backdropShown, setBackdropShown] = useState(false);
  const [reportText, setReportText] = useState("");
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

  const reportWordHandler = () => {
    if (reportText.length === 0) {
      setError("אנא הזן סיבה לדיווח");
      return;
    } else {
      // open debate modal
      console.log("open debate modal");
      closeBackdrop();
    }
  };

  const reportWordTextChange = (e) => {
    setReportText(e.target.value);
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
      <div className={classes.reportWordModal}>
        <h2>הזן את סיבת הדיווח</h2>
        <div className={classes.inputs}>
          <textarea
            value={reportText}
            onChange={reportWordTextChange}
          ></textarea>
          <div className={classes.submitWord}>
            <button
              className={classes.submitButton}
              onClick={reportWordHandler}
            >
              צור דיווח
            </button>
          </div>
        </div>
        <div className={classes.error}>
          <p>{error}</p>
        </div>
      </div>
    </Modal>
  );
};

export default ReportWordModal;
