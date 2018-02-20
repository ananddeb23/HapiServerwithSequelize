

module.exports = (sequelize, DataTypes) => {
  const librarymybook = sequelize.define('librarymybook', {
    author: DataTypes.STRING,
    bookid: DataTypes.INTEGER,
    bookname: DataTypes.STRING,
    rating: DataTypes.FLOAT,
  }, {
    classMethods: {
      associate(models) {
        // associations can be defined here
      },
    },
  });
  return librarymybook;
};
