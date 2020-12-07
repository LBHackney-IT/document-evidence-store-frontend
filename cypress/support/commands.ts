import jwt from 'jsonwebtoken';

const defaultUser: UserData = {
  email: 'test@hackney.gov.uk',
  name: 'Test User',
  groups: ['development-team-staging'],
};

Cypress.Commands.add('login', (userData: UserData = defaultUser) => {
  const jwtSecret = Cypress.env('HACKNEY_JWT_SECRET');
  const cookieName = Cypress.env('HACKNEY_COOKIE_NAME');
  const token = jwt.sign(userData, jwtSecret);

  cy.setCookie(cookieName, token);
  Cypress.Cookies.preserveOnce(cookieName);
  cy.wrap(defaultUser).as('defaultUser');
  cy.wrap(userData).as('user');
});
