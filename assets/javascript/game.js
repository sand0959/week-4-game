// global variables

var myHTML = [];
var clickCounter = 0;
var HPArray = [150, 165, 175, 190];
var playerId;
var defenderId;
var originalAPArray = [7, 9, 8, 3];
var defenderIsHereCounter = 0;
var victoryCounter = 0;

// the object holding all the bands stats
var bandArray = [{
    name: "N SYNC",
    img: "../week-4-game/assets/images/nsync200150.jpg",
    HP: 150,
    AP: 7,
    APInc: 7,
    counterAP: 12
}, {
    name: "BackStreet Boys",
    img: "../week-4-game/assets/images/backstreet200150.jpg",
    HP: 135,
    AP: 9,
    APInc: 9,
    counterAP: 8
}, {
    name: "One Direction",
    img: "../week-4-game/assets/images/one-d200150.jpg",
    HP: 165,
    AP: 8,
    APInc: 8,
    counterAP: 12
}, {
    name: "98 Degrees",
    img: "../week-4-game/assets/images/98degrees.jpg",
    HP: 170,
    AP: 3,
    APInc: 3,
    counterAP: 16
}];



$(document).ready(function() {

    // prepares the data for the first load of bandArray to the html.
    for (var i = 0; i < bandArray.length; i++) {
        myHTML += "<div class='outer-img-container text-center' id=" + i + "><p>" + bandArray[i].name + "</p><div class='inner-img-container'><img class='hero-images' src=" + bandArray[i].img + "></div><p class='health'</p>" + "health: " + bandArray[i].HP + "</div>";
    }

    // loads the data from above to the html
    bandArray[0].HP = 150;
    $(".first-container").html(myHTML);

    // When the player's selection is clicked.
    $("body").on("click", ".outer-img-container", function(event) {
        // if the click counter is zero, that means the player has not selcted a band yet.
        if (clickCounter === 0) {
            $(".instructions").css("display", "none");
            $(".vis-invis").css("visibility", "visible");
            playerId = $(this).attr("id");
            // give your choice a class of "good"
            $(this).addClass("good");
            // give the other bands a class of "pretender"
            $(this).siblings('div').addClass("pretender");
            // store the pretender into the opponents variable
            var opponents = $(this).siblings('div').detach();
            // store your band in the player variable
            var player = $(this).detach();
            // adds your band to the div with a class of "your-character"
            $(".your-character").append(player);
            //adds the opponents into the div with a class of "enemies"
            $(".enemies").append(opponents);
            // add one to the click counter, stops from reselecting a hero during the game
            clickCounter++;
        }
    });

    $("body").on("click", "div.pretender", function() {
        // If a defender has not yet been selected.
        if (defenderIsHereCounter === 0) {
            // hold the if of the defender is the defenderID variable, for later use
            defenderId = $(this).attr("id");
            $(this).addClass("currentDefender");
            // detach the selected opponent and store it in the currentPretender variable
            var currentPretender = $(this).detach();
            // append the selected opponent to the div with a class of "defender"
            $(".defender").append(currentPretender);
            // add one to the defenderIsHereCounter variable, which keeps track of whether a defender occupies the defender spot or not.
            defenderIsHereCounter++;
        }
    });

    $("body").on("click", ".attack-button", function() {
        //checks if the defender spot has someone in it, if it is not, there is no one to attack, so attack-button will not trigger an action.
        if (defenderIsHereCounter === 1) {
            // attack button is clicked then the bands health is damaged by the amount of the defender's counterattack and the defender's health is damaged by the amount of the AP, which is increased by their APInc after every attack.
            bandArray[playerId].HP = bandArray[playerId].HP - bandArray[defenderId].counterAP;
            bandArray[defenderId].HP = bandArray[defenderId].HP - bandArray[playerId].AP;
            // The selector selects the div with a class of good that has a child p-tag with a class of health, and the html for that p-tag is then updated
            if (bandArray[playerId].HP > -1) {
                $("div.good > p.health").html("health: " + bandArray[playerId].HP);
            } else {
                bandArray[playerId].HP = 0;
                $("div.good > p.health").html("health: " + bandArray[playerId].HP);
            }
            // The selector selects the div with a class of currentDefender that has a child p-tag with a class of health, and the html for that p-tag is then updated
            if (bandArray[defenderId].HP > -1) {
                $("div.currentDefender > p.health").html("health: " + bandArray[defenderId].HP);
            } else {
                bandArray[defenderId].HP = 0;
                $("div.currentDefender > p.health").html("health: " + bandArray[defenderId].HP);
            }
            $(".hero-status").html("Hero Status: You attacked " + bandArray[defenderId].name + " for " + bandArray[playerId].AP + " damage!");
            $(".defender-status").html("Pretender Status: " + bandArray[defenderId].name + " attacked you for " + bandArray[defenderId].counterAP + " damage!");
            // checks if the player lost, then resets if so
            checkIfPlayerLost();
            // defender loses, then its removed from the game
            removeDefeatedDefender();
            // The hero's AP increases by its APInc after every attack
            bandArray[playerId].AP = bandArray[playerId].AP + bandArray[playerId].APInc;
        }
    });

    $("body").on("click", ".restart-button", function() {
        defenderIsHereCounter = 0;
        victoryCounter = 0;
        // removes the instructions after the band is selected
        $(".instructions").css("display", "initial");
        $(".your-character").empty();
        $(".your-character").append("<h3 class='vis-invis'>Your Band</h3>");
        $(".enemies").empty();
        $(".enemies").append("<h3 class='vis-invis'>Pretenders Available To Attack</h3>");
        $(".defender").empty();
        $(".defender-status").html("Pretender Status: ");
        $(".hero-status").html("Band Status: ");
        myHTML = [];
        for (var r = 0; r < bandArray.length; r++) {
            bandArray[r].HP = HPArray[r];
            bandArray[r].AP = originalAPArray[r];
        }
        for (var i = 0; i < bandArray.length; i++) {
            myHTML += "<div class='outer-img-container text-center' id=" + i + "><p>" + bandArray[i].name + "</p><div class='inner-img-container'><img class='hero-images' src=" + bandArray[i].img + "></div><p class='health'</p>" + "health: " + bandArray[i].HP + "</div>";
        }
        clickCounter = 0;
        $(".first-container").html(myHTML);
        // reset wasnt working, console.logged to find out what was up, works now
        console.log(defenderIsHereCounter);
        console.log(victoryCounter);
    });

});

function checkIfPlayerLost() {
    if (bandArray[playerId].HP < 1) {
        defenderIsHereCounter = 0;
        victoryCounter = 0;
        alert("You are a pretender!  BYEBYEBYE!!!!");
        $(".defender-status").html("Pretender Status: ");
        $(".hero-status").html("Band Status: ");
        $(".instructions").css("display", "initial");
        $(".your-character").empty();
        $(".your-character").append("<h3 class='vis-invis'>Your Hero</h3>");
        $(".enemies").empty();
        $(".enemies").append("<h3 class='vis-invis'>Pretenders Available To Attack</h3>");
        $(".defender").empty();
        myHTML = [];
        for (var r = 0; r < bandArray.length; r++) {
            bandArray[r].HP = HPArray[r];
            bandArray[r].AP = originalAPArray[r];
        }
        for (var i = 0; i < bandArray.length; i++) {
            myHTML += "<div class='outer-img-container text-center' id=" + i + "><p>" + bandArray[i].name + "</p><div class='inner-img-container'><img class='hero-images' src=" + bandArray[i].img + "></div><p class='health'</p>" + "health: " + bandArray[i].HP + "</div>";
        }
        clickCounter = 0;
        $(".first-container").html(myHTML);
    }
}

function removeDefeatedDefender() {
    if (bandArray[defenderId].HP < 1) {
        alert("That boy band was a PRETENDER!!!");
        $(".defender-status").html("Pretender Status: ");
        $(".hero-status").html("Band Status: ");
        $(".currentDefender").remove();
        defenderIsHereCounter = 0;
        victoryCounter++;
        if (victoryCounter === 3) {
            alert("You Are THE GREATEST BOY BAND EVER!!!!!!!! Here is your Reward!!!");
            open("https://youtu.be/Eo-KmOd3i7s");
        }
    }
}
