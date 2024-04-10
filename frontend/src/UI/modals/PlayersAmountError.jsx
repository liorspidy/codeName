/* eslint-disable react/prop-types */
import { useState } from "react";
import Modal from "./Modal";
import { useCallback } from "react";
import classes from "./Modal.module.scss";

const PlayersAmountError = ({ setModalShown, modalShown, setModalOpen }) => {
  const [backdropShown, setBackdropShown] = useState(false);

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

  return (
    <div className={`${classes.backdrop} ${classes.playersAmountError}`}>
      <div className={classes.playersAmountErrorContainer}>
        <h2 className={classes.title}>המתן לשחקנים נוספים</h2>
        <p className={classes.error}>המשחק מושעה כרגע בגלל מחסור בשחקנים. </p>
        <p className={classes.error}>אנו זקוקים לעוד שחקנים כדי להמשיך </p>
      </div>
    </div>
  );
};

export default PlayersAmountError;
