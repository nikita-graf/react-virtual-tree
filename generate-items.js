let itemTypes1 = ['low', 'middle', 'high'];
let itemTypes3 = ['a', 'b', 'c', 'd'];
let itemTypes2 = ['1', '2', '3', '4'];
let getRandomItem = (items) => items[Math.floor(Math.random() * items.length)];

export default () => {
  let items = [];

  for (let i = 0; i < 5000; i++) {
    items.push({
      id: i,
      type1: getRandomItem(itemTypes1),
      type2: getRandomItem(itemTypes2),
      type3: getRandomItem(itemTypes3),
      value: i,
    });
  }

  return items;
};
