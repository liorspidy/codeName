import classes from "./NotFound.module.scss";
import notFoundAgent from "../../images/404page.jpeg";
import { useNavigate } from "react-router-dom";
import Button from "../../UI/button/Button";

const NotFound = () => {
  let navigate = useNavigate();

  return (
    <div className={classes.notfound}>
      <div>
        <p className={classes.title}>אוי לא!</p>
        <p className={classes.subtitle}>העמוד לא נמצא..</p>
      </div>
      <Button classname={classes.button} onclick={() => navigate("/")}>
        חזרה לדף הבית
      </Button>
      <div className={classes.image}>
        <img src={notFoundAgent} alt="404" />
      </div>
    </div>
  );
};

export default NotFound;
