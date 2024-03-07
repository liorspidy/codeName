/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/header/Header";
import classes from "./Room.module.scss";
import Waiting from "./waiting/Waiting";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Room = (props) => {
  const [roomName, setRoomName] = useState("");
  const [roomDetails, setRoomDetails] = useState(null);
  const [redTeamPlayers, setRedTeamPlayers] = useState([]);
  const [blueTeamPlayers, setBlueTeamPlayers] = useState([]);

  const { socket, isConnected } = props;
  const playerDetails = sessionStorage.getItem("token")
    ? jwtDecode(sessionStorage.getItem("token"))
    : null;

  const { roomId } = useParams();
  let navigate = useNavigate();

  const getRoomDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/room/${roomId}/getRoom`
      );
      const room = response.data;
      setRoomDetails(room);
      setRoomName(room.name);
      if (socket.connected && room) {
        updatePlayers(room);
      }
    } catch (err) {
      console.log(err);
      navigate("/404");
    }
  };

  const updatePlayers = (roomDetails) => {
    if (roomDetails.players.length > 0 && roomDetails) {
      const tempRedTeamPlayers = [...roomDetails.redTeam];
      const tempBlueTeamPlayers = [...roomDetails.blueTeam];

      let teamPosition = 0; // 0 = no last assignment, 1 = red, 2 = blue

      roomDetails.players.forEach((player, index) => {
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
      setTeamPlayersInDb(tempRedTeamPlayers, tempBlueTeamPlayers);
    }
  };


  // Set teams in db
  const setTeamPlayersInDb = async (tempRed, tempBlue) => {
    try {
      const response = await axios.post(`http://localhost:4000/room/${roomId}/setTeamPlayers`, {
        roomId,
        redTeamPlayers: tempRed,
        blueTeamPlayers: tempBlue,
      });
      const room = response.data;
      socket.emit("joinRoom", room, playerDetails.name);
      console.log("Teams updated in db");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRoomDetails();
  }, [roomId]);

  useEffect(() => {
    return () => {
      socket.off("joinRoom");
    };
  }, [socket]);

  return (
    <div className={classes.room}>
      <Header roomName={roomName} roomId={roomId} isConnected={isConnected} />
      <Waiting
        roomDetails={roomDetails}
        playerDetails={playerDetails}
        socket={socket}
        blueTeamPlayers={blueTeamPlayers}
        setBlueTeamPlayers={setBlueTeamPlayers}
        redTeamPlayers={redTeamPlayers}
        setRedTeamPlayers={setRedTeamPlayers}
        setTeamPlayersInDb={setTeamPlayersInDb}
      />
    </div>
  );
};

export default Room;
