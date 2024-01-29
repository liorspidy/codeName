/* eslint-disable react/prop-types */
import { motion } from "framer-motion";

const Button = ({ children , classname , onclick }) => {
  return (
    <motion.button
      className={classname}
      onClick={onclick}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
    >
      {children}
    </motion.button>
  );
};

export default Button;
