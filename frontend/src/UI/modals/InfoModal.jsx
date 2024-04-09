/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Modal from "./Modal";
import { useCallback } from "react";
import classes from "./Modal.module.scss";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import HelpIcon from "@mui/icons-material/Help";

const InfoModal = ({
  setModalShown,
  modalShown,
  setModalOpen,
  roomDetails,
}) => {
  const [backdropShown, setBackdropShown] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [redTeamPlayers, setRedTeamPlayers] = useState([]);
  const [blueTeamPlayers, setBlueTeamPlayers] = useState([]);

  const tabs = [
    {
      title: "חוקי המשחק",
      icon: <HelpIcon sx={{ fontSize: "10dvw" }} />,
    },
    {
      title: "שחקנים",
      icon: <PeopleAltIcon sx={{ fontSize: "10dvw" }} />,
    },
  ];

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

  const tabsHandler = (tabIndx) => {
    setCurrentTab(tabIndx);
  };

  const mappedTabs = tabs.map((tab, index) => {
    return (
      <button
        className={`${classes.tab} ${
          currentTab === index ? classes.active : ""
        }`}
        key={index}
        title={tab.title}
        onClick={tabsHandler.bind(null, index)}
      >
        {tab.icon}
      </button>
    );
  });

  useEffect(() => {
    if (roomDetails) {
      setRedTeamPlayers(roomDetails.redTeam);
      setBlueTeamPlayers(roomDetails.blueTeam);
    }
  }, [roomDetails]);

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
        <div className={classes.tabs}>{mappedTabs}</div>

        {currentTab === 1 && (
          <div className={`${classes.content} ${classes.players}`}>
            <div className={classes.groups}>
              
              <div className={`${classes.group} ${classes.blue}`}>
                {blueTeamPlayers?.map((player, index) => (
                  <div className={classes.player} key={index}>
                    <span>{player.name}</span>
                  </div>
                ))}
              </div>

              <div className={`${classes.group} ${classes.red}`}>
                {redTeamPlayers?.map((player, index) => (
                  <div className={classes.player} key={index}>
                    <span>{player.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentTab === 0 && (
          <div className={`${classes.content} ${classes.howToPlay}`}>
            <h2>איך משחקים?</h2>
            <p className={classes.title}>מטרת המשחק</p>
            <p className={classes.text}>
              מטרת המשחק היא לנחש נכון כמה שיותר מילים בכל תור על פי הרמזים, תוך
              התחמקות ממילת המתנקש, ולהיות הראשונים שמנחשים נכון את כל המילים
              שלהם.
            </p>
            <p className={classes.title}>חוקי המשחק</p>
            <ul className={classes.list}>
              <li>2 קבוצות מתחרות, כל קבוצה בוחרת מפעיל</li>
              <li>25 קלפי מילים על השולחן, מיוצגים ע"י קלף הצפנה סודי</li>
              <li>
                מטרת כל קבוצה לנחש נכון את מילות הקוד שלה ע"פ הרמזים שנותן
                המפעיל
              </li>
              <li>
                כל תור קבוצה מקבלת רמז המורכב ממילה + מספר מילים שאליהן מתייחס
                הרמז
              </li>
              <li>אפשר לנחש מילה אחת לפחות ועוד מילה אחת נוספת</li>
              <li>
                כאשר נותרה מילת בונוס לנחש, ניתן לדלג על התור על ידי לחיצה על
                "דלג"
              </li>
              <li>ניחוש שגוי מסיים את התור, ניחוש נכון מאפשר המשך ניחושים</li>
              <li>
                מפסידה קבוצה שנוגעת במילת "המתנקש" או מסיימת את כל מילותיה
              </li>
            </ul>
            <p className={classes.title}>כללי הרמזים</p>
            <ul className={classes.list}>
              <li>
                הרמז חייב להיות במילה אחת בלבד. אסור שימוש בביטויים או צירופי
                מילים, חוץ מצירופים כמו "בית ספר" שהפכו למילה אחת.
              </li>
              <li>
                אסור להשתמש במילה מהשולחן או לשנות אותה קלות. למשל, אם יש את
                המילה "עט" על השולחן, אסור להגיד "עטרה".
              </li>
              <li>
                מותר להשתמש באיות של מילים. למשל, ניתן לומר "ע-ט" כרמז ל"עט".
              </li>
              <li>
                מותר להשתמש בחרוזים כל עוד הם מתקשרים למשמעות המילה. למשל "אופה"
                יכול לרמוז על "רופא".
              </li>
              <li>
                מותר להשתמש בשמות מקומות גם אם הם מורכבים משתי מילים, כמו "מצפה
                רמון".
              </li>
              <li>
                אסור להתייחס לאותיות המילה או למיקומה על השולחן. למשל, אסור
                להגיד "שלישית מימין לפינה" כרמז.
              </li>
              <li>
                מילים שנהגות זהה אבל נכתבות שונה (כמו עת/עט) נחשבות מילים שונות
                לעניין הרמזים.
              </li>
              <li>
                ניתן לאשר גם קיצורים וראשי תיבות כמו אחה"צ או שב"כ, בהסכמת
                השחקנים.
              </li>
              <li>אין חובה לקשר את הרמז למשמעות המילה, אך זה עדיף.</li>
            </ul>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default InfoModal;
