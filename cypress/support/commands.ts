import jwt from 'jsonwebtoken';
import 'cypress-file-upload';

export const defaultUser: UserData = {
  email: 'test@hackney.gov.uk',
  name: 'Test User',
  groups: ['development-team-staging'],
};

Cypress.Commands.add('login', (userData: UserData = defaultUser) => {
  const cookieName = Cypress.env('RUNTIME_HACKNEY_COOKIE_NAME');
  const token = jwt.sign(userData, 'sekret');

  cy.setCookie(cookieName, token);
  cy.wrap(defaultUser).as('defaultUser');
  cy.wrap(userData).as('user');
});
