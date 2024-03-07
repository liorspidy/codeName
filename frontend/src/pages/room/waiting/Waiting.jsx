/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import classes from "./Waiting.module.scss";
import SyncAltRoundedIcon from "@mui/icons-material/SyncAltRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import FaceRoundedIcon from "@mui/icons-material/FaceRounded";
import { useEffect, useState } from "react";
import TeamBuilder from "./TeamBuilder";
import { useParams } from "react-router-dom";
import Button from "../../../UI/button/Button";
import { useNavigate } from "react-router-dom";
import LeaveRoomModal from "../../../UI/modals/LeaveRoomModal";

const Waiting = ({
  roomDetails,
  playerDetails,
  socket,
  redTeamPlayers,
  setRedTeamPlayers,
  blueTeamPlayers,
  setBlueTeamPlayers,
  setTeamPlayersInDb,
}) => {
  const [playerTitle, setPlayerTitle] = useState("מפעיל");
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [readyButton, setReadyButton] = useState(false);
  const [teamsChanged, setTeamsChanged] = useState(false);
  const [inRoom, setInRoom] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [leaveRoomShown, setLeaveRoomShown] = useState(false);

  const { roomId } = useParams();
  const navigate = useNavigate();

  // Toggle playerTitle between "מפעיל" and "סוכן"
  const activatorListHandler = () => {
    setPlayerTitle(playerTitle === "מפעיל" ? "סוכן" : "מפעיל");

    // Determine teamLocation based on player's presence in redTeamPlayers
    const teamLocation = redTeamPlayers.find(
      (p) => p.name === currentPlayer?.name
    )
      ? "red"
      : "blue";

    // Switch the role of the player in the specified team (red or blue)
    const switchRole = (rootTeam) => {
      const tempTeam = [...rootTeam];
      const playerIndex = tempTeam.findIndex(
        (player) => player.name === currentPlayer?.name
      );
      tempTeam.splice(playerIndex, 1);

      // Move the player to the opposite position in the team
      playerIndex === 0
        ? tempTeam.push(currentPlayer)
        : tempTeam.unshift(currentPlayer);

      return tempTeam;
    };

    // Update the appropriate team (red or blue) with the switched roles
    if (teamLocation === "red") {
      const updatedRedTeamPlayers = switchRole(redTeamPlayers);
      setTeamPlayersInDb(updatedRedTeamPlayers, blueTeamPlayers);
      socket.emit(
        "playerSwitchedRole",
        roomId,
        playerDetails.name,
        updatedRedTeamPlayers,
        blueTeamPlayers
      );
    } else if (teamLocation === "blue") {
      const updatedBlueTeamPlayers = switchRole(blueTeamPlayers);
      setTeamPlayersInDb(redTeamPlayers, updatedBlueTeamPlayers);
      socket.emit(
        "playerSwitchedRole",
        roomId,
        playerDetails.name,
        redTeamPlayers,
        updatedBlueTeamPlayers
      );
    }

    // Indicate that teams have changed
    setTeamsChanged(true);
  };

  const readyButtonHandler = () => {
    setReadyButton(!readyButton);
    updatePlayerReady(playerDetails.name, !readyButton);
  };

  const updatePlayerReady = (playerName, ready) => {
    const isOnRedTeam = redTeamPlayers.find(
      (player) => player.name === currentPlayer?.name
    );
    const isOnBlueTeam = blueTeamPlayers.find(
      (player) => player.name === currentPlayer?.name
    );
    const tempPlayers = [...players];
    const playerIndex = tempPlayers.findIndex(
      (player) => player.name === playerName
    );
    tempPlayers[playerIndex].ready = ready;
    if (isOnRedTeam) {
      const index = redTeamPlayers.findIndex(
        (player) => player.name === playerName
      );
      const tempRedTeamPlayers = [...redTeamPlayers];
      tempRedTeamPlayers[index].ready = ready;
      socket.emit(
        "playerReady",
        roomId,
        playerDetails.name,
        tempPlayers,
        tempRedTeamPlayers,
        blueTeamPlayers
      );
    } else if (isOnBlueTeam) {
      const index = blueTeamPlayers.findIndex(
        (player) => player.name === playerName
      );
      const tempBlueTeamPlayers = [...blueTeamPlayers];
      tempBlueTeamPlayers[index].ready = ready;
      socket.emit(
        "playerReady",
        roomId,
        playerDetails.name,
        tempPlayers,
        redTeamPlayers,
        tempBlueTeamPlayers
      );
    }
  };

  // Switch teams on button click
  const switchTeamsHandler = () => {
    const isOnRedTeam = redTeamPlayers.find(
      (player) => player.name === currentPlayer?.name
    );
    const isOnBlueTeam = blueTeamPlayers.find(
      (player) => player.name === currentPlayer?.name
    );

    if (isOnRedTeam) {
      const tempRedTeamPlayers = redTeamPlayers.filter(
        (player) => player.name !== currentPlayer?.name
      );
      const tempBlueTeamPlayers = [...blueTeamPlayers, currentPlayer];
      setRedTeamPlayers(tempRedTeamPlayers);
      setBlueTeamPlayers(tempBlueTeamPlayers);
      socket.emit(
        "switchTeams",
        roomId,
        tempRedTeamPlayers,
        tempBlueTeamPlayers
      );
      setTeamPlayersInDb(tempRedTeamPlayers, tempBlueTeamPlayers);
    } else if (isOnBlueTeam) {
      const tempRedTeamPlayers = [...redTeamPlayers, currentPlayer];
      const tempBlueTeamPlayers = blueTeamPlayers.filter(
        (player) => player.name !== currentPlayer?.name
      );
      setRedTeamPlayers(tempRedTeamPlayers);
      setBlueTeamPlayers(tempBlueTeamPlayers);
      socket.emit(
        "switchTeams",
        roomId,
        tempRedTeamPlayers,
        tempBlueTeamPlayers
      );
      setTeamPlayersInDb(tempRedTeamPlayers, tempBlueTeamPlayers);
    }
    setTeamsChanged(true);
  };

  useEffect(() => {
    // Listen for socket event to update player list
    socket.on(
      "updatingPlayersAndTeams",
      (updatedPlayers, updatedRedTeam, updatedBlueTeam) => {
        setPlayers(updatedPlayers);
        setRedTeamPlayers(updatedRedTeam);
        setBlueTeamPlayers(updatedBlueTeam);
        setTeamsChanged(true);
      }
    );

    socket.on("updatingTeams", (redTeam, blueTeam) => {
      setRedTeamPlayers(redTeam);
      setBlueTeamPlayers(blueTeam);
      setTeamsChanged(true);
    });

    socket.on("updatingReadyPlayers", (readyPlayers) => {
      console.log("updatingReadyPlayers");
      if(!readyPlayers.some((player) => !player.ready)){
        navigate(`/room/${roomId}/game`);
      }
    });

    return () => {
      socket.off("updatingPlayers");
      socket.off("updatingTeams");
      socket.off("updatingReadyPlayers");
    };
  }, []);

  // Set players on room details change
  useEffect(() => {
    if (roomDetails) {
      setPlayers(roomDetails.players);
    }
  }, [roomDetails]);

  useEffect(() => {
    if (teamsChanged) {
      setTeamsChanged(false);
      if (players.some((player) => player.name === playerDetails.name)) {
        setInRoom(true);
        sessionStorage.setItem("lastRoomId", roomId);
      }
    }
  }, [teamsChanged]);

  useEffect(() => {
    if (players.length > 0) {
      setCurrentPlayer(
        players.find((player) => player.name === playerDetails.name)
      );
    }
  }, [players]);

  const leaveRoomModalHandler = () => {
    setModalOpen(true);
    setLeaveRoomShown(true);
  };

  return (
    <div className={classes.waitingRoom}>
      {modalOpen && (
        <LeaveRoomModal
          setModalOpen={setModalOpen}
          setModalShown={setLeaveRoomShown}
          modalShown={leaveRoomShown}
          roomDetails={roomDetails}
          socket={socket}
        />
      )}
      <h1 className={classes.title}>
        ממתין לשחקנים.<span className={classes.waiting2}>.</span>
        <span className={classes.waiting3}>.</span>
      </h1>

      <div className={classes.actionButtons}>
        <Button classname={classes.iconButton} onclick={switchTeamsHandler}>
          <SyncAltRoundedIcon />
        </Button>
        <Button classname={classes.iconButton} onclick={activatorListHandler}>
          {playerTitle === "מפעיל" && <SupportAgentRoundedIcon />}
          {playerTitle === "סוכן" && <FaceRoundedIcon />}
        </Button>
      </div>

      <div className={classes.groups}>
        <TeamBuilder
          teamPlayers={redTeamPlayers}
          playerDetails={playerDetails}
          mainClass={classes.redGroup}
        />
        <TeamBuilder
          teamPlayers={blueTeamPlayers}
          playerDetails={playerDetails}
          mainClass={classes.blueGroup}
        />
      </div>

      <div className={classes.bottomButtons}>
        <Button
          className={classes.readyButton}
          onclick={readyButtonHandler}
          disabled={
            !inRoom ||
            !(redTeamPlayers?.length >= 2 && blueTeamPlayers?.length >= 2)
          }
        >
          {!readyButton ? "אני מוכן" : "צריך לשנות"}
        </Button>
        {inRoom && (
          <Button
            classname={classes.leaveRoomButton}
            onclick={leaveRoomModalHandler}
          >
            עזוב חדר
          </Button>
        )}
      </div>
    </div>
  );
};

export default Waiting;
