import React, { useState } from 'react';
import styles from '../styles/ResidentSearch.module.scss';

const ResidentSearchForm = (props: Props): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
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
        <button className={`govuk-button lbh-button ${styles.searchButton}`}>
          Search
        </button>
      </form>
    </div>
  );
};

interface Props {
  handleSearch(searchQuery: string): void;
}

export default ResidentSearchForm;
