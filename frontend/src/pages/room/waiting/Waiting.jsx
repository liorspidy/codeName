/* eslint-disable react-hooks/exhaustive-deps */
import classes from "./Waiting.module.scss";
import SyncAltRoundedIcon from "@mui/icons-material/SyncAltRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import FaceRoundedIcon from "@mui/icons-material/FaceRounded";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TeamBuilder from "./TeamBuilder";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useParams } from "react-router-dom";
import Button from "../../../UI/button/Button";

const Waiting = () => {
  const [playerTitle, setPlayerTitle] = useState("מפעיל");
  const [players, setPlayers] = useState([]);
  const [readyButtonText, setReadyButtonText] = useState("אני מוכן");
  const [redTeamPlayers, setRedTeamPlayers] = useState([]);
  const [blueTeamPlayers, setBlueTeamPlayers] = useState([]);
  const [teamsChanged, setTeamsChanged] = useState(false);
  const [roomReady , setRoomReady] = useState(true);

  const playerDetails = sessionStorage.getItem("token")
    ? jwtDecode(sessionStorage.getItem("token"))
    : null;

  const [roomDetails, setRoomDetails] = useState(null);

  const { roomId } = useParams();

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

  const readyButtonHandler = () => {};

  // Switch teams on button click
  const switchTeamsHandler = () => {
    const isOnRedTeam = redTeamPlayers.includes(playerDetails.name);
    const isOnBlueTeam = blueTeamPlayers.includes(playerDetails.name);

    if (isOnRedTeam) {
      setRedTeamPlayers(
        redTeamPlayers.filter((player) => player !== playerDetails.name)
      );
      setBlueTeamPlayers([...blueTeamPlayers, playerDetails.name]);
    } else if (isOnBlueTeam) {
      setBlueTeamPlayers(
        blueTeamPlayers.filter((player) => player !== playerDetails.name)
      );
      setRedTeamPlayers([...redTeamPlayers, playerDetails.name]);
    }

    setTeamsChanged(true);
  };

  const getRoomDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/room/${roomId}/getRoom`
      );
      const room = response.data;
      setRoomDetails(room);
    } catch (err) {
      console.log(err);
      navigator.navigate("/404");
    }
  };

  // Get room details on component mount
  useEffect(() => {
    getRoomDetails();
  }, []);

  // Set players on room details change
  useEffect(() => {
    if (roomDetails) {
      setPlayers(roomDetails.players);
    }
  }, [roomDetails]);

  // Set teams on players change
  useEffect(() => {
    if (players.length > 0 && roomDetails) {
      const tempRedTeamPlayers = [...roomDetails.redTeam];
      const tempBlueTeamPlayers = [...roomDetails.blueTeam];

      let teamPosition = 0;

      players.forEach((player, index) => {
        if (roomDetails.redTeam.includes(player)) {
          // Player already in the red team
        } else if (roomDetails.blueTeam.includes(player)) {
          // Player already in the blue team
        } else {
          if (index % 2 === 0) {
            // Even index, assign to team with fewer members
            if (tempRedTeamPlayers.length <= tempBlueTeamPlayers.length) {
              tempRedTeamPlayers.push(player);
            } else {
              tempBlueTeamPlayers.push(player);
            }
          } else {
            // Odd index, assign to the opposite team of the last assignment
            if (teamPosition === 1) {
              tempBlueTeamPlayers.push(player);
            } else if (teamPosition === 2) {
              tempRedTeamPlayers.push(player);
            } else {
              // If no last assignment, assign to team with fewer members
              if (tempRedTeamPlayers.length <= tempBlueTeamPlayers.length) {
                tempRedTeamPlayers.push(player);
              } else {
                tempBlueTeamPlayers.push(player);
              }
            }
            teamPosition = 0;
          }
        }
      });

      setRedTeamPlayers(tempRedTeamPlayers);
      setBlueTeamPlayers(tempBlueTeamPlayers);
      setTeamsChanged(true);
    }
  }, [players, roomDetails]);

  // Set teams in db
  const setTeamPlayersInDb = async () => {
    try {
      const response = await axios.post(
        `http://localhost:4000/room/${roomId}/setTeamPlayers`,
        {
          roomId,
          redTeamPlayers,
          blueTeamPlayers,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const checkWaitingRoomReady = () => {
    if(redTeamPlayers.length === 0 || blueTeamPlayers.length === 0){
      return true;
    }
    return false;
  }

  // Set teams in db on teams change
  useEffect(() => {
    if (teamsChanged) {
      setTeamPlayersInDb();
      setTeamsChanged(false);
      setRoomReady(checkWaitingRoomReady());
    }
  }, [teamsChanged]);



  return (
    <div className={classes.waitingRoom}>
      <h1 className={classes.title}>
        ממתין לשחקנים.<span className={classes.waiting2}>.</span>
        <span className={classes.waiting3}>.</span>
      </h1>

      <div className={classes.action_buttons}>
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
          mainClass={classes.redGroup}
        />
        <TeamBuilder
          teamPlayers={blueTeamPlayers}
          mainClass={classes.blueGroup}
        />
      </div>

      <Link to={`/room/${roomId}/game`} className={classes.readyButton}>
        <Button onclick={readyButtonHandler} disabled={roomReady}>{readyButtonText}</Button>
      </Link>
    </div>
  );
};

export default Waiting;
