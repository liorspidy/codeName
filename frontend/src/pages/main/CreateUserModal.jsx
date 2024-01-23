/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Modal from "../../UI/Modal";
import { useCallback } from "react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import classes from "../../UI/Modal.module.scss";
import Loader from "../../UI/Loader";
import axios from "axios";

const CreateUserModal = ({ setModalShown, modalShown, setModalOpen }) => {
  const [backdropShown, setBackdropShown] = useState(false);
  const [error, setError] = useState("");
  const [usernameValue, setUsernameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [emailValue, setEmailValue] = useState(""); // Add state for email
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [passwordType, setPasswordType] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isEmailValid, setIsEmailValid] = useState(true); // Add state for email validation

  const setUsernameValueHandler = (e) => {
    setUsernameValue(e.target.value);
  };

  const setPasswordValueHandler = (e) => {
    const value = e.target.value;
    setPasswordValue(value);

    // Check password strength based on the rules
    const hasMinimumLength = value.length >= 8;
    const hasLowercaseLetter = /[a-z]/.test(value);
    const hasUppercaseLetter = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);

    // Calculate password strength
    if (value === "") {
      setPasswordStrength(0); // No password
    } else if (
      hasMinimumLength &&
      hasLowercaseLetter &&
      hasUppercaseLetter &&
      hasNumber
    ) {
      setPasswordStrength(3); // Excellent password
    } else if (
      hasMinimumLength &&
      (hasLowercaseLetter || hasUppercaseLetter || hasNumber)
    ) {
      setPasswordStrength(2); // Strong password
    } else {
      setPasswordStrength(1); // Password doesn't meet any of the criteria
    }
  };

  const setEmailValueHandler = (e) => {
    const value = e.target.value;
    setEmailValue(value);

    // Validate the email using a simple regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(value));
  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter") {
      createUserHandler();
    }
  };

  const createUserHandler = () => {
    const trimmedUsername = usernameValue.trim();
    const trimmedPassword = passwordValue.trim();

    if (trimmedUsername.length < 2) {
      setError("שם משתמש חייב להכיל לפחות 2 תווים");
    } else if (trimmedPassword.length < 8) {
      setError("סיסמה חייבת להכיל לפחות 8 תווים");
    } else if (!isEmailValid || emailValue === "") {
      setError("יש להזין כתובת אימייל חוקית");
    } else if (
      /[a-z]/.test(trimmedPassword) &&
      /[A-Z]/.test(trimmedPassword) &&
      /\d/.test(trimmedPassword)
    ) {
      // Password is considered strong (contains lowercase, uppercase, and digit)
      setCreatingAccount(true);
    } else {
      setError(
        "יש להזין סיסמה חזקה, הכוללת אותיות קטנות, אותיות גדולות ומספרים"
      );
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
    setCreatingAccount(false);
  }, []);

  const registerUser = async () => {
    try {
      const response = await axios.post("http://localhost:4000/auth/register", {
        username: usernameValue,
        email: emailValue,
        password: passwordValue,
      });
      closeBackdrop();
      setCreatingAccount(false);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setCreatingAccount(false);
        setError("שם המשתמש שנבחר כבר קיים במערכת. אנא בחר שם משתמש אחר.");
      } else if (error.response && error.response.status === 410) {
        setCreatingAccount(false);
        setError("הדואר האלקטרוני שנבחר כבר קיים במערכת. אנא בחר דואר אלקטרוני אחר.");
      } else {
        setCreatingAccount(false);
        setError("ארעה שגיאה בעת יצירת החשבון. אנא נסה שוב מאוחר יותר.");
      }
    }
  };

  useEffect(() => {
    if (creatingAccount) {
      registerUser();
    }
  }, [creatingAccount, registerUser]);

  const passwordStrengthText =
    passwordStrength === 1
      ? "חלשה"
      : passwordStrength === 2
      ? "חזקה"
      : passwordStrength === 3
      ? "מצוינת"
      : "";

  return (
    <Modal
      closeBackdrop={closeBackdrop}
      setModalOpen={setModalOpen}
      setModalShown={setModalShown}
      modalShown={modalShown}
      setBackdropShown={setBackdropShown}
      backdropShown={backdropShown}
    >
      {!creatingAccount && (
        <div className={classes.createUserModal}>
          <h2>הזן את פרטי ההרשמה</h2>
          <input
            className={classes.userNameInput}
            type="text"
            value={usernameValue}
            onChange={setUsernameValueHandler}
            onKeyDown={handleEnterPress}
            placeholder="שם משתמש"
          />
          <input
            className={classes.emailInput}
            type="text"
            value={emailValue}
            onChange={setEmailValueHandler}
            onKeyDown={handleEnterPress}
            placeholder="כתובת אימייל"
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
          <div className={classes.passwordStrength}>
            <p className={classes.text}>עוצמת הסיסמה</p>
            <div
              className={`${classes.passwordStrengthBar} ${
                passwordStrength === 1
                  ? classes.weak
                  : passwordStrength === 2
                  ? classes.strong
                  : passwordStrength === 3
                  ? classes.excellent
                  : ""
              }`}
            />
            <span className={classes.grade}>{passwordStrengthText}</span>
          </div>
          <div className={classes.passwordRules}>
            <p className={classes.text}>הסיסמה חייבת להכיל</p>
            <ul className={classes.rulesList}>
              <li
                className={`${classes.passwordRule} ${
                  passwordStrength >= 1 ? classes.checked : ""
                }`}
              >
                לפחות 8 תווים
              </li>
              <li
                className={`${classes.passwordRule} ${
                  passwordStrength >= 2 ? classes.checked : ""
                }`}
              >
                לפחות אות קטנה אחת
              </li>
              <li
                className={`${classes.passwordRule} ${
                  passwordStrength >= 2 ? classes.checked : ""
                }`}
              >
                לפחות אות גדולה אחת
              </li>
              <li
                className={`${classes.passwordRule} ${
                  passwordStrength >= 3 ? classes.checked : ""
                }`}
              >
                לפחות מספר אחד
              </li>
            </ul>
          </div>
          {!!error.length && <p className={classes.error}>{error}</p>}
          <button className={classes.actionButton} onClick={createUserHandler}>
            <span>צור חשבון</span>
          </button>
        </div>
      )}
      {creatingAccount && (
        <div className={classes.logInModal}>
          <h2>יוצר חשבון נא המתן...</h2>
          <Loader />
        </div>
      )}
    </Modal>
  );
};

export default CreateUserModal;
