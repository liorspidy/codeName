import axios from "axios";
import { useEffect, useState } from "react";
import classes from "./RoomsList.module.scss";
import Loader from "../loader/Loader";

// eslint-disable-next-line react/prop-types
const RoomsList = ({ setValue, siteUrl , isLoading, setIsLoading}) => {
  const [openRooms, setOpenRooms] = useState([]);
  const [pickedRoom, setPickedRoom] = useState(null);

  const getOpenRooms = () => {
    axios
      .get(`${siteUrl}/room/getRooms`)
      .then((response) => {
        setOpenRooms(response.data);
        setIsLoading(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getOpenRooms();
  }, []);

  const clickHandler = (room) => {
    setValue(room.id);
    setPickedRoom(room);
  };

  const availableRooms = openRooms.map((room) => {
    const roomStatus = room.status;
    return (
      <li
        className={`${classes.item} ${
          pickedRoom?.id === room?.id ? classes.picked : ""
        }`}
        key={room.id}
      >
        <button
          onClick={clickHandler.bind(this, room)}
          className={classes.joinButton}
          disabled={room.players.length === 8}
        >
          <span className={classes.name}>{room.name}</span>
          <span
            className={`${classes.status} ${
              roomStatus === "playing"
                ? classes.playing
                : roomStatus === "waiting"
                ? classes.waiting
                : roomStatus === "finished"
                ? classes.finished
                : ""
            }`}
          ></span>
          <span
            className={`${classes.players} 
        ${room.players.length < 8 ? classes.green : classes.red}`}
          >
            {room.players.length} / 8
          </span>
        </button>
      </li>
    );
  });

  return (
    <div className={classes.roomListContainer}>
      <div className={classes.subtitleWrapper}>
        <h3 className={classes.joinRoomTitle}>הצטרף לחדר קיים:</h3>
        <span className={classes.roomsNumber}>({openRooms.length})</span>
      </div>
      <ul className={classes.list}>
        {isLoading ? (
          availableRooms
        ) : (
          <div className={classes.loader}>
            <Loader />
          </div>
        )}
      </ul>
    </div>
  );
};

export default RoomsList;
