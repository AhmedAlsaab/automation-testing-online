import { faker } from '@faker-js/faker';

export const createBookingData = () => {
  return cy.wrap({
    firstName: faker.person.firstName('female'),
    lastName: faker.person.lastName('female'),
    email: faker.internet.email(),
    phoneNo: faker.phone.number(),
  });
};
