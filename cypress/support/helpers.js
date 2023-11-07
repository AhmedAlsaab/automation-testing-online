// non-custom-command functions

export const onlyRunOn = (envsToRunOn) => {
  const currentEnv = Cypress.env('projectEnv');
  const conditionToSkip = envsToRunOn.includes(currentEnv) ? it : it.skip;
  return conditionToSkip;
};
