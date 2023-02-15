import { useRouter } from 'next/router';
import React, { useState } from 'react';
import styles from '../styles/ResidentSearch.module.scss';

const ResidentSearchForm = (props: Props): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const name = props.name;
  const email = props.email;
  const phone = props.phone;

  const navigateToCreateResident = () => {
    if (!props.isFromDeeplink) {
      router.push(`/teams/${props.teamId}/dashboard/residents/create`);
      return;
    }

    const queryParams = [
      name && `name=${String(name)}`,
      email && `email=${String(email)}`,
      phone && `phone=${String(phone)}`,
    ]
      .filter(Boolean)
      .join('&');

    const route = `/teams/${props.teamId}/dashboard/deeplink/residents/create${
      queryParams ? `?${queryParams}` : ''
    }`;
    router.push(route);
  };

  return (
    <form
      onSubmit={(event) => {
        if (searchQuery.trim() != '') {
          props.handleSearch(searchQuery);
        }
        event.preventDefault();
      }}
      className={styles.form}
    >
      <label className={styles.label} htmlFor="search-query">
        Search query
      </label>
      <input
        name="search-query"
        id="search-query"
        className={`govuk-input lbh-input ${styles.inputForm}`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by name or contact detail"
      />
      <button className={`govuk-button lbh-button `}>Search</button>
      <button
        className={`govuk-button lbh-button lbh-button--secondary`}
        onClick={() => navigateToCreateResident()}
      >
        Create New
      </button>
    </form>
  );
};

interface Props {
  handleSearch(searchQuery: string): void;
  teamId: string;
  isFromDeeplink: boolean;
  name: string | string[] | undefined;
  email: string | string[] | undefined;
  phone: string | string[] | undefined;
}

export default ResidentSearchForm;
