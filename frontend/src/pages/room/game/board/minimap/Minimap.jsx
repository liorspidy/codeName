/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import classes from "./Minimap.module.scss";
// import { useParams } from "react-router-dom";
// import axios from "axios";

const Minimap = ({
  showMinimap,
  setShowMinimap,
  leadGroupColor,
  roomDetails,
}) => {

  const [mappedMinimap , setMappedMinimap] = useState(Array(25).fill(null));

  useEffect(() => {
    if (roomDetails && roomDetails.map.length === 25) {
      const mappedMinimap = roomDetails.map.map((cell, index) => (
        <div
        className={`${classes.minimapCell} ${classes[cell.props.subclass]}`}
        style={{ backgroundColor: cell.props.style.backgroundColor }}
          key={index}
        >
          <div className={classes.minimapCellInner}></div>
        </div>
      ));

      setMappedMinimap(mappedMinimap);
    }
  }, [roomDetails]);

  const backdropMinimapHandler = () => {
    setShowMinimap(false);
  };

  return (
    <div
      className={
        showMinimap
          ? `${classes.minimapCardContainer} ${classes.show}`
          : classes.minimapCardContainer
      }
      onClick={backdropMinimapHandler}
    >
      <div
        className={
          showMinimap
            ? `${classes.minimapContainer} ${classes.show}`
            : classes.minimapContainer
        }
      >
        <div className={classes.innerMinimapMiddle}>
          <div className={classes.innerMinimapCorner}>
            <div
              className={
                leadGroupColor === "red"
                  ? `${classes.edgeLight} ${classes.red}`
                  : `${classes.edgeLight} ${classes.blue}`
              }
            >
              <div
                className={
                  leadGroupColor === "red"
                    ? `${classes.innerLight} ${classes.red}`
                    : `${classes.innerLight} ${classes.blue}`
                }
              />
            </div>
          </div>
          <div className={classes.innerMinimapCorner}>
            <div
              className={
                leadGroupColor === "red"
                  ? `${classes.edgeLight} ${classes.red}`
                  : `${classes.edgeLight} ${classes.blue}`
              }
            >
              <div
                className={
                  leadGroupColor === "red"
                    ? `${classes.innerLight} ${classes.red}`
                    : `${classes.innerLight} ${classes.blue}`
                }
              />
            </div>
          </div>
          <div className={classes.innerMinimapCorner}>
            <div
              className={
                leadGroupColor === "red"
                  ? `${classes.edgeLight} ${classes.red}`
                  : `${classes.edgeLight} ${classes.blue}`
              }
            >
              <div
                className={
                  leadGroupColor === "red"
                    ? `${classes.innerLight} ${classes.red}`
                    : `${classes.innerLight} ${classes.blue}`
                }
              />
            </div>
          </div>
          <div className={classes.innerMinimapCorner}>
            <div
              className={
                leadGroupColor === "red"
                  ? `${classes.edgeLight} ${classes.red}`
                  : `${classes.edgeLight} ${classes.blue}`
              }
            >
              <div
                className={
                  leadGroupColor === "red"
                    ? `${classes.innerLight} ${classes.red}`
                    : `${classes.innerLight} ${classes.blue}`
                }
              />
            </div>
          </div>
          <div className={classes.innerMinimapMain}>{mappedMinimap}</div>
        </div>
      </div>
    </div>
  );
};

export default Minimap;
