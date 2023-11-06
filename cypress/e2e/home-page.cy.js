describe('automation.online: home-page', () => {
  beforeEach(() => cy.visit('/'));

  context('home page welcome section', () => {
    it("can press on the 'Let me hack!' button", () => {
      cy.get('button').contains('Let me hack!').should('exist').and('not.be.disabled');
    });

    it("removes the 'Restful Booker' page intro when the 'Let me hack!' button is pressed", () => {
      cy.contains('Welcome to Restful Booker Platform').should('exist');

      cy.get('button').contains('Let me hack!').click();

      cy.contains('Welcome to Restful Booker Platform').should('not.exist');

      cy.reload();
    });
  });

  context('room booking section', () => {
    it('lists the current month and year in the calendar toolbar', () => {
      cy.fixture('test-data.json').then(({ months }) => {
        const now = new Date();
        const monthName = months[now.getMonth()];
        const year = now.getFullYear();

        cy.wrap({ currentMonth: monthName, currentYear: year }).as('currentDate');
      });

      cy.get('button').contains('Book this room').click();

      cy.get('.rbc-toolbar').within(() => {
        cy.get('@currentDate').then((currentDate) => {
          cy.get('span').contains(`${currentDate.currentMonth} ${currentDate.currentYear}`);
        });
      });
    });

    it("returns 'BAD REQUEST' when attemtping to book a room with invalid input data", () => {
      cy.intercept({ method: 'POST', pathname: '/booking/' }).as('bookingRequest');

      cy.intercept({ method: 'GET', pathname: '/report/room/*' }).as('roomBookingForm');

      cy.get('button').contains('Book this room').click();

      cy.wait('@roomBookingForm');

      cy.get("[class*='hotel-room-info']")
        .eq(1)
        .find('input')
        .each(($input) => {
          cy.wrap($input).type('someRandomData');
        });

      cy.get('button').contains('Book').click();

      cy.wait('@bookingRequest').its('response.body').should('include', {
        error: 'BAD_REQUEST',
        errorCode: 400,
      });
    });

    [
      {
        name: 'firstname',
        validationMsg: 'Firstname should not be blank',
        testData: 'Anny',
      },
      {
        name: 'lastname',
        validationMsg: 'Lastname should not be blank',
        testData: 'Smith',
      },
      {
        name: 'email',
        validationMsg: 'must be a well-formed email address',
        testData: 'anny_smith@hotmail.com',
      },
      {
        name: 'phone',
        validationMsg: 'size must be between 11 and 21',
        testData: '123456789111',
      },
    ].forEach((input) => {
      it(`removes the corresponding validation message from the alert prompt when the '${input.name}' field is correctly populated`, () => {
        cy.intercept({ method: 'POST', pathname: '/booking/' }).as('bookingRequest');

        cy.intercept({ method: 'GET', pathname: '/report/room/*' }).as('roomBookingForm');

        cy.get('button').contains('Book this room').click();

        cy.wait('@roomBookingForm');

        cy.get("[class*='hotel-room-info']")
          .eq(1)
          .within(() => {
            cy.get(`input[name='${input.name}']`).type(input.testData);

            cy.get('button').contains('Book').click();

            cy.wait('@bookingRequest')
              .its('response.body.fieldErrors')
              .should('not.include', input.validationMsg);

            cy.get("[class*='alert-danger']")
              .find('p')
              .each(($el) => {
                cy.wrap($el).should('not.have.text', input.validationMsg);
              });
          });
      });
    });

    it('clears the booking input fields when the "cancel" button is pressed', () => {
      cy.intercept({ method: 'GET', pathname: '/report/room/*' }).as('roomBookingForm');

      cy.get('button').contains('Book this room').click();

      cy.wait('@roomBookingForm');

      cy.createBookingData().then((bookingData) => {
        cy.get(`input[name='firstname']`).type(bookingData.firstName);

        cy.get(`input[name='lastname']`).type(bookingData.lastName);

        cy.get("input[name='email']").type(bookingData.email);

        cy.get("input[name='phone']").type(bookingData.phoneNo);
      });

      cy.get('button').contains('Cancel').click();

      cy.get('button').contains('Book this room').click();

      cy.wait('@roomBookingForm');

      cy.get("[class*='hotel-room-info']")
        .eq(1)
        .find('input')
        .each(($input) => {
          cy.wrap($input).should('be.empty');
        });
    });
  });
});
