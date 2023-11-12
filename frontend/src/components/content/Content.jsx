/* eslint-disable react/prop-types */
import classes from './Content.module.scss';

const Content = ({children}) => {
  return (
    <div className={classes.content}>{children}</div>
  )
}

export default Content