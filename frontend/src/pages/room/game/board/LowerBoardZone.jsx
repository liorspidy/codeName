/* eslint-disable react/prop-types */
import classes from "./Board.module.scss";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import { useState } from "react";
import OperatorsModal from "../../../../UI/modals/OperatorsModal";
import Button from "../../../../UI/button/Button";

const LowerBoardZone = (props) => {
  const {
    redGroupCounter,
    blueGroupCounter,
    currentCard,
    wordLocked,
    setWordLocked,
    setTimerStarts,
    restartClock,
    role,
    setCurrentOperatorsWordCount,
    setCurrentOperatorsWord,
    currentGroupColor,
  } = props;

  const [opanOperatorsModal, setOpenOperatorsModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const lockWordHandler = () => {
    if (currentCard !== null) {
      setWordLocked((prevState) => !prevState);
      if (!wordLocked) {
        setTimerStarts(true);
      } else {
        restartClock();
      }
    } else {
      restartClock();
    }
  };

  const openOperatorsModalHandler = () => {
    setModalOpen(!modalOpen);
    setOpenOperatorsModal(!opanOperatorsModal);
  };

  return (
    <div className={classes.lowerBoardZone}>
      {modalOpen && (
        <OperatorsModal
          setModalOpen={setModalOpen}
          setModalShown={setOpenOperatorsModal}
          modalShown={opanOperatorsModal}
          setCurrentOperatorsWordCount={setCurrentOperatorsWordCount}
          setCurrentOperatorsWord={setCurrentOperatorsWord}
        />
      )}
      <div className={classes.scoreTable}>
        <div
          className={`${classes.group} ${classes.red} ${
            currentGroupColor === "red" ? classes.glow : ""
          }`}
        >
          <div className={classes.cardsLeft}>{redGroupCounter}</div>
        </div>
        <div
          className={`${classes.group} ${classes.blue} ${
            currentGroupColor === "blue" ? classes.glow : ""
          }`}
        >
          <div className={classes.cardsLeft}>{blueGroupCounter}</div>
        </div>
      </div>
      {role === "agent" && (
        <div className={classes.actionButtons}>
          <Button classname={classes.lockWord} onclick={lockWordHandler}>
            <span className={classes.icon}>
              {wordLocked ? <LockIcon /> : <LockOpenOutlinedIcon />}
            </span>
            <span className={classes.content}>
              {wordLocked ? "בטל בחירה" : "נעל בחירה"}
            </span>
          </Button>
        </div>
      )}
      {role === "operator" && (
        <div className={classes.actionButtons}>
          <Button onclick={openOperatorsModalHandler}>
            <span className={classes.content}>הפעל סוכנים</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default LowerBoardZone;
