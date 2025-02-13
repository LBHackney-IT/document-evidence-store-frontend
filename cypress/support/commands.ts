import jwt from 'jsonwebtoken';
import 'cypress-file-upload';

export enum AccessibilityImpactCheckLevel {
  MINOR = 'minor',
  MODERATE = 'moderate',
  SERIOUS = 'serious',
  CRITICAL = 'critical',
}

export const defaultUser: UserData = {
  email: 'test@hackney.gov.uk',
  name: 'Test User',
  groups: ['development-team-staging', 'development-team-production'],
};

Cypress.Commands.add('login', (userData: UserData = defaultUser) => {
  const cookieName = Cypress.env('HACKNEY_COOKIE_NAME');
  const token = jwt.sign(userData, 'sekret');

  cy.setCookie(cookieName, token);
  cy.wrap(defaultUser).as('defaultUser');
  cy.wrap(userData).as('user');
});

Cypress.Commands.add(
  'checkAccessibility',
  (
    includedImpacts: AccessibilityImpactCheckLevel[] = [
      AccessibilityImpactCheckLevel.CRITICAL,
      AccessibilityImpactCheckLevel.SERIOUS,
      // AccessibilityImpactCheckLevel.MODERATE,
      // AccessibilityImpactCheckLevel.MINOR,
    ]
  ) => {
    cy.checkA11y(undefined, {
      includedImpacts,
      runOnly: {
        type: 'tag',
        values: ['wcag22aa', 'best-practice'],
      },
    });
  }
);
