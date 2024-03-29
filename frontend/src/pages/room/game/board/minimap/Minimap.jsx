/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import classes from "./Minimap.module.scss";
import { useParams } from "react-router-dom";
import axios from "axios";

const Minimap = ({
  minimap,
  setMinimap,
  showMinimap,
  setShowMinimap,
  leadGroupColor,
  roomDetails,
}) => {
  const { roomId } = useParams();
  const minimapMappingArray =
    leadGroupColor === "red" ? [9, 8, 7, 1] : [8, 9, 7, 1];

  const setMinimapInDb = async (minimapToPass) => {
    try {
      await axios.post(`http://localhost:4000/room/${roomId}/setMap`, {
        roomId,
        map: minimapToPass,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (roomDetails) {
      if (roomDetails.map.length === 25) {
        const mappedMinimap = roomDetails.map.map((cell, index) => (
          <div
            className={cell.props.className}
            style={{ backgroundColor: cell.props.style.backgroundColor }}
            key={index}
          >
            <div className={classes.minimapCellInner}></div>
          </div>
        ));
  
        setMinimap(mappedMinimap);
      } else {
        const tempMinimap = Array(25)
          .fill()
          .map((_, index) => {
            let randFactor = Math.floor(Math.random() * 4);

            while (minimapMappingArray[randFactor] === 0) {
              randFactor = Math.floor(Math.random() * 4);
            }

            if (minimapMappingArray[randFactor] > 0) {
              minimapMappingArray[randFactor]--;
              const color =
                randFactor === 0
                  ? "#ec4542"
                  : randFactor === 1
                  ? "#008ed5"
                  : randFactor === 2
                  ? "#d1c499"
                  : randFactor === 3
                  ? "#3d3b3a"
                  : "";
              const subclass =
                randFactor === 0
                  ? classes.red
                  : randFactor === 1
                  ? classes.blue
                  : randFactor === 2
                  ? classes.neutral
                  : randFactor === 3
                  ? classes.black
                  : "";

              return (
                <div
                  className={`${classes.minimapCell} ${subclass}`}
                  style={{ backgroundColor: color }}
                  key={index}
                >
                  <div className={classes.minimapCellInner}></div>
                </div>
              );
            }
          });

          setMinimap(tempMinimap);
          setTimeout(() => {
            setMinimapInDb(tempMinimap);
          }, 100);
      }

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
          <div className={classes.innerMinimapMain}>{minimap}</div>
        </div>
      </div>
    </div>
  );
};

export default Minimap;
