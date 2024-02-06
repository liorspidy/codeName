/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import classes from './Button.module.scss';

const Button = ({ children , classname , onclick ,disabled }) => {
  return (
    <motion.button
      className={`${classname} ${classes.button}`}
      onClick={onclick}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
};

export default Button;
