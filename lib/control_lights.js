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


        var statsCursor = StatsMonthly.find({
            date: Date.thisMonth(),
            'metadata.user_id': null,
            'metadata.department': null,
            '_groupId': "radboudumc"
        });



        var updateHUE = function(stats) {


       stats.questions.forEach(function(question, i){
           var daily_mean = question.daily[Date.today().getDate() - 1].all.mean;
           console.log("daily_mean: " + daily_mean);
           //happiness.daily[Date.today().getDate() - 1].all.mean;

            var state = lightState.create(),
                colorInterpolator,
                color;
    //        
            switch(question.name){
                case "happiness":
                    colorInterpolator = chroma.scale(["#ff0000", "#00ff00"]).mode('lab');
                    color = colorInterpolator((daily_mean-1)/4).rgb();
                    state.on().rgb(color[0], color[1], color[2]).brightness(100);
                    break;
                case "feedback":
                    state.on().rgb(0, 50, 255).brightness(((daily_mean-1)/4)*100);
                    break;
                case "autonomie":
                    state.on().rgb(255, 153, 0).brightness(((daily_mean-1)/4)*100);
                    break;
                case "werkplezier":
                    state.on().rgb(255, 255, 0).brightness(((daily_mean-1)/4)*100);
                    break;
                case "welbevinden":
                    state.on().rgb(0, 102, 204).brightness(((daily_mean-1)/4)*100);
                    break;
                case "werkdruk":
                    state.on().rgb(255, 0, 0).brightness(((daily_mean-1)/4)*100);
                    break;
                case "ondersteuning":
                    state.on().rgb(0, 255, 0).brightness(((daily_mean-1)/4)*100);
                    break;
                case "ondersteuning":
                    state.on().rgb(0, 255, 0).brightness(((daily_mean-1)/4)*100);
                    break;
                case "betekenis":
                    state.on().rgb(204, 51, 255).brightness(((daily_mean-1)/4)*100);
                    break;


            }
            console.log(question.name);
            console.log(i);
            api.setLightState(i+1, state)
                .then(displayResult)
                .fail(displayError)
                .done();

       });


       }

        statsCursor.observe({
            added: function(doc) {
                updateHUE(doc);
            },
            changed: function(doc) {
                updateHUE(doc);
            }
        });

}