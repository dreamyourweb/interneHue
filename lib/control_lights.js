if (Meteor.isServer) {
    var node_hue_api = Meteor.npmRequire("node-hue-api");
    var chroma = Meteor.npmRequire("chroma-js");
    var user;
    var ligthData;


    var locateBridges = Meteor.wrapAsync(node_hue_api.locateBridges);
    bridges = locateBridges();
    console.log("Hue Bridges Found: " + JSON.stringify(bridges));

    var displayUserResult = function(result) {
        console.log("Created user: " + JSON.stringify(result));
    };

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


    var hostname = process.env.HUE_HOST || bridges[0].ipaddress,
        username = process.env.HUE_USER || user || "39896f0931eb3ff71143564d22af6f1b",
        api = new HueApi(hostname, username);

    // --------------------------
    // Using a promise
    api.lights()
        .then(displayResult)
        .done();


    var inputDate = Date.thisYear().toISOString();
    var statsCursor = StatsWeekly.find({
        date: new Date(inputDate),
        'metadata.user_id': null,
        'metadata.department': null
    });


    var updateHUE = function(stats, alert) {


        stats.questions.forEach(function(question, i) {
            var weekly_mean = question.weekly[Date.thisIsoWeek() - 1].all.mean;
            console.log("weekly_mean: " + weekly_mean);
            //happiness.daily[Date.today().getDate() - 1].all.mean;

            var state = lightState.create(),
                colorInterpolator,
                color;
    
            switch (question.name) {
                // case "happiness":
                //     colorInterpolator = chroma.scale(["#ff0000", "#00ff00"]).mode('lab');
                //     color = colorInterpolator((weekly_mean - 1) / 4).rgb();
                //     state.on().rgb(color[0], color[1], color[2]).brightness(100);
                //     break;
                // case "feedback":
                //     state.on().rgb(0, 50, 255).brightness(((weekly_mean - 1) / 4) * 100);
                //     break;
                // case "autonomie":
                //     state.on().rgb(255, 153, 0).brightness(((weekly_mean - 1) / 4) * 100);
                //     break;
                // case "werkplezier":
                //     state.on().rgb(255, 255, 0).brightness(((weekly_mean - 1) / 4) * 100);
                //     break;
                // case "welbevinden":
                //     state.on().rgb(0, 102, 204).brightness(((weekly_mean - 1) / 4) * 100);
                //     break;
                // case "werkdruk":
                //     state.on().rgb(255, 0, 0).brightness(((weekly_mean - 1) / 4) * 100);
                //     break;
                // case "ondersteuning":
                //     state.on().rgb(0, 255, 0).brightness(((weekly_mean - 1) / 4) * 100);
                //     break;
                // case "ondersteuning":
                //     state.on().rgb(0, 255, 0).brightness(((weekly_mean - 1) / 4) * 100);
                //     break;
                // case "betekenis":
                //     state.on().rgb(204, 51, 255).brightness(((weekly_mean - 1) / 4) * 100);
                //     break;


                case "happiness":                      
                    colorInterpolator = chroma.scale(["#ff0000", "#00ff00"]).mode('lab');
                    color = colorInterpolator((weekly_mean)/5).rgb(); 
                    if(alert) {
                        state.shortAlert();
                    }
                    state.on().rgb(color[0], color[1], color[2]).brightness(100);
                    break;
                case "uitdaging":
                    if(alert) {
                        state.shortAlert();
                    }
                    state.on().rgb(0, 0, 255).brightness(((weekly_mean-1)/6)*100);
                    break;
                case "werkdruk":
                    if(alert) {
                        state.shortAlert();
                    }
                    state.on().rgb(255, 0, 0).brightness(((weekly_mean-1)/6)*100);
                    break;
                case "resultaat":
                    if(alert) {
                        state.shortAlert();
                    }
                    state.on().rgb(255, 153, 0).brightness(((weekly_mean-1)/6)*100);
                    break;


            }

            api.setLightState(i + 1, state)
                .then(displayResult)
                .fail(displayError)
                .done();

        });


    };

    statsCursor.observe({
        added: function(doc) {
            updateHUE(doc, true);
            ligthData = doc;
        },
        changed: function(doc) {
            updateHUE(doc, true);
            ligthData = doc;
        }
    });

    // update ligth every 5 sec
    // need if the light were turn off and turn on again 
    setInterval(function() { 
        updateHUE(ligthData);
    }, 3000);
}