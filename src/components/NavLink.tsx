import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const NavLink = (props: Props): JSX.Element => {
  const router = useRouter();

  if (router.pathname === props.href) {
    return (
      <Link href={props.href}>
        <a className="lbu-nav-link lbu-nav-link--active">{props.children}</a>
      </Link>
    );
  }

  return (
    <Link href={props.href}>
      <a className="lbu-nav-link">{props.children}</a>
    </Link>
  );
};

export interface Props {
  href: string;
  children: React.ReactNode;
}

export default NavLink;
