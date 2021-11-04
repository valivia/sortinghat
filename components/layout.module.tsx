import { ReactNode } from "react";
import styles from "./layout.module.scss";
import Image from "next/image";
import raven from "../public/raven.gif";

export default function Layout({ children }: { children: ReactNode }): JSX.Element {

  return (
    <div className={styles.main}>
      <div className={styles.raven}>
        <Image src={raven} alt="" onClick={() => window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ")}></Image>
      </div>
      <menu className={styles.navigationWrapper}></menu>
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <div className={styles.headerBottom}></div>
        </div>
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}