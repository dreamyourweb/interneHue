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

    var hostname = "192.168.0.107",
        username = "39896f0931eb3ff71143564d22af6f1b",
        api = new HueApi(hostname, username);

    // --------------------------
    // Using a promise
    api.lights()
        .then(displayResult)
        .done();

    
    var inputDate = Date.thisYear().toISOString();

    var statsCursor = StatsWeekly.find({
        date: new Date(inputDate),
        '_groupId': "orikami"
    });

    var updateHUE = function(stats) {

        console.log(Date.thisWeek());

        stats.questions.forEach(function(question, i){
           var weekly_mean = question.weekly[Date.thisWeek() - 1].all.mean;
           console.log("weekly_mean: " + weekly_mean);

            var state = lightState.create(),
                colorInterpolator,
                color;
       
            switch(question.name){
                case "happiness":                      
                    colorInterpolator = chroma.scale(["#ff0000", "#00ff00"]).mode('lab');
                    color = colorInterpolator((weekly_mean)/5).rgb(); 
                    state.on().rgb(color[0], color[1], color[2]).brightness(100);
                    // state.ct(300);
                    break;
                case "uitdaging":
                    state.on().rgb(0, 0, 255).brightness(((weekly_mean-1)/6)*100);
                    break;
                case "werkdruk":
                    state.on().rgb(255, 0, 0).brightness(((weekly_mean-1)/6)*100);
                    break;
                case "resultaat":
                    state.on().rgb(255, 153, 0).brightness(((weekly_mean-1)/6)*100);
                    break;
            }
            console.log(question.name);
            console.log(i);
            api.setLightState(i+1, state)
                .then(displayResult)
                .fail(displayError)
                .done();

       });
   };

   var showAlert = function(stats) {
        stats.questions.forEach(function(question, i){
            var state = lightState.create().on().shortAlert();

            api.setLightState(i+1, state)
                .then(displayResult)
                .fail(displayError)
                .done();

        });

   };

    statsCursor.observe({
        added: function(doc) {
            showAlert(doc);
            updateHUE(doc);
        },
        changed: function(doc) {
            showAlert(doc);
            updateHUE(doc);
        }
    });

}