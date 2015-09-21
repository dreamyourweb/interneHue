database = new MongoInternals.RemoteCollectionDriver(Meteor.settings.MONGO_URL);

StatsWeekly = new Mongo.Collection("stats.weekly", {_driver:database});