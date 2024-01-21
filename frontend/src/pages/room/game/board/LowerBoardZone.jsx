/* eslint-disable react/prop-types */
import classes from "./Board.module.scss";
import { motion } from "framer-motion";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import { useState } from "react";
import OperatorsModal from "../../../../components/OperatorsModal";

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
    setCurrentOperatorsWord
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
        <div className={`${classes.group} ${classes.red}`}>
          <div className={classes.cardsLeft}>{redGroupCounter}</div>
        </div>
        <div className={`${classes.group} ${classes.blue}`}>
          <div className={classes.cardsLeft}>{blueGroupCounter}</div>
        </div>
      </div>
      {role === "agent" && (
        <div className={classes.actionButtons}>
          <motion.button
            className={classes.lockWord}
            onClick={lockWordHandler}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
          >
            <span className={classes.icon}>
              {wordLocked ? <LockIcon /> : <LockOpenOutlinedIcon />}
            </span>
            <span className={classes.content}>
              {wordLocked ? "בטל בחירה" : "נעל בחירה"}
            </span>
          </motion.button>
        </div>
      )}
      {role === "operator" && (
        <div className={classes.actionButtons}>
          <motion.button
            onClick={openOperatorsModalHandler}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
          >
            <span className={classes.content}>הפעל סוכנים</span>
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default LowerBoardZone;
