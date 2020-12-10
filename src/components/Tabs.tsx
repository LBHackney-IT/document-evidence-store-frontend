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
    <BaseTabs className={styles.outer}>
      <h2 className={styles.title}>Contents</h2>

      <TabList className={styles.tabList}>
        {props.tabTitles.map((title: string) => (
          <Tab key={title} className={styles.tab}>
            {title}
          </Tab>
        ))}
      </TabList>

      <TabPanels className={styles.tabPanels}>
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
