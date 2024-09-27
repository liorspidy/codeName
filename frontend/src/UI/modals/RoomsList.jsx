import axios from "axios";
import { useEffect, useState } from "react";
import classes from "./RoomsList.module.scss";

// eslint-disable-next-line react/prop-types
const RoomsList = ({ setValue }) => {
  const [openRooms, setOpenRooms] = useState([]);
  const [pickedRoom, setPickedRoom] = useState(null);

  const getOpenRooms = () => {
    axios.get("http://localhost:4000/room/getRooms").then((response) => {
      setOpenRooms(response.data);
    });
  };

  useEffect(() => {
    getOpenRooms();
  }, []);

  const clickHandler = (room) => {
    setValue(room.id);
    setPickedRoom(room);
  }

  const availableRooms = openRooms.map((room) => {
    return (
      <li className={`${classes.item} ${pickedRoom?.id === room?.id ? classes.picked : ''}`} key={room.id}>
        <button onClick={clickHandler.bind(this,room)} className={classes.joinButton}>
          <span className={classes.name}>{room.name}</span>
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
      <h2 className={classes.joinRoomTitle}>הצטרף לחדר קיים:</h2>
      <ul className={classes.list}>{availableRooms}</ul>
    </div>
  );
};

export default RoomsList;
