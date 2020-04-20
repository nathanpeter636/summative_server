let dbname = "Freebies";
let username = "root";
let password = "root";

exports.atlas = `mongodb://${username}:${password}@cluster0-shard-00-00-bbbaq.gcp.mongodb.net:27017,cluster0-shard-00-01-bbbaq.gcp.mongodb.net:27017,cluster0-shard-00-02-bbbaq.gcp.mongodb.net:27017/${dbname}?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority`
