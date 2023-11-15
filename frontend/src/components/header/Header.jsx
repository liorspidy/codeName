import classes from "./Header.module.scss";
import { useNavigate } from "react-router-dom";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "./menu/Menu";

const Header = () => {
  let navigate = useNavigate();

  function handleClick() {
    navigate(-1);
  }

  return (
    <header>
      <Toolbar sx={{ padding: 0 }}>
        <IconButton
          onClick={handleClick}
          aria-label="go back"
          sx={{ backgroundColor: "#646cff", color: "#fff", ":hover": { backgroundColor: "#464cc2" }}}
        >
          <ChevronRightIcon />
        </IconButton>
      </Toolbar>
      <Menu />
    </header>
  );
};

export default Header;
