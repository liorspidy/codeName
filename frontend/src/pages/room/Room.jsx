/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams hook
import Header from "../../components/header/Header";
import classes from "./Room.module.scss";
import Waiting from "./waiting/Waiting";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Room = () => {
  const [roomName, setRoomName] = useState("");
  const [roomDetails, setRoomDetails] = useState(null);
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
    } catch (err) {
      console.log(err);
      navigate("/404");
    }
  };

  useEffect(() => {
    getRoomDetails();
  }, []);

  return (
    <div className={classes.room}>
      <Header roomName={roomName} roomId={roomId} />
      <Waiting roomDetails={roomDetails} />
    </div>
  );
};

export default Room;
