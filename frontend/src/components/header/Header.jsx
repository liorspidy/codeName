import classes from './Header.module.scss';
import { useNavigate } from "react-router-dom";

const Header = () => {
  let navigate = useNavigate();

  function handleClick() {
    navigate(-1);
  }

  return (
    <header>
        <button onClick={handleClick}>חזור</button>
    </header>
  )
}

export default Header