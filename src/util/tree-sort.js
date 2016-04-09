export const sortAlphabetic = (a, b) => {
  let aKeyValue = a.getKeyValue().toLowerCase();
  let bKeyValue = b.getKeyValue().toLowerCase();

  if (aKeyValue < bKeyValue) {
    return -1;
  }

  if (aKeyValue > bKeyValue) {
    return 1;
  }

  return 0;
};

export const sortNumeric = (a, b) => a.getKeyValue() - b.getKeyValue();
