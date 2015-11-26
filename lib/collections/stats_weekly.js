StatsWeekly = new Mongo.Collection("stats.weekly", {connection: SmellServer});
SmellServer.subscribe("stats");