import React, { FunctionComponent } from 'react';
import Link from "next/link";
import styles from "../styles/EvidenceTile.module.scss";

const EvidenceTile: FunctionComponent<Props> = (props) => 
    <li className={styles.item}>
        <div className={styles.preview}>
            <strong>{props.format}</strong>
            <span className={styles.filesize}>{props.fileSize}</span>
        </div>
        <div>
            <h3><Link href={`/dashboard/evidence/${props.id}`}>{props.purpose}</Link></h3>
            <p className={`lbh-body-s ${styles.meta}`}>{props.uploaded}</p>
        </div>
        <div className={styles.actions}>
            <a href="#">Accept</a>
            <a href="#" className="lbu-red-link">Request new file</a>
        </div>
    </li>

export default EvidenceTile;

interface Props{
    id: number,
    format: string,
    fileSize: string,
    purpose: string,
    uploaded: string
}