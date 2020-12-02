import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/NavLink.module.scss';

const NavLink = (props: Props): JSX.Element => {
  const router = useRouter();

  if (router.pathname === props.href) {
    return (
      <Link href={props.href}>
        <a className={styles.active}>{props.children}</a>
      </Link>
    );
  }

  return (
    <Link href={props.href}>
      <a>{props.children}</a>
    </Link>
  );
};

export interface Props {
  href: string;
  children: React.ReactNode;
}

export default NavLink;
