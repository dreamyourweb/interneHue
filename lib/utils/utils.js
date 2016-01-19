DateUtils = {
    toUTC: function(date) {
        return Date.UTC(
            date.getFullYear(),
            date.getMonth(), 
            date.getDate(), 
            date.getHours(), 
            date.getMinutes(), 
            date.getSeconds(), 
            date.getMilliseconds()
        );
    } 

};


MathUtils = {
    /*divide two numbers, return 0 instead of Infinity if denominator is 0*/
    safeRatio: function(numerator, denominator){
        return (denominator === 0) ? 0 : numerator/denominator;
    },
    /*average numbers in an array, return 0 if array is empty*/
    safeAvg: function(numbers){
        var nr_elements = numbers.length;
        if(!(nr_elements > 0)){
            return 0;
        }

        sum = 0;
        for(i = 0; i<nr_elements; i++){
            sum =+ numbers[i];
        }
        return sum / nr_elements;
    }
};

 Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(),0,1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay())/7);
};


Date.today = function(){
    d = new Date();
    d.setUTCFullYear(d.getFullYear());
    d.setUTCMonth(d.getMonth());
    d.setUTCDate(d.getDate());
    d.setUTCHours(0,0,0,0);
    return d;
};

Date.yesterday = function(){
    d = new Date();
    d.setUTCFullYear(d.getFullYear());
    d.setUTCMonth(d.getMonth());
    d.setUTCDate(d.getUTCDate()-1);
    d.setUTCHours(0,0,0,0);
    return d;
};

Date.thisWeek = function(){
    var today = new Date();
    d = today.getWeek();
    return d;
};

Date.thisMonth = function(){
    d = new Date();
    d.setUTCFullYear(d.getFullYear());
    d.setUTCMonth(d.getMonth());
    d.setUTCDate(1);
    d.setUTCHours(0,0,0,0);
    return d;
};

Date.thisYear = function(){
    d = new Date();
    d.setUTCFullYear(d.getFullYear());
    d.setUTCMonth(0);
    d.setUTCDate(1);
    d.setUTCHours(0,0,0,0);
    return d;
};

Date.thisHour = function(){
    var currentHour;
    d = new Date();
    currentHour = d.getUTCHours();
    d.setUTCFullYear(d.getFullYear());
    d.setUTCMonth(d.getMonth());
    d.setUTCDate(d.getUTCDate());
    d.setUTCHours(currentHour,0,0,0);
    return d;   
};

Date.lastMonth = function(){
    // current month
    d = Date.thisMonth();
    // last day of previous month
    d.setUTCDate(0);
    // first day of previous month
    d.setUTCDate(1);
    // 0 hours
    d.setUTCHours(0,0,0,0)
    return d;
}

Date.thisIsoWeek = function() {
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000- 3 + (week1.getDay() + 6) % 7) / 7);
}

Date.nrDaysInMonth = function(date){
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), 0).getDate();
}
