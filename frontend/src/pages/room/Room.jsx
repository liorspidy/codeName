/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/header/Header";
import classes from "./Room.module.scss";
import Waiting from "./waiting/Waiting";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Loader from "../../UI/loader/Loader";

const Room = (props) => {
  const [roomName, setRoomName] = useState("");

  const {
    socket,
    setPlayersInDb,
    setIsGoingBack,
    setUniqueRandomWords,
    setRandomLeadGroupColor,
    roomDetails,
    setRoomDetails,
    setPlayersAmountError,
    players,
    setPlayers,
    setRedTeamPlayers,
    redTeamPlayers,
    setBlueTeamPlayers,
    blueTeamPlayers,
    isConnected,
    setIsConnected,
    siteUrl,
    isLoading,
    setIsLoading,
    notificationsNumber,
    setNotificationsNumber,
    openChat,
    setOpenChat,
  } = props;
  const playerDetails = sessionStorage.getItem("token")
    ? jwtDecode(sessionStorage.getItem("token"))
    : null;

  const { roomId } = useParams();
  let navigate = useNavigate();

  const getRoomDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${siteUrl}/room/${roomId}/getRoom`);
      const room = response.data;
      const unreadMessages = room.messages.filter(
        (message) =>
          !message.readBy.some(
            (reader) => reader.name === playerDetails.name
          ) && message.senderNick !== playerDetails.name
      ).length;

      setNotificationsNumber(unreadMessages);
      setRoomDetails(room);
      setRoomName(room.name);
      if (socket !== null && socket.connected && room) {
        updatePlayers(room);
      }

      // // If all players are ready, navigate to game
      // if(!room.players.some((player) => player.ready === false)){
      //   navigate(`/room/${roomId}/game`);
      // }
    } catch (err) {
      console.log(err);
      navigate("/404");
    } finally {
      setIsLoading(false);
    }
  };

  const updatePlayers = async (roomDetails) => {
    if (roomDetails.players.length > 0 && roomDetails) {
      const tempRedTeamPlayers = [...roomDetails.redTeam];
      const tempBlueTeamPlayers = [...roomDetails.blueTeam];

      let teamPosition = 0; // 0 = no last assignment, 1 = red, 2 = blue

      roomDetails.players.forEach((player, index) => {
        if (roomDetails.redTeam.find((p) => p.name === player.name)) {
          // Player already in the red team
        } else if (roomDetails.blueTeam.find((p) => p.name === player.name)) {
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
      await setTeamPlayersInDb(tempRedTeamPlayers, tempBlueTeamPlayers);
    }
  };

  // Set teams in db
  const setTeamPlayersInDb = async (tempRed, tempBlue) => {
    try {
      const response = await axios.post(
        `${siteUrl}/room/${roomId}/setTeamPlayers`,
        {
          roomId,
          redTeamPlayers: tempRed,
          blueTeamPlayers: tempBlue,
        }
      );
      const room = response.data;
      if (socket !== null) {
        socket.emit("joinRoom", room, playerDetails.name);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRoomDetails();
  }, []);

  useEffect(() => {
    setIsConnected(socket.connected);
  }, [roomName, socket]);


  // // Get messages on initial load and reset notifications number
  // useEffect(() => {
  //   socket.on("messageReceived", (myDetails , message) => {
  //     if (myDetails.name === playerDetails.name) return;
  //     if(!openChat){
  //       setNotificationsNumber((prev) => prev + 1);
  //     }
  //   });

  //   return () => {
  //     socket.off("messageReceived");
  //   };
  // }, [socket]);

  return (
    <div className={classes.room}>
      {isLoading && (
        <div className={classes.loaderContainer}>
          <Loader />
        </div>
      )}
      <>
        <Header
          roomName={roomName}
          roomId={roomId}
          isConnected={isConnected}
          playerDetails={playerDetails}
          socket={socket}
          setPlayersInDb={setPlayersInDb}
          setIsGoingBack={setIsGoingBack}
          roomDetails={roomDetails}
          siteUrl={siteUrl}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          notificationsNumber={notificationsNumber}
          setNotificationsNumber={setNotificationsNumber}
          openChat={openChat}
          setOpenChat={setOpenChat}
        />
        <Waiting
          roomDetails={roomDetails}
          playerDetails={playerDetails}
          socket={socket}
          blueTeamPlayers={blueTeamPlayers}
          setBlueTeamPlayers={setBlueTeamPlayers}
          redTeamPlayers={redTeamPlayers}
          setRedTeamPlayers={setRedTeamPlayers}
          players={players}
          setPlayers={setPlayers}
          setPlayersInDb={setPlayersInDb}
          setTeamPlayersInDb={setTeamPlayersInDb}
          setUniqueRandomWords={setUniqueRandomWords}
          setRandomLeadGroupColor={setRandomLeadGroupColor}
          setRoomDetails={setRoomDetails}
          setPlayersAmountError={setPlayersAmountError}
          setIsLoading={setIsLoading}
          siteUrl={siteUrl}
          setNotificationsNumber={setNotificationsNumber}
        />
      </>
    </div>
  );
};

export default Room;
