// const server = require('../src/server.js');
// const models = require('../models');
const booksroute = require('../src/routes/books');
// const request = require('request');


describe('group by function must work correctly', () => {
  const data = [{
    name: 'anand',
    age: 21,
  }, { name: 'sumi', age: 21 },
  { name: 'anand', age: 41 }];

  const result = {
    anand: [{ name: 'anand', age: 21 }, { name: 'anand', age: 41 }],
    sumi: [{ name: 'sumi', age: 21 }],
  };
  it('group by function must return expected result', () => {
    expect((booksroute.groupBy(data, 'name'))).toEqual(result);
  });
});

describe('array of promises must be retuerned testing getpromsesFunction', () => {
  const data = [{
    Author: 'J K Rowling',
    id: 1,
    Name: 'Harry Potter and the Sorcerers Stone (Harry Potter, #1)',
  },
  {
    Author: 'J K Rowling',
    id: 2,
    Name: 'Harry Potter and the Chamber of Secrets (Harry Potter, #2)',
  },
  {
    Author: 'Sidney Sheldon',
    id: 8,
    Name: 'If Tomorrow Comes (Tracy Whitney Series, #1)',
  },
  { Author: 'Sidney Sheldon', id: 10, Name: 'Tell Me Your Dreams' },
  {
    Author: 'J K Rowling',
    id: 3,
    Name: 'Harry Potter and the Prisoner of Azkaban (Harry Potter, #3)',
  },
  {
    Author: 'J K Rowling',
    id: 4,
    Name: 'Harry Potter and the Goblet of Fire (Harry Potter, #4)',
  },
  { Author: 'Sidney Sheldon', id: 9, Name: 'Master of the Game' },
  {
    Author: 'Sidney Sheldon',
    id: 11,
    Name: 'The Other Side of Midnight (Midnight #1)',
  },
  {
    Author: 'J K Rowling',
    id: 5,
    Name: 'Harry Potter and the Order of the Phoenix (Harry Potter, #5)',
  },
  {
    Author: 'J K Rowling',
    id: 6,
    Name: 'Harry Potter and the Half-Blood Prince (Harry Potter, #6)',
  },
  {
    Author: 'J K Rowling',
    id: 7,
    Name: 'Harry Potter and the Deathly Hallows (Harry Potter, #7)',
  },
  { Author: 'Sidney Sheldon', id: 12, Name: 'Rage of Angels' }];
  it('object must be returned', () => {
    expect(typeof (booksroute.getpromisesbookratings(data))).toBe('object');
  });
  it('object length must be same as input', () => {
    expect(booksroute.getpromisesbookratings(data).length).toBe(data.length);
  });
});

describe('ratings must get added to the input array', () => {
  const data = [{
    Author: 'J K Rowling',
    id: 1,
    Name: 'Harry Potter and the Sorcerers Stone (Harry Potter, #1)',
  },
  {
    Author: 'J K Rowling',
    id: 2,
    Name: 'Harry Potter and the Chamber of Secrets (Harry Potter, #2)',
  },
  {
    Author: 'Sidney Sheldon',
    id: 8,
    Name: 'If Tomorrow Comes (Tracy Whitney Series, #1)',
  },
  { Author: 'Sidney Sheldon', id: 10, Name: 'Tell Me Your Dreams' },
  {
    Author: 'J K Rowling',
    id: 3,
    Name: 'Harry Potter and the Prisoner of Azkaban (Harry Potter, #3)',
  },
  {
    Author: 'J K Rowling',
    id: 4,
    Name: 'Harry Potter and the Goblet of Fire (Harry Potter, #4)',
  },
  { Author: 'Sidney Sheldon', id: 9, Name: 'Master of the Game' },
  {
    Author: 'Sidney Sheldon',
    id: 11,
    Name: 'The Other Side of Midnight (Midnight #1)',
  },
  {
    Author: 'J K Rowling',
    id: 5,
    Name: 'Harry Potter and the Order of the Phoenix (Harry Potter, #5)',
  },
  {
    Author: 'J K Rowling',
    id: 6,
    Name: 'Harry Potter and the Half-Blood Prince (Harry Potter, #6)',
  },
  {
    Author: 'J K Rowling',
    id: 7,
    Name: 'Harry Potter and the Deathly Hallows (Harry Potter, #7)',
  },
  { Author: 'Sidney Sheldon', id: 12, Name: 'Rage of Angels' }];
  const ratingsinput = [4.45, 4.38, 4.02, 3.93, 4.54, 4.53, 4.1, 3.9, 4.47, 4.54, 4.62, 3.92];
  const result = [{
    Author: 'J K Rowling',
    id: 1,
    Name: 'Harry Potter and the Sorcerers Stone (Harry Potter, #1)',
    rating: 4.45,
  },
  {
    Author: 'J K Rowling',
    id: 2,
    Name: 'Harry Potter and the Chamber of Secrets (Harry Potter, #2)',
    rating: 4.38,
  },
  {
    Author: 'Sidney Sheldon',
    id: 8,
    Name: 'If Tomorrow Comes (Tracy Whitney Series, #1)',
    rating: 4.02,
  },
  {
    Author: 'Sidney Sheldon',
    id: 10,
    Name: 'Tell Me Your Dreams',
    rating: 3.93,
  },
  {
    Author: 'J K Rowling',
    id: 3,
    Name: 'Harry Potter and the Prisoner of Azkaban (Harry Potter, #3)',
    rating: 4.54,
  },
  {
    Author: 'J K Rowling',
    id: 4,
    Name: 'Harry Potter and the Goblet of Fire (Harry Potter, #4)',
    rating: 4.53,
  },
  {
    Author: 'Sidney Sheldon',
    id: 9,
    Name: 'Master of the Game',
    rating: 4.1,
  },
  {
    Author: 'Sidney Sheldon',
    id: 11,
    Name: 'The Other Side of Midnight (Midnight #1)',
    rating: 3.9,
  },
  {
    Author: 'J K Rowling',
    id: 5,
    Name: 'Harry Potter and the Order of the Phoenix (Harry Potter, #5)',
    rating: 4.47,
  },
  {
    Author: 'J K Rowling',
    id: 6,
    Name: 'Harry Potter and the Half-Blood Prince (Harry Potter, #6)',
    rating: 4.54,
  },
  {
    Author: 'J K Rowling',
    id: 7,
    Name: 'Harry Potter and the Deathly Hallows (Harry Potter, #7)',
    rating: 4.62,
  },
  {
    Author: 'Sidney Sheldon',
    id: 12,
    Name: 'Rage of Angels',
    rating: 3.92,
  }];
  it('object must be returned with correct corresponding ratings', () => {
    expect((booksroute.addratingspropertytobooks(data, ratingsinput))).toEqual(result);
  });
  it('object length must be same as input', () => {
    expect(booksroute.addratingspropertytobooks(data, ratingsinput).length).toBe(data.length);
  });
});

