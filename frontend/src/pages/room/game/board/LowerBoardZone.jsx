/* eslint-disable react/prop-types */
import classes from "./Board.module.scss";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import { useEffect, useState } from "react";
import OperatorsModal from "../../../../UI/modals/OperatorsModal";
import Button from "../../../../UI/button/Button";
import { useParams } from "react-router-dom";
import axios from "axios";

const LowerBoardZone = (props) => {
  const {
    redGroupCounter,
    blueGroupCounter,
    currentCard,
    wordLocked,
    setWordLocked,
    timerStarts,
    restartClock,
    role,
    currentOperatorsWord,
    currentOperatorsWordCount,
    setCurrentOperatorsWordCount,
    setCurrentOperatorsWord,
    setNewWordSetted,
    currentGroupColor,
    myDetails,
    wordsToGuess,
    setWordsToGuess,
    gameOver,
    roomDetails,
    players,
    redTeamPlayers,
    blueTeamPlayers,
    socket,
    setTimeRanOut,
    siteUrl,
    operatorTypes,
    setOperatorTypes,
  } = props;

  const [opanOperatorsModal, setOpenOperatorsModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [groupMembersLength, setGroupMembersLength] = useState(2);
  const { roomId } = useParams();

  const updateTimerInDb = async (
    tempPlayers,
    finalRedTeamPlayers,
    finalBlueTeamPlayers
  ) => {
    try {
      const res = await axios.post(`${siteUrl}/room/${roomId}/updateTimer`, {
        roomId,
        myDetails: myDetails,
        tempPlayers: tempPlayers,
        tempRedTeam: finalRedTeamPlayers,
        tempBlueTeam: finalBlueTeamPlayers,
      });
      socket.emit(
        "lockCard",
        roomId,
        myDetails,
        tempPlayers,
        finalRedTeamPlayers,
        finalBlueTeamPlayers,
        res.data,
        wordLocked
      );
    } catch (error) {
      console.error("Error updating timer in db:", error.message);
    }
  };

  // Switch the pickedCard state for the player
  const switchPickedCardStateForMe = () => {
    // Switch the pickedCard state in players array
    const tempPlayers = [...players];
    const playerIndex = tempPlayers.findIndex(
      (player) => player.name === myDetails.name
    );
    tempPlayers[playerIndex].pickedCard = !tempPlayers[playerIndex].pickedCard;
    if (!wordLocked) {
      tempPlayers[playerIndex].cardIndex = currentCard.index;
    } else {
      tempPlayers[playerIndex].cardIndex = -1;
    }

    // Switch the pickedCard state in redTeamPlayers or blueTeamPlayers array

    let finalRedTeamPlayers = redTeamPlayers;
    let finalBlueTeamPlayers = blueTeamPlayers;

    const isOnRedTeam = redTeamPlayers.find(
      (player) => player.name === myDetails.name
    );
    const isOnBlueTeam = blueTeamPlayers.find(
      (player) => player.name === myDetails.name
    );
    if (isOnRedTeam) {
      const index = redTeamPlayers.findIndex(
        (player) => player.name === myDetails.name
      );
      const tempRedTeamPlayers = [...redTeamPlayers];
      tempRedTeamPlayers[index].pickedCard =
        !tempRedTeamPlayers[index].pickedCard;
      if (!wordLocked) {
        tempRedTeamPlayers[index].cardIndex = currentCard.index;
      } else {
        tempRedTeamPlayers[index].cardIndex = -1;
      }
      finalRedTeamPlayers = tempRedTeamPlayers;
    } else if (isOnBlueTeam) {
      const index = blueTeamPlayers.findIndex(
        (player) => player.name === myDetails.name
      );
      const tempBlueTeamPlayers = [...blueTeamPlayers];
      tempBlueTeamPlayers[index].pickedCard =
        !tempBlueTeamPlayers[index].pickedCard;
      if (!wordLocked) {
        tempBlueTeamPlayers[index].cardIndex = currentCard.index;
      } else {
        tempBlueTeamPlayers[index].cardIndex = -1;
      }
      finalBlueTeamPlayers = tempBlueTeamPlayers;
    }

    updateTimerInDb(tempPlayers, finalRedTeamPlayers, finalBlueTeamPlayers);
  };

  useEffect(() => {
    if (myDetails && redTeamPlayers.length > 0 && blueTeamPlayers.length > 0) {
      const tempGroupMembersLength =
        myDetails.team === "red"
          ? redTeamPlayers.length - 1
          : blueTeamPlayers.length - 1;

      setGroupMembersLength(tempGroupMembersLength);
    }
  }, [redTeamPlayers, blueTeamPlayers, myDetails]);

  const lockWordHandler = () => {
    if (currentCard !== null) {
      setWordLocked((prevState) => !prevState);
      if (groupMembersLength > 1) {
        switchPickedCardStateForMe();
      } else {
        setTimeRanOut(true);
      }
    } else if (currentCard === null && !timerStarts) {
      restartClock();
    }
  };

  const openOperatorsModalHandler = () => {
    setModalOpen(!modalOpen);
    setOpenOperatorsModal(!opanOperatorsModal);
  };

  const skipTurnHandler = () => {
    socket.emit("skipTurn", roomId, myDetails);
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
          setNewWordSetted={setNewWordSetted}
          setWordsToGuess={setWordsToGuess}
          socket={socket}
          roomDetails={roomDetails}
          siteUrl={siteUrl}
        />
      )}
      <div className={classes.scoreTable}>
        <div
          className={`${classes.group} ${classes.blue} ${
            currentGroupColor === "blue" ? classes.glow : ""
          } ${
            wordsToGuess === 1 && currentGroupColor === "blue"
              ? classes.bonus
              : ""
          }`}
        >
          <div className={classes.cardsLeft}>{blueGroupCounter}</div>
          <span
            className={`${
              wordsToGuess === 1 && currentGroupColor === "blue"
                ? classes.bonus1
                : ""
            }`}
          ></span>
          <span
            className={`${
              wordsToGuess === 1 && currentGroupColor === "blue"
                ? classes.bonus2
                : ""
            }`}
          ></span>
          <span
            className={`${
              wordsToGuess === 1 && currentGroupColor === "blue"
                ? classes.bonus3
                : ""
            }`}
          ></span>
        </div>
        <div
          className={`${classes.group} ${classes.red} ${
            currentGroupColor === "red" ? classes.glow : ""
          } ${
            wordsToGuess === 1 && currentGroupColor === "red"
              ? classes.bonus
              : ""
          }`}
        >
          <div className={classes.cardsLeft}>{redGroupCounter}</div>
          <span
            className={`${
              wordsToGuess === 1 && currentGroupColor === "red"
                ? classes.bonus1
                : ""
            }`}
          ></span>
          <span
            className={`${
              wordsToGuess === 1 && currentGroupColor === "red"
                ? classes.bonus2
                : ""
            }`}
          ></span>
          <span
            className={`${
              wordsToGuess === 1 && currentGroupColor === "red"
                ? classes.bonus3
                : ""
            }`}
          ></span>
        </div>
      </div>
      {role === "agent" && (
        <div className={classes.actionButtons}>
          {wordsToGuess === 1 && myDetails?.team === currentGroupColor && (
            <Button classname={classes.skipTurn} onclick={skipTurnHandler}>
              <span className={classes.content}>דלג</span>
            </Button>
          )}
          <Button
            classname={classes.lockWord}
            onclick={lockWordHandler}
            disabled={
              myDetails?.team !== currentGroupColor ||
              (currentOperatorsWord === "" &&
                currentOperatorsWordCount === 0) ||
              gameOver
            }
          >
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
          <Button
            onclick={openOperatorsModalHandler}
            disabled={myDetails?.team !== currentGroupColor || gameOver}
          >
            <span className={classes.content}>הפעל סוכנים</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default LowerBoardZone;
