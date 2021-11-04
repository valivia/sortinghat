import { motion } from "framer-motion";
import { Component } from "react";
import result from "../types/result";
import styles from "./resultBar.module.scss";

export default class ResultBar extends Component<Props> {

  constructor(props: Props) {
    super(props);
  }

  render() {
    const item = {
      visible: { opacity: 1, x: 0 },
      hidden: { opacity: 0, x: -100 },
    };

    const data = this.props.stat;
    return (
      <motion.div
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: this.props.index * 0.2 }}
        className={styles.scores}
        variants={item}>
        <label htmlFor={data.name}>{data.name}</label>
        <div>{(data.percentage * 100).toFixed(1)}%</div>
        <meter
          className={styles.meter}
          id={data.name}
          min={data.min}
          max={data.max}
          optimum={data.max}
          low={data.max * 0.4}
          high={data.max * 0.7}
          value={data.score}>
        </meter>
      </motion.div>
    );
  }
}

interface Props {
  stat: result;
  index: number;
}