/* eslint-disable react/prop-types */
import { useCallback } from "react";
import classes from "./Modal.module.scss";
import { useEffect } from "react";

const Modal = ({
  children,
  closeBackdrop,
  modalShown,
  backdropShown,
  setBackdropShown,
}) => {
  useEffect(() => {
    if (modalShown) {
      setBackdropShown(true);
    }
  }, [modalShown, setBackdropShown]);

  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const backdropClassName = backdropShown
    ? `${classes.backdrop} ${classes.active}`
    : classes.backdrop;
  const modalClassName = modalShown
    ? `${classes.modal} ${classes.active}`
    : classes.modal;

  return (
    <div className={backdropClassName} onClick={closeBackdrop}>
      <div className={modalClassName} onClick={stopPropagation}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
