/// <reference types="cypress" />

type UserData = {
  email: string;
  name: string;
  groups: string[];
};

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to set the cookie required to login to the app
     * @example cy.login()
     */
    login(userData: UserData): Chainable<Element>;
  }
}
