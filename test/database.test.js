const server = require('../src/server.js');
const models = require('../models');
const booksroute = require('../src/routes/books');
const request = require('request');

describe('Testing create records/storedetails function', () => {
  beforeAll((done) => {
    models.librarymybook.destroy({ truncate: true })
      .then(msg => console.log(msg))
      .catch(err => console.error(err));
    server.start(() => {
      // console.log('Server running at:', server.info.uri);
      done();
    });
  });
  afterAll((done) => {
    server.stop(() => {
      done();
    });
  });
  it('Data must be inserted correctly and only once', (done) => {
    const obj = {
      author: 'anand',
      bookid: 1,
      bookname: 'life is awesome',
      rating: 4.9,

    };
    const datatoadd = [];
    datatoadd.push(obj);
    // const insertdbpromise = new Promise((resolve, reject) => {
    //   // //console.log(datatoinsert);
    //   booksroute.insertintodb(datatoadd);
    //   resolve('Data inserted');
    // });
    booksroute.insertintodb(datatoadd).then((msg) => {
      models.librarymybook.findAll({ where: { bookid: 1 } }).then((project) => {
        expect(project.length).toBe(1);
      });

      done();
    });
  });
});

describe('Testing update records function', () => {
  beforeAll((done) => {
    const obj = {
      author: 'anand',
      bookid: 6,
      bookname: 'life is super-awesome',
      rating: 4.6,

    };
    const datatoadd = [];
    datatoadd.push(obj);
    booksroute.insertintodb(datatoadd).then((msg) => {
      server.start(() => {
        // //console.log('Server running at:', server.info.uri);
        done();
      });
    });
  });
  afterAll((done) => {
    server.stop(() => {
      done();
    });
  });
  it('Data must be liked  or updated correctly', (done) => {
    booksroute.updatelikestatus('like', Number(6)).then((project) => {
      // //console.log('project', project);
      models.librarymybooklikes.findAll({ where: { bookid: Number(6) } }).then((project1) => {
        // //console.log('project', project1);
        expect(project1[0].likeStatus).toBe('like');
        done();
      });
    }).catch((msg) => {
      // console.log('Error msg is ', msg);
      done();
    });
  });
  it('Data must be disliked  or updated correctly', (done) => {
    booksroute.updatelikestatus('dislike', Number(6)).then((project) => {
      // //console.log('project', project);
      models.librarymybooklikes.findAll({ where: { bookid: Number(6) } }).then((project1) => {
        // //console.log('project', project1);
        expect(project1[0].likeStatus).toBe('dislike');
        done();
      });
    }).catch((msg) => {
      // console.log('Error msg is ', msg);
      done();
    });
  });
  it('Data must be updated  only once', (done) => {
    booksroute.updatelikestatus('like', Number(6)).then((project) => {
      // //console.log('project', project);
      models.librarymybooklikes.findAll({ where: { bookid: Number(6) } }).then((project1) => {
        // console.log('project', project1);
        expect(project1.length).toBe(1);
        done();
      });
    }).catch((msg) => {
      // //console.log('Error msg is ', msg);
      done();
    });
  });
});

