import Header from "../../components/header/Header";
import classes from './Room.module.scss';
import Waiting from "./waiting/Waiting";

const Room = () => {
  return (
    <div className={classes.room}>
    <Header />
    <Waiting />
    </div>
  )
}

export default Room