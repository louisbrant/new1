module.exports = {
  BASEURL: __dirname + "/upload/",
  DIR: __dirname,
  dbconf:
    "mongodb://adworks:123QWE456RTY@34.122.170.201:27017/raffles?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-256",
  USER_SESSION_TIME: 900,
  test: "mongodb://localhost:27017/oemservice?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000",
};
