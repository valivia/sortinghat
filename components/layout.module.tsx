import { ReactNode } from "react";
import Link from "next/link"
import styles from "./layout.module.scss";
import Image from "next/image"
import raven from "../public/raven.gif"

export default function Layout({ children }: { children: ReactNode }): JSX.Element {

    return (
        <div className={styles.main}>
            <div className={styles.raven}>
                <Image src={raven} alt=""></Image>
            </div>
            <menu className={styles.navigationWrapper}>
                <Link href="/">
                    <a>home</a>
                </Link>
            </menu>
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