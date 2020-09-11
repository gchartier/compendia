import Head from "next/head";
import styles from "../styles/Home.module.scss";
import Header from "../components/header/Header";
import BottomNav from "../components/BottomNav";
import { useState } from "react";
import Login from "./Login";

export default function Home() {
    const [authToken, setAuthToken] = useState("");

    return (
        <div className={styles.container}>
            <Head>
                <title>Compendia</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {authToken !== "" && <Header />}

            {authToken === "" && <Login setAuthToken={setAuthToken} />}

            {authToken !== "" && <BottomNav />}
        </div>
    );
}