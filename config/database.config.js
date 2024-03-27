require('dotenv').config();

module.exports = {
    url: `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASS}@test-cluster.wvpnfkn.mongodb.net/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority&appName=test-cluster`
};
