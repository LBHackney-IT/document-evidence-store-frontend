/// <reference types="cypress" />

type UserData = {
  email: string;
  name: string;
  groups: string[];
};

type IncludedImpacts = ImpactValues[];

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to set the cookie required to login to the app
     * @example cy.login()
     */
    login(userData: UserData): Chainable<Element>;
    /**
     * Custom command to test page accessibility.
     */
    checkAccessibility(includedImpacts: IncludedImpacts): Chainable<Element>;
  }
  interface ApplicationWindow {
    next;
  }
}
