import { NextComponentType } from 'next';

export type PageComponent = NextComponentType & {
  private: ?boolean;
};
