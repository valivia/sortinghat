import result from "../types/result";
import styles from "./resultBar.module.scss";

export default function ResultBar(data: result): JSX.Element {

    return (
        <div className={styles.scores}>
            <label htmlFor={data.name}>{data.name}</label>
            <div>{data.score}/{data.max}</div>
            <meter
            id={data.name}
            className={styles.meter}
            min={0}
            max={data.max}
            low={data.max * 0.4}
            high={data.max * 0.7}
            optimum={data.max}
            value={data.score}></meter>
        </div>
    );
}