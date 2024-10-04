/* eslint-disable react/prop-types */
import { useCallback, useState } from "react";
import Modal from "./Modal";
import classes from "./Modal.module.scss";
import Loader from "../loader/Loader";
import Button from "../button/Button";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import MusicOffIcon from "@mui/icons-material/MusicOff";
import SensorsIcon from "@mui/icons-material/Sensors";
import SensorsOffIcon from "@mui/icons-material/SensorsOff";
import { motion } from "framer-motion";

const SettingsModal = ({
  setModalShown,
  modalShown,
  setModalOpen,
  siteUrl,
  setIsLoading,
  isLoading,
  backgroundMusic,
  bgMusicPlays,
  setBgMusicPlays,
  bgMusicVolume,
  setBgMusicVolume,
  soundEffectsAllowed,
  setSoundEffectsAllowed,
}) => {
  const [backdropShown, setBackdropShown] = useState(false);

  const closeSettingsHandler = () => {
    closeBackdrop();
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

  const bgMusicHandler = () => {
    if (bgMusicPlays) {
      backgroundMusic.pause();
      setBgMusicPlays(false);
      sessionStorage.setItem("musicPlaying", "false");
    } else {
      backgroundMusic.play();
      setBgMusicPlays(true);
      sessionStorage.setItem("musicPlaying", "true");
    }
  };

    const soundEffectsHandler = () => {
    if (soundEffectsAllowed) {
      setSoundEffectsAllowed(false);
      sessionStorage.setItem("soundEffects", "false");
    } else {
      setSoundEffectsAllowed(true);
      sessionStorage.setItem("soundEffects", "true");
    }
  }

  const bgVolumeHandler = (e) => {
    setBgMusicVolume(e.target.value);
    sessionStorage.setItem("musicVolume", e.target.value);
  };

  const bgMusicButton = (
    <motion.div
      onClick={bgMusicHandler}
      className={classes.settingsButton}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
    >
      {bgMusicPlays && (
        <MusicNoteIcon sx={{ color: "#000000", scale: "1.5" }} />
      )}
      {!bgMusicPlays && (
        <MusicOffIcon sx={{ color: "#000000", scale: "1.5" }} />
      )}{" "}
    </motion.div>
  );

  const effectsButton = (
    <motion.div
        onClick={soundEffectsHandler}
      className={classes.settingsButton}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
    >
      {soundEffectsAllowed && <SensorsIcon sx={{ color: "#000000", scale: "1.5" }} />}
      {!soundEffectsAllowed && (
        <SensorsOffIcon sx={{ color: "#000000", scale: "1.5" }} />
      )}
    </motion.div>
  );

  return (
    <Modal
      closeBackdrop={closeBackdrop}
      setModalOpen={setModalOpen}
      setModalShown={setModalShown}
      modalShown={modalShown}
      setBackdropShown={setBackdropShown}
      backdropShown={backdropShown}
    >
      <div className={classes.settingsModal}>
        <h2 className={classes.title}>הגדרות</h2>
        <div className={classes.actionWrapper}>
          <span className={classes.subtitle}>מוזיקה:</span>
          {bgMusicButton}
        </div>
        <div className={classes.actionWrapper}>
          <span className={classes.subtitle}>עוצמת מוזיקה:</span>
          <input
            className={classes.bgMusicVolume}
            type="range"
            min="0"
            max="1"
            step="0.1"
            defaultValue={bgMusicVolume}
            onChange={bgVolumeHandler}
          />
        </div>
        <div className={classes.actionWrapper}>
          <span className={classes.subtitle}>אפקטים:</span>
          {effectsButton}
        </div>
        <Button classname={classes.actionButton} onclick={closeSettingsHandler}>
          <span>יציאה</span>
        </Button>
      </div>
    </Modal>
  );
};

export default SettingsModal;
