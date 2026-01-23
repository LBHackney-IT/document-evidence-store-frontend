describe('Super user delete document functionality', () => {
  // Note: This test suite should be run with IS_SUPER_USER_DELETE_ENABLED=true
  // Use: npm run test:e2e:super-user

  const superUser = {
    email: 'test@hackney.gov.uk',
    name: 'Super User',
    groups: ['development-team-staging', 'development-team-production'],
  };

  const regularUser = {
    email: 'regular@hackney.gov.uk',
    name: 'Regular User',
    groups: ['development-team-staging', 'development-team-production'],
  };

  const navigateToResidentPage = () => {
    cy.clock(Date.UTC(2026, 9, 21), ['Date']);
    cy.visit(`http://localhost:3000/teams/2/dashboard`);
    cy.injectAxe();
    cy.contains('h1', 'Browse residents');
    cy.get('#search-query').type('Namey');
    cy.get('.govuk-button').first().click();
    cy.get('h2').should('contain', 'Search results');
    cy.get('tbody tr').should('have.length', 3);
    cy.get('a').contains('Namey McName').first().click();
    cy.get('h1').should('contain', 'Namey McName');
  };

  describe('when feature flag is enabled', () => {
    describe('as a super user', () => {
      beforeEach(() => {
        cy.login(superUser);
        navigateToResidentPage();
      });

      it('has no detectable accessibility issues', () => {
        cy.checkAccessibility();
      });

      it('displays delete buttons on document tiles', () => {
        cy.get('section[id="all-documents"]').within(() => {
          cy.get('[data-testid^="delete-button-"]').should('exist');
          cy.get('[data-testid^="delete-button-"]')
            .first()
            .should('contain', 'Delete')
            .and('be.visible');
        });
      });

      it('shows delete button with correct styling', () => {
        cy.get('[data-testid^="delete-button-"]')
          .first()
          .should('have.css', 'background-color', 'rgb(255, 255, 255)')
          .and('have.css', 'border-color', 'rgb(190, 58, 52)')
          .and('have.css', 'color', 'rgb(190, 58, 52)');
      });

      it('opens confirmation dialog when delete button is clicked', () => {
        cy.get('[data-testid^="delete-button-"]').first().click();

        cy.get('[role="alertdialog"]').should('be.visible');
        cy.get('[role="alertdialog"]').should(
          'contain',
          'Are you sure you want to delete this document?'
        );
        cy.get('[data-testid="confirm-delete-button"]').should('be.visible');
        cy.get('[data-testid="cancel-delete-button"]').should('be.visible');
      });

      it('closes dialog when cancel button is clicked', () => {
        cy.get('[data-testid^="delete-button-"]').first().click();
        cy.get('[role="alertdialog"]').should('be.visible');

        cy.get('[data-testid="cancel-delete-button"]').click();
        cy.get('[role="alertdialog"]').should('not.exist');
      });

      it('successfully deletes document when confirmed', () => {
        // Get the document ID from the first delete button
        cy.get('[data-testid^="delete-button-"]')
          .first()
          .invoke('attr', 'data-testid')
          .then((testId) => {
            const documentId = testId?.replace('delete-button-', '');

            // Intercept the PATCH request to the visibility endpoint
            cy.intercept(
              'PATCH',
              `/api/document_submissions/${documentId}/visibility`,
              {
                statusCode: 200,
                body: { success: true },
              }
            ).as('deleteDocument');

            // Click delete button
            cy.get(`[data-testid="delete-button-${documentId}"]`).click();
            cy.get('[role="alertdialog"]').should('be.visible');

            // Confirm delete
            cy.get('[data-testid="confirm-delete-button"]').click();

            // Wait for the API call
            cy.wait('@deleteDocument').then((interception) => {
              expect(interception.request.body).to.deep.equal({
                DocumentHidden: true,
              });
              expect(interception.request.headers).to.have.property(
                'useremail',
                superUser.email
              );
            });

            // Note: Page reload happens, so we can't assert much after this
          });
      });

      it('disables buttons while delete is in progress', () => {
        // Intercept with a delay to simulate network latency
        cy.intercept(
          'PATCH',
          '/api/document_submissions/*/visibility',
          (req) => {
            req.reply((res) => {
              res.delay = 1000;
              res.send({ statusCode: 200, body: { success: true } });
            });
          }
        ).as('deleteDocument');

        cy.get('[data-testid^="delete-button-"]').first().click();
        cy.get('[role="alertdialog"]').should('be.visible');

        cy.get('[data-testid="confirm-delete-button"]').click();

        // Check that buttons are disabled
        cy.get('[data-testid="confirm-delete-button"]').should('be.disabled');
        cy.get('[data-testid="cancel-delete-button"]').should('be.disabled');

        // Check for loading text
        cy.get('[data-testid="confirm-delete-button"]').should(
          'contain',
          'Deleting...'
        );
      });

      it('displays error message when delete fails', () => {
        cy.intercept('PATCH', '/api/document_submissions/*/visibility', {
          statusCode: 500,
          body: { error: 'Server error' },
        }).as('deleteDocumentError');

        cy.get('[data-testid^="delete-button-"]').first().click();
        cy.get('[role="alertdialog"]').should('be.visible');

        cy.get('[data-testid="confirm-delete-button"]').click();

        cy.wait('@deleteDocumentError');

        // Error message should appear in the dialog
        cy.get('[role="alertdialog"]').should(
          'contain',
          'An error occurred while deleting the document'
        );

        // Dialog should remain open
        cy.get('[role="alertdialog"]').should('be.visible');

        // Buttons should be re-enabled
        cy.get('[data-testid="confirm-delete-button"]').should(
          'not.be.disabled'
        );
        cy.get('[data-testid="cancel-delete-button"]').should(
          'not.be.disabled'
        );
      });

      it('displays delete buttons in all document tabs', () => {
        // Check all documents tab
        cy.get('a.govuk-tabs__tab[href*="all-documents"]').click();
        cy.get(
          'section[id="all-documents"] [data-testid^="delete-button-"]'
        ).should('exist');

        // Check pending review tab
        cy.get('a.govuk-tabs__tab[href*="pending-review"]').click();
        cy.get(
          'section[id="pending-review"] [data-testid^="delete-button-"]'
        ).should('exist');

        // Check approved tab
        cy.get('a.govuk-tabs__tab[href*="approved"]').click();
        cy.get('section[id="approved"] [data-testid^="delete-button-"]').should(
          'exist'
        );

        // Check rejected tab
        cy.get('a.govuk-tabs__tab[href*="rejected"]').click();
        cy.get('section[id="rejected"] [data-testid^="delete-button-"]').should(
          'exist'
        );
      });

      it('displays correct number of delete buttons matching document count', () => {
        cy.get('section[id="all-documents"]').within(() => {
          // Count tables (documents)
          cy.get('table').then(($tables) => {
            const tableCount = $tables.length;

            // Count delete buttons
            cy.get('[data-testid^="delete-button-"]').should(
              'have.length',
              tableCount
            );
          });
        });
      });
    });

    describe('as a non-super user', () => {
      beforeEach(() => {
        cy.login(regularUser);
        navigateToResidentPage();
      });

      it('does not display delete buttons on document tiles', () => {
        cy.get('section[id="all-documents"]').within(() => {
          cy.get('[data-testid^="delete-button-"]').should('not.exist');
        });
      });

      it('does not display delete buttons in any tab', () => {
        // Check all documents tab
        cy.get('a.govuk-tabs__tab[href*="all-documents"]').click();
        cy.get(
          'section[id="all-documents"] [data-testid^="delete-button-"]'
        ).should('not.exist');

        // Check pending review tab
        cy.get('a.govuk-tabs__tab[href*="pending-review"]').click();
        cy.get(
          'section[id="pending-review"] [data-testid^="delete-button-"]'
        ).should('not.exist');

        // Check approved tab
        cy.get('a.govuk-tabs__tab[href*="approved"]').click();
        cy.get('section[id="approved"] [data-testid^="delete-button-"]').should(
          'not.exist'
        );
      });
    });
  });
});

export {};
