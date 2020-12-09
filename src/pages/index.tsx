import { useState } from "react"
import Head from 'next/head';
import { Heading, HeadingLevels, FilterTabs, Input, Button } from 'lbh-frontend-react';
import Layout from '../components/DashboardLayout';
import { ReactNode } from 'react';
import styles from "../styles/ResidentSearch.module.scss"

const BrowseResidents = (): ReactNode => {

  const [ searchQuery, setSearchQuery ] = useState("")

  const handleSearch = () => {
    // handle search here
  }

  return(
    <Layout>
      <Head>
        <title>Browse residents</title>
      </Head>
      <Heading level={HeadingLevels.H2}>Browse residents</Heading>

      {searchQuery}

      <form onSubmit={handleSearch} className={styles.form}>
        <label className={styles.label} htmlFor="search-query">Search query</label>
        <input 
          name="search-query"
          id="search-query"
          className="govuk-input lbh-input" 
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search for a resident..."
        />
        <Button>Search</Button>
      </form>

      <FilterTabs
        tabTitles={[
          "To do (5)",
          "All (5)"
        ]}
        children={[
            <p>First</p>,
            <p>Second</p>
        ]}
      />

    </Layout>
  )
}



export default BrowseResidents;