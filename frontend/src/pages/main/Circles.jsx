import classes from './Main.module.scss';

const Circles = () => {
  return (
    <div className={classes.circles}>
    <span className={classes.semi_transparent_circle} style={{width: '215vw'}}></span>
    <span className={classes.transparent_circle} style={{width: '190vw'}}></span>

    <span className={classes.semi_transparent_circle} style={{width: '170vw'}}></span>
    <span className={classes.transparent_circle} style={{width: '150vw'}}></span>

    <span className={classes.semi_transparent_circle} style={{width: '135vw'}}></span>
    <span className={classes.transparent_circle} style={{width: '120vw'}}></span>
        
    <span className={classes.semi_transparent_circle} style={{width: '108vw'}}></span>
    <span className={classes.transparent_circle} style={{width: '95vw'}}></span>

    <span className={classes.semi_transparent_circle} style={{width: '85vw'}}></span>
    <span className={classes.transparent_circle} style={{width: '75vw'}}></span>

    <span className={classes.semi_transparent_circle} style={{width: '65vw'}}></span>
    <span className={classes.transparent_circle} style={{width: '55vw'}}></span>

    <span className={classes.semi_transparent_circle} style={{width: '45vw'}}></span>
    <span className={classes.transparent_circle} style={{width: '35vw'}}></span>
</div>
  )
}

export default Circles