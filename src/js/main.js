(function() {
"use strict";


    console.log('watch working?');

    //set to -1 to indicate the index leading up to the first slide
    //change last one back to 50 sec
    var data, currentSlideId = 8, countDownOn=false, hasStarted=false, startTime = 0,
        endTime = 0;

    var totalTimeforTest = null;

    //TODO:
    function invertColor(hexTripletColor) {
        var color = hexTripletColor;
        color = color.substring(1);           // remove #
        color = parseInt(color, 16);          // convert to integer
        color = 0xFFFFFF ^ color;             // invert three bytes
        color = color.toString(16);           // convert to hex
        color = ("000000" + color).slice(-6); // pad with leading zeros
        color = "#" + color;                  // prepend #
        return color;
    }

    var generateRandColor = function () {
        var hexDigitArray = '0123456789ABCDEF'.split('');
        var randColorHex = '#';
        for (var i = 0; i < 6; i++)
            randColorHex += hexDigitArray[Math.floor(Math.random()*16)];
        document.body.style.backgroundColor = randColorHex;
        //some saturated hues are difficult to read on their inverse
        document.body.style.color = invertColor(randColorHex);
    };

    var showElapsedTime = function() {
        var elapsedTimeDiv = document.getElementById("timeElapsed");
        //if (totalTimeforTest) {
        //    totalTimeforTest -=
        //}
        elapsedTimeDiv.textContent = "You did this many";
    };

    var showNextSlide = function() {
        if (hasStarted === false) {
            startTime = new Date().getTime();
            hasStarted = true;
        }

        generateRandColor();
        showElapsedTime();
        var slideObject = data[++currentSlideId];
        console.log(currentSlideId);

        if (!slideObject) {
            console.log("Test Done!");
            endTime = new Date().getTime();
            console.log((endTime - startTime));
            return;
        }

        var thisSlideTime =  slideObject.seconds;
        var remainingSecondsDiv = document.getElementById("remaining-seconds");
        var instructionsDiv = document.getElementById("instructions");

        remainingSecondsDiv.textContent = thisSlideTime;
        instructionsDiv.textContent = slideObject.instructions;
        setCountdown(thisSlideTime, remainingSecondsDiv);
        countDownOn = true;
    };



    function setCountdown(seconds, secondsDiv) {
            var idCountDown = setInterval(function () {
                secondsDiv.textContent = --seconds;
                if (seconds === 0) {
                    clearInterval(idCountDown);
                    showNextSlide();
                }
            }, 1000);
    }

    var request = new XMLHttpRequest();
    request.open('GET', '/data.json', true);

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            data = JSON.parse(request.responseText).slide;
            showNextSlide();
            for (var i = 0; i < data.length; i++) {
                totalTimeforTest += data[i].seconds*1000;
            }
            console.log(totalTimeforTest);
        } else {
            // We reached our target server, but it returned an error

        }
    };

    request.onerror = function() {
        // There was a connection error of some sort
    };

request.send();

    var startButton = document.getElementById("startTime");
    startButton.addEventListener("click", function () {
        showNextSlide();
    });

    var t = setTimeout(function() {console.log("I am alive"), 5000});

})();
