import classes from './NotFound.module.scss';
import notFoundAgent from '../../images/404page.jpeg'
const NotFound = () => {
  return (
    <div className={classes.notfound}>
      <div>
      <p className={classes.title}>אוי לא!</p>
      <p className={classes.subtitle}>העמוד לא נמצא..</p>
      </div>
      <div className={classes.image} >
      <img src={notFoundAgent} alt="404" />
      </div>
    </div>
  )
}

export default NotFound