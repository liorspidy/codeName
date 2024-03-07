/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import classes from "./Waiting.module.scss";
import SyncAltRoundedIcon from "@mui/icons-material/SyncAltRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import FaceRoundedIcon from "@mui/icons-material/FaceRounded";
import { useEffect, useState } from "react";
import TeamBuilder from "./TeamBuilder";
import axios from "axios";
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
  const [readyButtonText, setReadyButtonText] = useState("אני מוכן");
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
    const teamLocation = redTeamPlayers.includes(playerDetails.name)
      ? "red"
      : "blue";

    // Switch the role of the player in the specified team (red or blue)
    const switchRole = (rootTeam) => {
      const tempTeam = [...rootTeam];
      const playerIndex = tempTeam.indexOf(playerDetails.name);
      tempTeam.splice(playerIndex, 1);

      // Move the player to the opposite position in the team
      playerIndex === 0
        ? tempTeam.push(playerDetails.name)
        : tempTeam.unshift(playerDetails.name);
      return tempTeam;
    };

    // Update the appropriate team (red or blue) with the switched roles
    if (teamLocation === "red") {
      setRedTeamPlayers((prev) => switchRole(prev));
    } else if (teamLocation === "blue") {
      setBlueTeamPlayers((prev) => switchRole(prev));
    }

    // Indicate that teams have changed
    setTeamsChanged(true);
  };

  const readyButtonHandler = () => {
    navigate(`/room/${roomId}/game`);
  };

  // Switch teams on button click
  const switchTeamsHandler = () => {
    const isOnRedTeam = redTeamPlayers.includes(playerDetails.name);
    const isOnBlueTeam = blueTeamPlayers.includes(playerDetails.name);

    if (isOnRedTeam) {
      const tempRedTeamPlayers = redTeamPlayers.filter(
        (player) => player !== playerDetails.name
      );
      const tempBlueTeamPlayers = [...blueTeamPlayers, playerDetails.name];
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
      const tempRedTeamPlayers = [...redTeamPlayers, playerDetails.name];
      const tempBlueTeamPlayers = blueTeamPlayers.filter(
        (player) => player !== playerDetails.name
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
      "updatingPlayers",
      (updatedPlayers, updatedRedTeam, updatedBlueTeam) => {
        setPlayers(updatedPlayers);
        setRedTeamPlayers(updatedRedTeam);
        setBlueTeamPlayers(updatedBlueTeam);
        setTeamsChanged(true);
      }
    );

    socket.on("switchingTeams", (redTeam, blueTeam) => {
      setRedTeamPlayers(redTeam);
      setBlueTeamPlayers(blueTeam);
    });

    return () => {
      socket.off("updatingPlayers");
      socket.off("switchingTeams");
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
      if (players.includes(playerDetails.name)) {
        setInRoom(true);
        sessionStorage.setItem("lastRoomId", roomId);
      }
    }
  }, [teamsChanged]);

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
            !(redTeamPlayers.length >= 2 && blueTeamPlayers.length >= 2)
          }
        >
          {readyButtonText}
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
