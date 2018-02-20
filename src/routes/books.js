const rp = require('request-promise');
const model = require('../../models');
require('es6-promise');

const url2 = 'https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/findBookById/';

const getpromisesbookratings = (bookdetailsArray) => {
  // //console.log('getpromisebr', bookdetailsArray);
  const bookratingpromisesresult = [];
  for (let i = 0; i < bookdetailsArray.length; i += 1) {
    bookratingpromisesresult.push(rp(`${url2}${bookdetailsArray[i].id}`));
  }
  // //console.log('getpromisebr2', bookratingpromisesresult);
  return bookratingpromisesresult;
};

const ratingsfromresult = (bookratingpromises, bookratingsarray) => {
  const booksrating = [];
  for (let i = 0; i < bookratingpromises.length; i += 1) {
    booksrating.push(JSON.parse(bookratingsarray[i]).rating);
  }
  return booksrating;
};
const addratingspropertytobooks = (bookdetailsArray, booksrating) => {
  const bookdetailswithratingarray = bookdetailsArray.slice();
  for (let i = 0; i < bookdetailsArray.length; i += 1) {
    bookdetailswithratingarray[i].rating = booksrating[i];
  }

  return bookdetailswithratingarray;
};

const groupBy = (xs, key) => xs.reduce((rv, x) => {
  (rv[x[key]] = rv[x[key]] || []).push(x);
  return rv;
}, {});


const insertintodb = (bookdetailswithratingarray) => {
  const bookdetailswithratingandlike = bookdetailswithratingarray.slice();
  for (let i = 0; i < bookdetailswithratingarray.length; i += 1) {
    bookdetailswithratingandlike[i].likeStatus = 'unallocated';
  }
  const promiseinsertdb1 = new Promise((resolve, reject) => {
    model.librarymybook.destroy({ where: {} }).then(() => {
      model.librarymybook.bulkCreate(bookdetailswithratingarray).then(() => {
        resolve('db1');
      });
    });
  });
  const promiseinsertdb2 = new Promise((resolve, reject) => {
    model.librarymybooklikes.destroy({ where: {} }).then(() => {
      model.librarymybooklikes.bulkCreate(bookdetailswithratingandlike).then(() => {
        resolve('db2');
      });
    });
  });
  return Promise.all([promiseinsertdb1, promiseinsertdb2]);
};

const updatelikestatus = (status, id) => {
  const updatelikepromise = new Promise((resolve, reject) => {
    model.librarymybooklikes.find({
      where: {

      },
    }).then((datarec) => {
      // console.log(datarec);
      if (!datarec) {
        return reject(new Error(' No record'));
      }
      const obj = {
        author: datarec.dataValues.author,
        bookid: datarec.dataValues.bookid,
        bookname: datarec.dataValues.bookname,
        rating: datarec.dataValues.rating,
        likeStatus: status,
      };
      model.librarymybooklikes.update(obj, { where: { bookid: id } }).then(() => {
        // console.log('Updated');
        resolve('Updated!');
      });
    });
  });
  return updatelikepromise;
};

const getinformat = (bookdetailswithratingarray) => {
  const origbookarray = bookdetailswithratingarray.slice();
  const resultarrayindbformat = [];
  for (let i = 0; i < bookdetailswithratingarray.length; i++) {
    const obj = {
      author: bookdetailswithratingarray[i].Author,
      bookid: bookdetailswithratingarray[i].id,
      bookname: bookdetailswithratingarray[i].Name,
      // fix the db entry
      rating: bookdetailswithratingarray[i].rating,

    };
    resultarrayindbformat.push(obj);
  }
  return resultarrayindbformat;
};

module.exports = [
  {
    method: 'GET',
    path: '/showdetails',
    handler: (request, response) => {
      const getbookdetails = rp('https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/allBooks');
      getbookdetails.then((bookdetails) => {
        const bookdetailsArray = JSON.parse(bookdetails).books;
        const bookratingpromises = getpromisesbookratings(bookdetailsArray);
        Promise.all(bookratingpromises).then((bookratingsarray) => {
          const booksrating = ratingsfromresult(bookratingpromises, bookratingsarray);
          const bookdetailswithratingarray = addratingspropertytobooks(bookdetailsArray, booksrating);
          // console.log(bookdetailswithratingarray);
          const groupedByAuthor = groupBy(bookdetailswithratingarray, 'Author');
          // console.log('after', groupedByAuthor);
          response(groupedByAuthor).code(200);
        });
      });
    },
  },
  {
    method: 'GET',
    path: '/storedetails',
    handler: (request, response) => {
      const getbookdetails = rp('https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/allBooks');
      getbookdetails.then((bookdetails) => {
        const bookdetailsArray = JSON.parse(bookdetails).books;
        const bookratingpromises = getpromisesbookratings(bookdetailsArray);
        Promise.all(bookratingpromises).then((bookratingsarray) => {
          const booksrating = ratingsfromresult(bookratingpromises, bookratingsarray);
          const bookdetailswithratingarray = addratingspropertytobooks(bookdetailsArray, booksrating);
          const datatoinsert = getinformat(bookdetailswithratingarray);
          insertintodb(datatoinsert).then((msg) => {
            // //console.log('MSG', msg);
            response('Records have been created!').code(201);
          });
        });
      });
    },
  },
  {
    method: 'GET',
    path: '/like/{id}',
    handler: (request, response) => {
      updatelikestatus('like', request.params.id).then(() => {
        response('ID has been liked').code(200);
      }).catch(() => {
        response('Book id not in database').code(200);
      });
    },
  },
  {
    method: 'GET',
    path: '/dislike/{id}',
    handler: (request, response) => {
      updatelikestatus('dislike', request.params.id).then(() => {
        response('ID has been disliked').code(200);
      }).catch(() => {
        response('Book id not in database').code(200);
      });
    },
  },
];

module.exports.insertintodb = insertintodb;
module.exports.updatelikestatus = updatelikestatus;
module.exports.getpromisesbookratings = getpromisesbookratings;
module.exports.addratingspropertytobooks = addratingspropertytobooks;
module.exports.groupBy = groupBy;
