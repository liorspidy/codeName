import Header from "../../components/header/Header";
import Content from "../../components/content/Content";
import classes from './Room.module.scss';

const Room = () => {
  return (
    <div className={classes.room}>
    <Header />
    <Content>
        <p>content</p>
    </Content>
    </div>
  )
}

export default Room