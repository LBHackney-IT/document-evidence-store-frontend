import React from 'react';
import {
  Tabs as BaseTabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@reach/tabs';
import '@reach/tabs/styles.css';
import styles from '../styles/Tabs.module.scss';

const Tabs = (props: Props): JSX.Element => {
  return (
    <BaseTabs className={styles.outer} data-module="govuk-tabs">
      <h2 className={styles.title}>Contents</h2>

      <TabList className={styles.tabList}>
        {props.tabTitles.map((title: string) => (
          <li key={title} className={styles.tab}>
            <Tab className={styles.tabLink}>{title}</Tab>
          </li>
        ))}
      </TabList>

      <TabPanels>
        {props.children.map((child, i) => (
          <TabPanel key={i} className={styles.tabPanel}>
            {child}
          </TabPanel>
        ))}
      </TabPanels>
    </BaseTabs>
  );
};

export default Tabs;

interface Props {
  tabTitles: string[];
  children: React.ReactNode[];
}
