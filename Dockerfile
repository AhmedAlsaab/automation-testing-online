FROM cypress/included:12.17.3

WORKDIR /e2e

COPY package.json .
COPY cypress.config.js .
COPY cypress cypress

RUN npm install

ENTRYPOINT ["npx", "cypress", "run"]