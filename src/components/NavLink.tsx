import React, { FunctionComponent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/NavLink.module.scss';

const NavLink: FunctionComponent<Props> = (props) => {
  const router = useRouter();

  if (router.pathname === props.href) {
    return (
      <Link href={props.href}>
        <a className={`lbh-link ${styles.active}`}>{props.children}</a>
      </Link>
    );
  }

  return (
    <Link href={props.href}>
      <a className="lbh-link">{props.children}</a>
    </Link>
  );
};

export interface Props {
  href: string;
}

export default NavLink;
