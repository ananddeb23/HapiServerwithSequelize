

module.exports = (sequelize, DataTypes) => {
  let librarymybooklikes = sequelize.define('librarymybooklikes', {
    author: DataTypes.STRING,
    bookid: DataTypes.INTEGER,
    bookname: DataTypes.STRING,
    rating: DataTypes.FLOAT,
    likeStatus: DataTypes.STRING,
  }, {
    classMethods: {
      associate(models) {
        // associations can be defined here
      },
    },
  });
  return librarymybooklikes;
};
