const rp = require('request-promise');
const model = require('../../models');
require('es6-promise');

const url2 = 'https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/findBookById/';

// returns an array of promises to get ratings for each book id
const getpromisesbookratings = (bookdetailsArray) => {
  const bookratingpromisesresult = [];
  for (let i = 0; i < bookdetailsArray.length; i += 1) {
    bookratingpromisesresult.push(rp(`${url2}${bookdetailsArray[i].id}`));
  }
  return bookratingpromisesresult;
};
// returns an array containingt ratings for each book id
const ratingsfromresult = (bookratingpromises, bookratingsarray) => {
  const booksrating = [];
  for (let i = 0; i < bookratingpromises.length; i += 1) {
    booksrating.push(JSON.parse(bookratingsarray[i]).rating);
  }
  return booksrating;
};
// returns an array of objects where each has an additonal property of ratings
const addratingspropertytobooks = (bookdetailsArray, booksrating) => {
  const bookdetailswithratingarray = bookdetailsArray.slice();
  for (let i = 0; i < bookdetailsArray.length; i += 1) {
    bookdetailswithratingarray[i].rating = booksrating[i];
  }

  return bookdetailswithratingarray;
};

// groups input array of objects by a given property name
const groupBy = (xs, key) => xs.reduce((rv, x) => {
  (rv[x[key]] = rv[x[key]] || []).push(x);
  return rv;
}, {});

// returns a promise which resolves when data is sucessfully inserted in the database
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

// returns a promise which resolves when data is updated in the database and rejects if book id is not present in database
const updatelikestatus = (status, id) => {
  const updatelikepromise = new Promise((resolve, reject) => {
    model.librarymybooklikes.find({
      where: {
        bookid: id,
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
const togglelikestatus = (id) => {
  const updatelikepromise = new Promise((resolve, reject) => {
    model.librarymybooklikes.find({
      where: {
        bookid: id,
      },
    }).then((datarec) => {
      // console.log(datarec);
      if (!datarec) {
        return reject(new Error(' No record'));
      }
      let nextstat = 'like';
      if (datarec.dataValues.likeStatus === 'like') {
        nextstat = 'dislike';
      }
      const obj = {
        author: datarec.dataValues.author,
        bookid: datarec.dataValues.bookid,
        bookname: datarec.dataValues.bookname,
        rating: datarec.dataValues.rating,
        likeStatus: nextstat,
      };
      model.librarymybooklikes.update(obj, { where: { bookid: id } }).then(() => {
        // console.log('Updated');
        resolve(nextstat);
      });
    });
  });
  return updatelikepromise;
};
// returns a promise which resolves when data is fetched from all source apis and the data is reformatted into the required form
const getPromiseGetandFormatData = () => {
  const promiseGetandFormatData = new Promise((resolve, reject) => {
    const getbookdetails = rp('https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/allBooks');
    getbookdetails.then((bookdetails) => {
      const bookdetailsArray = JSON.parse(bookdetails).books;
      const bookratingpromises = getpromisesbookratings(bookdetailsArray);
      Promise.all(bookratingpromises).then((bookratingsarray) => {
        const booksrating = ratingsfromresult(bookratingpromises, bookratingsarray);
        const bookdetailswithratingarray = addratingspropertytobooks(bookdetailsArray, booksrating);
        resolve(bookdetailswithratingarray);
      }).catch(() => { reject(new Error('failed in getting all the ratings')); });
    }).catch(() => { reject(new Error('failed in getting data from api 1')); });
  });
  return promiseGetandFormatData;
};
// formats the object keys to match database table fields specifications and returns an array
const getinformat = (bookdetailswithratingarray) => {
  // const origbookarray = bookdetailswithratingarray.slice();
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
      getPromiseGetandFormatData().then((bookdetailswithratingarray) => {
        const groupedByAuthor = groupBy(bookdetailswithratingarray, 'Author');
        // console.log('after', groupedByAuthor);
        response(groupedByAuthor).code(200);
      }).catch((msg) => {
        response(msg.message).code(500);
      });
      // const getbookdetails = rp('https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/allBooks');
      // getbookdetails.then((bookdetails) => {
      //   const bookdetailsArray = JSON.parse(bookdetails).books;
      //   const bookratingpromises = getpromisesbookratings(bookdetailsArray);
      //   Promise.all(bookratingpromises).then((bookratingsarray) => {
      //     const booksrating = ratingsfromresult(bookratingpromises, bookratingsarray);
      //     const bookdetailswithratingarray = addratingspropertytobooks(bookdetailsArray, booksrating);
      //     // console.log(bookdetailswithratingarray);
      //     const groupedByAuthor = groupBy(bookdetailswithratingarray, 'Author');
      //     // console.log('after', groupedByAuthor);
      //     response(groupedByAuthor).code(200);
      //   });
      // });//
    },
  },

  {
    method: 'GET',
    path: '/storedetails',
    handler: (request, response) => {
      getPromiseGetandFormatData().then((bookdetailswithratingarray) => {
        const datatoinsert = getinformat(bookdetailswithratingarray);
        insertintodb(datatoinsert).then((msg) => {
          response('Records have been created!').code(201);
        });
      }).catch((msg) => {
        response(msg.message).code(500);
      });
      // const getbookdetails = rp('https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/allBooks');
      // getbookdetails.then((bookdetails) => {
      //   const bookdetailsArray = JSON.parse(bookdetails).books;
      //   const bookratingpromises = getpromisesbookratings(bookdetailsArray);
      //   Promise.all(bookratingpromises).then((bookratingsarray) => {
      //     const booksrating = ratingsfromresult(bookratingpromises, bookratingsarray);
      //     const bookdetailswithratingarray = addratingspropertytobooks(bookdetailsArray, booksrating);

      //   });
      // });
    },
  },
  {
    method: 'GET',
    path: '/like/{id}',
    handler: (request, response) => {
      updatelikestatus('like', request.params.id).then(() => {
        response('ID has been liked').code(200);
      }).catch(() => {
        response('Book id not in database').code(404);
      });
    },
  },
  {
    method: 'GET',
    path: '/getData',
    handler: (request, response) => {
      model.librarymybooklikes.findAll().then((data) => {
        if (data.length === 0) {
          response(JSON.stringify('EMPTYDB')).code(200);
        }
        const datatosend = [];
        for (let i = 0; i < data.length; i += 1) {
          const obj = {
            bookid: data[i].bookid,
            author: data[i].author,
            bookname: data[i].bookname,
            rating: data[i].rating,
            likeStatus: data[i].likeStatus,
          };
          datatosend.push(obj);
        }
        const groupedByAuthor = groupBy(datatosend, 'author');
        const res = JSON.stringify(groupedByAuthor);
        response(res).code(200);
      });
    },
  },
  {
    method: 'GET',
    path: '/populateandgetData',
    handler: (request, response) => {
      getPromiseGetandFormatData().then((bookdetailswithratingarray) => {
        const datatoinsert = getinformat(bookdetailswithratingarray);
        insertintodb(datatoinsert).then((msg) => {
          model.librarymybooklikes.findAll().then((data) => {
            if (data.length === 0) {
              response('EMPTYDBERROR').code(200);
            }
            const datatosend = [];
            for (let i = 0; i < data.length; i += 1) {
              const obj = {
                bookid: data[i].bookid,
                author: data[i].author,
                bookname: data[i].bookname,
                rating: data[i].rating,
                likeStatus: data[i].likeStatus,
              };
              datatosend.push(obj);
            }
            const groupedByAuthor = groupBy(datatosend, 'author');
            response(groupedByAuthor).code(200);
          });
        });
      }).catch((msg) => {
        response(msg.message).code(500);
      });
    },
  },
  {
    method: 'GET',
    path: '/togglelike/{id}',
    handler: (request, response) => {
      togglelikestatus(request.params.id).then((msg) => {
        response(msg).code(200);
      }).catch(() => {
        response('Book id not in database').code(404);
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
        response('Book id not in database').code(404);
      });
    },
  },
];

module.exports.insertintodb = insertintodb;
module.exports.updatelikestatus = updatelikestatus;
module.exports.getpromisesbookratings = getpromisesbookratings;
module.exports.addratingspropertytobooks = addratingspropertytobooks;
module.exports.groupBy = groupBy;
