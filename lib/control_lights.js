if (Meteor.isServer) {
    var node_hue_api = Meteor.npmRequire("node-hue-api");
    var chroma = Meteor.npmRequire("chroma-js");


    var displayBridges = function(bridge) {
        console.log("Hue Bridges Found: " + JSON.stringify(bridge));
    }

    // --------------------------
    // Using a promise
    node_hue_api.locateBridges().then(displayBridges).done();

    var HueApi = node_hue_api.HueApi,
        lightState = node_hue_api.lightState;

    var displayResult = function(result) {
        console.log(result);
    };

    var displayStatus = function(status) {
        console.log(JSON.stringify(status, null, 2));
    };


    var displayError = function(err) {
       console.error(err);
    };

    var hostname = "192.168.0.101",
        username = "3f2b6978186638df36154b282f0ca0ef",
        api = new HueApi(hostname, username),
        state = lightState.create();

        // --------------------------
        // Using a promise
        api.lights()
            .then(displayResult)
            .done();

        var stats = StatsMonthly.findOne({
            date: Date.thisMonth(),
            'metadata.user_id': null,
            'metadata.department': null
        });

       var happiness = _.find(stats.questions, function(question) {
                return question.name === "happiness";
            });

        Tracker.autorun(function(){

        });

        var colorInterpolator = chroma.scale(["#ff0000", "#00ff00"]).mode('lab');

        var color = colorInterpolator(0.5).rgb();

        var red=20;
        var blue = 0;
        var green = 200;

        api.setLightState(1, state.on().rgb(color[0], color[1], color[2]))
            .then(displayResult)
            .fail(displayError)
            .done();

}
