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
        state2 = lightState.create();
        state3 = lightState.create();
        state4 = lightState.create();        
        state5 = lightState.create();
        state6 = lightState.create();


        console.log(state);

        // --------------------------
        // Using a promise
        api.lights()
            .then(displayResult)
            .done();

        var stats = StatsMonthly.findOne({
            date: Date.thisMonth(),
            'metadata.user_id': null,
            'metadata.department': null,
            '_groupId': "radboudumc"
        });

       var happiness = _.find(stats.questions, function(question) {
                return question.name === "happiness";
            });

       var daily_mean = happiness.daily[Date.today().getDate() - 1].all.mean;
       console.log("daily_mean: " + daily_mean);
       //happiness.daily[Date.today().getDate() - 1].all.mean;

//        Tracker.autorun(function(){

//        });

        var colorInterpolator = chroma.scale(["#ff0000", "#00ff00"]).mode('lab');
        var color = colorInterpolator((daily_mean-1)/4).rgb();
        api.setLightState(1, state.on().rgb(color[0], color[1], color[2]).brightness(100))
            .then(displayResult)
            .fail(displayError)
            .done();
}
//kleur blauw voor feedback
       var feedback = _.find(stats.questions, function(question) {
                return question.name === "feedback";
            });
       var feedback_mean = feedback.daily[Date.today().getDate() - 1].all.mean;
       console.log("feedback_mean: " + feedback_mean);

        api.setLightState(2, state2.on().rgb(0, 50, 255).brightness(((feedback_mean-1)/4)*100))
            .then(displayResult)
            .fail(displayError)
            .done();



//kleur oranje voor autonomie  
       var autonomie = _.find(stats.questions, function(question) {
                return question.name === "autonomie";
            });
       var autonomie_mean = autonomie.daily[Date.today().getDate() - 1].all.mean;
       console.log("autonomie_mean: " + autonomie_mean);

        api.setLightState(3, state3.on().rgb(255, 153, 0).brightness(((autonomie_mean-1)/4)*100))
            .then(displayResult)
            .fail(displayError)
            .done();


//kleur geel voor werkplezier 
       var werkplezier = _.find(stats.questions, function(question) {
                return question.name === "werkplezier";
            });
       var werkplezier_mean = werkplezier.daily[Date.today().getDate() - 1].all.mean;
       console.log("werkplezier_mean: " + werkplezier_mean);

        api.setLightState(4, state4.on().rgb(255, 255, 0).brightness(((werkplezier_mean-1)/4)*100))
            .then(displayResult)
            .fail(displayError)
            .done();


// kleur lichtblauw voor welbevinden
       var welbevinden = _.find(stats.questions, function(question) {
                return question.name === "welbevinden";
            });
       var welbevinden_mean = welbevinden.daily[Date.today().getDate() - 1].all.mean;
       console.log("welbevinden_mean: " + welbevinden_mean);


        api.setLightState(5, state5.on().rgb(0, 102, 204).brightness(((welbevinden_mean-1)/4)*100))
            .then(displayResult)
            .fail(displayError)
            .done();

        
       //kleur rood voor werkdruk
       var werkdruk = _.find(stats.questions, function(question) {
                return question.name === "werkdruk";
            });
       var werkdruk_mean = werkdruk.daily[Date.today().getDate() - 1].all.mean;
       console.log("werkdruk_mean: " + werkdruk_mean);


        api.setLightState(6, state6.on().rgb(255, 0, 0).brightness(((werkdruk_mean-1)/4)*100))
            .then(displayResult)
            .fail(displayError)
            .done();
        

       //  //kleur groen voor ondersteuning 
       // var ondersteuning = _.find(stats.questions, function(question) {
       //          return question.name === "ondersteuning";
       //      });
       // var ondersteuning_mean = ondersteuning.daily[Date.today().getDate() - 1].all.mean;
       // console.log("ondersteuning_mean: " + ondersteuning_mean);


       //  api.setLightState(3, state7.on().rgb(0, 255, 0).brightness(((ondersteuning_mean-1)/4)*100))
       //      .then(displayResult)
       //      .fail(displayError)
       //      .done();
       //  }
        //kleur paars voor betekenis 
       // var betekenis = _.find(stats.questions, function(question) {
       //          return question.name === "betekenis";
       //      });
       // var betekenis_mean = betekenis.daily[Date.today().getDate() - 1].all.mean;
       // console.log("betekenis_mean: " + betekenis_mean);


       //  api.setLightState(3, state4.on().rgb(204, 51, 255).brightness(((betekenis_mean-1)/4)*100))
       //      .then(displayResult)
       //      .fail(displayError)
       //      .done();



