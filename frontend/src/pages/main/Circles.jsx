import classes from './Main.module.scss';

const Circles = () => {
  return (
    <div className={classes.circles}>
    <span className={classes.semi_transparent_circle} style={{width: '215dvw'}}></span>
    <span className={classes.transparent_circle} style={{width: '190dvw'}}></span>

    <span className={classes.semi_transparent_circle} style={{width: '170dvw'}}></span>
    <span className={classes.transparent_circle} style={{width: '150dvw'}}></span>

    <span className={classes.semi_transparent_circle} style={{width: '135dvw'}}></span>
    <span className={classes.transparent_circle} style={{width: '120dvw'}}></span>
        
    <span className={classes.semi_transparent_circle} style={{width: '108dvw'}}></span>
    <span className={classes.transparent_circle} style={{width: '95dvw'}}></span>

    <span className={classes.semi_transparent_circle} style={{width: '85dvw'}}></span>
    <span className={classes.transparent_circle} style={{width: '75dvw'}}></span>

    <span className={classes.semi_transparent_circle} style={{width: '65dvw'}}></span>
    <span className={classes.transparent_circle} style={{width: '55dvw'}}></span>

    <span className={classes.semi_transparent_circle} style={{width: '45dvw'}}></span>
    <span className={classes.transparent_circle} style={{width: '35dvw'}}></span>
</div>
  )
}

export default Circles