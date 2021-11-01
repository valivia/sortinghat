import { ReactNode } from "react";
import Link from "next/link"
import styles from "./layout.module.scss";
import Image from "next/image"
import raven from "../public/raven.gif"

export default function Layout({ children }: { children: ReactNode }): JSX.Element {

    return (
        <div className={styles.main}>
            <menu className={styles.navigationWrapper}>
                <Link href="/">
                    <a>home</a>
                </Link>
            </menu>
            <div className={styles.contentWrapper}>
                <div className={styles.header}>
                    <Image src={raven} alt=""></Image>
                </div>
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </div>
    );
}