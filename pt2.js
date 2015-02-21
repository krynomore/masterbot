// Defining some basic functions and variables
var disabled = false;
var answering = false;

// People who can control the bot
var masters = ["KrYnoMoRe","Bruno02468", "sammich", "Randomguy_", "Mr. Guy", "InfraRaven", "Kevin", "L̫̪̯̠͠A̜̭̘͚M̧̮͙͇̭̫P̷̘"]; 
var banned = ["gaybutts", "DoomsdayMuffinz", "Anonymous", "anon2000"];

var help = "#cyanI am Boxxy, a creation of KrYnoMoRe, with code from Bruno02468,Randomguy and Mr. Guy!\n";
    help += "Commands:\n";
    help += "         !help: Get some help when using the bot!\n";
    help += "         !weather [city, state/country]: Gives you the weather for a part of the world.\n";
    help += "         !iploc [ip]: Gives the physical location of a URL or IP.\n";
    help += "         !radio: Retrieves the URL for the Spooks Radio Stream.\n";
    help += "         !track: See what's currently blasting on Spooks Radio!\n";
// Anti-spam variables
var antiSpam = false;
var score = 0;

// Increment spam score
function spamFilters() {
    score++;
    antiSpam = true;
    setTimeout(function() {
        antiSpam = false;
    }, 700);
}


// Decrement spam score
setInterval(function() {
    if (score > 0) {
        score--;
    }
}, 8000);

// Clear the screen every hour
setInterval(function() {
    CLIENT.submit("/clear");
}, 3600000);

// Send and trigger anti-spam
function send(text) {
    if (!antiSpam && score < 7 && !disabled) {
        CLIENT.submit(text);
        spamFilters();
    }
}

// Fetching something via AJAX
function ajaxGet(url) {
    var request = null;
    request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send(null);
    return request.responseText;
}

// Escaping strings
function escapeForSending(string) {
    var pat = /\/(?:.)/gi;
    return string.replace(pat, "\\/");
}

// Case insensitive string lookup function
String.prototype.contains = function(it) { return this.toLowerCase().indexOf(it.toLowerCase()) != -1; };

// Username popup and flair setter, basic setup
var botnick = "Masterbot";
CLIENT.submit("/nick " + botnick);
CLIENT.submit("/style  ");
CLIENT.submit("/flair $Montserrat|#808080/^" + botnick);
CLIENT.submit("/safe");
CLIENT.submit("/mute");

// All set up
CLIENT.submit("/echo #greenBoxxy now running.");

// Mouse bot -- possibly future-proofing AFK detection?



// Begin logging process and listen for commands
CLIENT.on('message', function(data) {
    var text = data.message.trim();
    if (data.nick !== undefined)
        var name = data.nick;
    var trueMessage = parser.removeHTML(parser.parse(text));
    trueMessage = trueMessage.trim();
    argumentString = trueMessage.substring(trueMessage.indexOf(" ") + 1);
    var argumentsArray = argumentString.split(" ");
    
    var r = $('#messages').children().slice(-1)[0].outerHTML.search(
    /message (personal-message|general-message|error-message|note-message|system-message)/g
    );
    
    if (name !== botnick && !(banned.indexOf(name) > -1)) {
        
        //COMMAND HANDLERS
        if (text.contains("!toggle")) {
            toggle(name);
        } else if (text.contains("!ops")) {
            listMasters() 
        } else if (text.contains("watch?v=")) {
            getTitles(text);
        } else if (text.contains("!trigger")) {
            toggleTrigger(name);
        } else if (text.contains("!weather")) {
            weather(argumentString);
        } else if (text.contains("!quote")) {
            quote(argumentString);
        } else if (text.contains("!block")) {
            blockban(name, argumentString);
        } else if (text.contains("!unblock")) {
            unblockban(name, argumentString);
        } else if (text.contains("!iploc")) {
            iploc(argumentString);
        } else if (text.contains("!cursor")) {
            toggleCursor(name);
        } else if (text.contains("!radio")) {
            send("#cyanYou can listen to Spooks Radio here: http://spooksradio.tk");
        } else if (text.contains("!track")) {
            getSong();
        } else if (text.contains("!stream")) {
            send("#cyanSpooks Radio Stream: http://216.170.123.121:8000/listen.pls?sid=1"); 
        } else if (text.contains("!banlist")) {
            banlist(name);
            // Logging messages to my server :3
            $.ajax({
                url : "http://bruno02468.com/masterbot/api.php?action=log&msg=" + encodeURIComponent(text),
                type : 'GET',
                success : function(data) { console.log("Succesfully pushed to server!"); }
            });
        }
            
    }
        
});


// ==============================
// |     COMMAND FUNCTIONS      |
// ==============================

// Fetches a random message from the server and sends it


// Fetches the count of logged messages and sends it


// Sends the title for a given YouTube video ID
function getTitle(url) {
    var video_id = url.substring(url.indexOf("v=") + 2, url.indexOf("v=") + 13);
    var data = ajaxGet("http://bruno02468.com/masterbot/api.php?action=youtube&id=" + video_id);
    CLIENT.submit("#cyanTitle: " + data);
}

// Look for the titles of  YouTube videos in the messages
function getTitles(message) {
    var urlpattern = /(http|https):\/\/([\w\-_]+(?:(?:\.[\w\-_]+)+))([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])/gim;
    var idpattern = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/gim;
    var urls = message.match(urlpattern);
    console.log(urls);
    for (c in urls) {
        var id = urls[c].match(idpattern)[0];
        if (id !== undefined) {
            getTitle(id);
        }
    }
}

// Answers questions


// Coin flippin'


// Rollin'


// Lists masters
function listMasters() {
    var msg = "#orangeMy masters are ";
    for (var i = 0; i < masters.length - 1; i++) {
        msg += masters[i] + ", ";
    }
    msg += "and " + masters[masters.length - 1] + ".";
    send(msg);
}

// Toggles the bot
function toggle(name) {
    if (masters.indexOf(name) > -1) {
        disabled = !disabled;
        if (!disabled) {
            send("#greenMasterbot now enabled.");
        } else {
            CLIENT.submit("#redMasterbot now disabled.");
        }
    } else {
        CLIENT.submit("/pm " + name + "|#redYou do not have permission to toggle me. Stop it.");
    }
}

// Block someone from using the bot
function blockban(name, target) {
    if (masters.indexOf(name) > -1) {
    	if (!(banned.indexOf(target) > -1)) {
            CLIENT.submit("#redMaster " + name + " has blocked " + target + " from using the bot.");
            banned.push(target);
    	} else {
    	    CLIENT.submit("#redMaster " + name + ", that user is already blocked.");
    	}
    } else {
        CLIENT.submit("/pm " + name + "|#redYou do not have permission to do that. Stop it.");
    }
}

// Unblock someone from using the bot
function unblockban(name, target) {
    if (masters.indexOf(name) > -1) {
        var ind = banned.indexOf(target);
        if (ind > -1) {
            CLIENT.submit("#greenMaster " + name + " has unblocked " + target + " from using the bot.");
            banned.splice(ind, 1);
        } else {
            CLIENT.submit("#redMaster " + name + ", that user is not blocked.");
        }
    } else {
        CLIENT.submit("/pm " + name + "|#redYou do not have permission to do that. Stop it.");
    }
}

// List blocked users
function banlist(name) {
    if (masters.indexOf(name) > -1) {
        CLIENT.submit("/pm " + name + "|#cyanBan list: [" + banned + "].");
    } else {
        CLIENT.submit("/pm " + name + "|#redYou do not have permission to do that. Stop it.");
    }
}

// Toggles "?"-in-the-end trigger for random message sending
function toggleTrigger(name) {
    if (masters.indexOf(name) > -1) {
        if (answering) {
            send("#redQuestion answering now disabled.");
            answering = false;
        } else {
            send("#greenQuestion answering now enabled.");
            answering = true;
        }
    } else {
        CLIENT.submit("/pm " + name + "|#redYou do not have permission to do this. Stop it.");
    }
}

// Look up line from the database


// Gets a random image from a subreddit


// Roulette function


// Gets definition of a word


// Gets weather for a location
function weather(loc) {
    $.getJSON("https://query.yahooapis.com/v1/public/yql?q=select%20item.condition%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22" + loc + "%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys")
        .success(function(data) {
            if (data.query.results !== null) {
                var farenheit = data.query.results.channel.item.condition.temp;
                var celsius = (farenheit - 32) * (5 / 9);
                send('#cyanThe current temperature in ' + loc + ' is ' + farenheit + ' ºF or ' + Math.floor(celsius) + ' ºC, and current weather is: ' + data.query.results.channel.item.condition.text + ".");
            } else {
                send("#redNothing found for given location!");
            }
        }).fail(function() {
            send("#redNothing found for given location!");
        }
    );
}

// Gets location of IP
function iploc(ip) {
    $.getJSON("https://freegeoip.net/json/" + ip)
        .success(function(data) {
            if (data.city != "" && data.region_code != "" && data.country_name != "") {
                send("#cyanThe location of the IP " + ip + " is " + data.city + ", " + data.region_code + ", " + data.country_name + ".");
            } else {
                send("#redInvalid IP '" + ip + "' or location unavailable.");
            }
        }).fail(function() {
            send("#redNothing found for that IP.");
        }
    );
}

// Says something someone has leanred today


// Looks for a quote in a subreddit


// Crazy function to get the current /msg


// Toggles the bot
function toggleCursor(name) {
    if (masters.indexOf(name) > -1) {
        cursor = !cursor;
        if (cursor) {
            send("#greenAuto move cursor now enabled.");
        } else {
            CLIENT.submit("#redAuto move cursor now disabled.");
        }
    } else {
        CLIENT.submit("/pm " + name + "|#redYou do not have permission to toggle the automatic movement of the cursor. Stop it.");
    }
}

// Say the current track on Spooks Radio
function getSong() {
    var songname = ajaxGet("http://spooksradio.tk/currentsong_bruno.php");
    if (!songname) {
        songname = "nothing at the moment";
    }
    send("#cyanSpooks Radio is currently playing " + songname + ".");
}

// I'd just like to interject for a moment...


// Put stuff in the frame


// Put stuff in a corkboard


