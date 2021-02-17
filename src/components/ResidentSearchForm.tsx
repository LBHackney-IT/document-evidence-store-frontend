import React, { useState } from 'react';
import { Button } from 'lbh-frontend-react';
import styles from '../styles/ResidentSearch.module.scss';

const ResidentSearchForm = (props: Props): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState('');

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
        className="govuk-input lbh-input"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for a resident..."
      />
      <Button>Search</Button>
    </form>
  );
};

interface Props {
  handleSearch(searchQuery: string): void;
}

export default ResidentSearchForm;
