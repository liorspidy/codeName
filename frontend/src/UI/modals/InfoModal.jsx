/* eslint-disable react/prop-types */
import { useState } from "react";
import Modal from "./Modal";
import { useCallback } from "react";
import classes from "./Modal.module.scss";

const InfoModal = ({ setModalShown, modalShown, setModalOpen }) => {
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
    <Modal
      closeBackdrop={closeBackdrop}
      setModalOpen={setModalOpen}
      setModalShown={setModalShown}
      modalShown={modalShown}
      setBackdropShown={setBackdropShown}
      backdropShown={backdropShown}
    >
      <div className={classes.infoModal}>
        <h2>איך משחקים?</h2>
        <p className={classes.title}>מטרת המשחק</p>
        <p className={classes.text}>
          מטרת המשחק היא לנחש נכון כמה שיותר מילים בכל תור על פי הרמזים, תוך
          התחמקות ממילת המתנקש, ולהיות הראשונים שמנחשים נכון את כל המילים שלהם.
        </p>
        <p className={classes.title}>חוקי המשחק</p>
        <ul className={classes.list}>
          <li>2 קבוצות מתחרות, כל קבוצה בוחרת מפעיל</li>
          <li>25 קלפי מילים על השולחן, מיוצגים ע"י קלף הצפנה סודי</li>
          <li>
            מטרת כל קבוצה לנחש נכון את מילות הקוד שלה ע"פ הרמזים שנותן המפעיל
          </li>
          <li>
            כל תור קבוצה מקבלת רמז המורכב ממילה + מספר מילים שאליהן מתייחס הרמז
          </li>
          <li>אפשר לנחש מילה אחת לפחות ועוד מילה אחת נוספת</li>
          <li>ניחוש שגוי מסיים את התור, ניחוש נכון מאפשר המשך ניחושים</li>
          <li>מפסידה קבוצה שנוגעת במילת "המתנקש" או מסיימת את כל מילותיה</li>
        </ul>
        <p className={classes.title}>כללי הרמזים</p>
        <ul className={classes.list}>
          <li>
            הרמז חייב להיות במילה אחת בלבד. אסור שימוש בביטויים או צירופי מילים,
            חוץ מצירופים כמו "בית ספר" שהפכו למילה אחת.
          </li>
          <li>
            אסור להשתמש במילה מהשולחן או לשנות אותה קלות. למשל, אם יש את המילה
            "עט" על השולחן, אסור להגיד "עטרה".
          </li>
          <li>מותר להשתמש באיות של מילים. למשל, ניתן לומר "ע-ט" כרמז ל"עט".</li>
          <li>
            מותר להשתמש בחרוזים כל עוד הם מתקשרים למשמעות המילה. למשל "אופה"
            יכול לרמוז על "רופא".
          </li>
          <li>
            מותר להשתמש בשמות מקומות גם אם הם מורכבים משתי מילים, כמו "מצפה
            רמון".
          </li>
          <li>
            אסור להתייחס לאותיות המילה או למיקומה על השולחן. למשל, אסור להגיד
            "שלישית מימין לפינה" כרמז.
          </li>
          <li>
            מילים שנהגות זהה אבל נכתבות שונה (כמו עת/עט) נחשבות מילים שונות
            לעניין הרמזים.
          </li>
          <li>
            ניתן לאשר גם קיצורים וראשי תיבות כמו אחה"צ או שב"כ, בהסכמת השחקנים.
          </li>
          <li>אין חובה לקשר את הרמז למשמעות המילה, אך זה עדיף.</li>
        </ul>
      </div>
    </Modal>
  );
};

export default InfoModal;
