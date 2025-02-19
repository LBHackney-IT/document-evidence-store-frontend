// team id 1 in teams.json is Google Group HackneyAll while defaultUser from commands.ts is not a member of it
describe('all pages under teams check for google group membership', () => {
  beforeEach(() => {
    cy.login();
  });

  context(
    'when attempting to view the evidence request dashboard for a team the user is not authenticated to see',
    () => {
      it('redirects to the teams landing page', () => {
        cy.login();

        cy.visit(`http://localhost:3000/teams/1/dashboard`);

        cy.get('h1').should('contain.text', 'Choose a team');
      });
    }
  );

  context(
    'when attempting to view the requests for a team the user is not authenticated to see',
    () => {
      it('redirects to the teams landing page', () => {
        cy.login();

        cy.visit(`http://localhost:3000/teams/1/dashboard/requests`);

        cy.get('h1').should('contain.text', 'Choose a team');
      });
    }
  );

  context(
    'when attempting to create a new request for a team the user is not authenticated to see',
    () => {
      it('redirects to the teams landing page', () => {
        cy.login();

        cy.visit(`http://localhost:3000/teams/1/dashboard/requests/new/1`);

        cy.get('h1').should('contain.text', 'Choose a team');
      });
    }
  );

  context(
    'when attempting to view the residents for a team the user is not authenticated to see',
    () => {
      it('redirects to the teams landing page', () => {
        cy.login();

        cy.visit(`http://localhost:3000/teams/1/dashboard/residents/123`);

        cy.get('h1').should('contain.text', 'Choose a team');
      });
    }
  );

  context(
    'when attempting to view documents for a team the user is not authenticated to see',
    () => {
      it('redirects to the teams landing page', () => {
        cy.login();

        cy.visit(
          `http://localhost:3000/teams/1/dashboard/residents/123/document/123`
        );

        cy.get('h1').should('contain.text', 'Choose a team');
      });
    }
  );
});
