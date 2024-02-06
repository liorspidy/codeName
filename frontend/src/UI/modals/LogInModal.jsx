/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Modal from "./Modal";
import { useCallback } from "react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import classes from "./Modal.module.scss";
import Loader from "../loader/Loader";
import axios from "axios";
import Button from "../button/Button";

const LogInModal = ({ setModalShown, modalShown, setModalOpen , setLogedInPlayer }) => {
  const [backdropShown, setBackdropShown] = useState(false);
  const [error, setError] = useState("");
  const [usernameValue, setUsernameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [logingIn, setlogingIn] = useState(false);
  const [passwordType, setPasswordType] = useState(true);

  const setUsernameValueHandler = (e) => {
    setUsernameValue(e.target.value);
  };

  const setPasswordValueHandler = (e) => {
    setPasswordValue(e.target.value);
  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      logInHandler();
    }
  };

  const logInHandler = () => {
    if (usernameValue.trim() === "" && passwordValue.trim() === "") {
      setError("יש להזין שם משתמש וסיסמה תקניים");
    } else if (usernameValue.trim() === "") {
      setError("יש להזין שם משתמש תקני");
      return;
    } else if (passwordValue.trim() === "" || passwordValue.length < 8) {
      setError("יש להזין סיסמה תקנית");
      return;
    } else {
      setlogingIn(true);
    }
  };

  const changePasswordType = () => {
    setPasswordType((prevState) => !prevState);
  };

  const closeBackdrop = useCallback(() => {
    const modal = document.querySelector(`.${classes.modal}.${classes.active}`);
    const backdrop = document.querySelector(
      `.${classes.backdrop}.${classes.active}`
    );
    setModalShown(false);
    modal.addEventListener(
      "animationend",
      () => {
        setBackdropShown(false);
      },
      { once: true }
    );
    backdrop.addEventListener(
      "animationend",
      () => {
        setModalOpen(false);
      },
      { once: true }
    );
  }, [setModalShown, setBackdropShown, setModalOpen]);

  useEffect(() => {
    setlogingIn(false);
  }, []);

  const loginAsUser = async () => {
    try {
      const response = await axios.post("http://localhost:4000/auth/login", {
        username: usernameValue,
        password: passwordValue,
      });
      closeBackdrop();
      setlogingIn(false);
      sessionStorage.setItem("token", response.data.token);
      setLogedInPlayer(true);
    } catch (error) {
      if (error.response) {
        setlogingIn(false);
        setError("אנא בדוק את שם המשתמש והסיסמה שהזנת ונסה שנית");
      }
    }
  };

  useEffect(() => {
    if (logingIn) {
      loginAsUser();
    }
  }, [logingIn, loginAsUser]);

  return (
    <Modal
      closeBackdrop={closeBackdrop}
      setModalOpen={setModalOpen}
      setModalShown={setModalShown}
      modalShown={modalShown}
      setBackdropShown={setBackdropShown}
      backdropShown={backdropShown}
    >
      {!logingIn && (
        <div className={classes.logInModal}>
          <h2>הזן את פרטי ההתחברות</h2>
          <input
            className={classes.userNameInput}
            type="text"
            value={usernameValue}
            onChange={setUsernameValueHandler}
            onKeyDown={handleEnterPress}
            placeholder="שם משתמש"
          />
          <div className={classes.passwordInputContainer}>
            <input
              className={classes.passwordInput}
              type={passwordType ? "password" : "text"}
              value={passwordValue}
              onChange={setPasswordValueHandler}
              onKeyDown={handleEnterPress}
              placeholder="סיסמה"
            />
            <span onClick={changePasswordType}>
              {!passwordType && <VisibilityIcon sx={{ color: "black" }} />}
              {passwordType && <VisibilityOffIcon sx={{ color: "black" }} />}
            </span>
          </div>
          {!!error.length && <p className={classes.error}>{error}</p>}
          <Button classname={classes.actionButton} onclick={logInHandler}>
            <span>התחברות</span>
          </Button>
          <a href="/forgotPass">שכחתי סיסמה</a>
        </div>
      )}
      {logingIn && (
        <div className={classes.logInModal}>
          <h2>מתחבר לחשבון נא המתן...</h2>
          <Loader />
        </div>
      )}
    </Modal>
  );
};

export default LogInModal;
