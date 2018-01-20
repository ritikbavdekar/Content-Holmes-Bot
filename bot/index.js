"use strict";
var builder = require('botbuilder');
var request = require('request');
var socket = require('socket.io-client')('https://www.contentholmes.com');
var siteUrl=null;

var connector = new builder.ChatConnector();

var version = 1.0;

var bot = new builder.UniversalBot(connector);
var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/d3f9f044-2ab8-42c9-8652-f3f864eb6611?subscription-key=0fefdf81ed3d4b87b94232d361daf8f0';
var recognizer = new builder.LuisRecognizer(model);

bot.use(builder.Middleware.dialogVersion({ version: version }));

/*** Including Libraries ***/

bot.library(require('./dialogs/productivity').createLibrary());
bot.library(require('./dialogs/report').createLibrary());
bot.library(require('./dialogs/user').createLibrary());
bot.library(require('./dialogs/utilities').createLibrary());

/*** Global Actions ***/

bot.beginDialogAction('login', 'firstRun');
bot.beginDialogAction('relogin', '/profile');
bot.beginDialogAction('help', 'utilities:help', { matches: /^help/i });
bot.beginDialogAction('block', 'productivity:actions/block', {matches: /^block/i});
bot.beginDialogAction('session', 'productivity:actions/session', {matches: /^session/i});
bot.beginDialogAction('unblock', 'productivity:actions/unblock', {matches: /^unblock/i});
bot.beginDialogAction('unsession', 'productivity:actions/unsession', {matches: /^unsession/i});
bot.endConversationAction('goodbye', 'Goodbye :)', { matches: /^goodbye/i });

/*** Basic Intents and Messaging ***/

var intents = new builder.IntentDialog({ recognizers: [recognizer] })
.onDefault(function(session) {
    session.send("I did not understand what you said.");
    session.beginDialog('/help');
})
.matches('hi', function (session, args) {
            session.sendTyping();
            session.send("Hello %s!", session.userData.name);
    })
.matches('productivity.block', [
    function(session, args) {
        session.beginDialog('productivity:actions/block', args);
    }
    ])
.matches('productivity.session', [
    function(session, args) {
        session.beginDialog('productivity:actions/session', args);
    }
    ])
.matches('productivity.unblock', [
    function(session, args) {
        session.beginDialog('productivity:actions/unblock', args);
    }
    ])
.matches('productivity.unsession', [
    function(session, args) {
        session.beginDialog('productivity:actions/unsession', args);
    }
])
.matches('report.depressionScores', [
    function (session, args, next) {
        session.beginDialog('report:depressionScores', args);
    }
 ])
.matches('report.history', [
    function (session, args, next) {
        session.beginDialog('report:history', args);
    }
])
.matches('report.interest', [
    function(session, args, next) {
    	session.beginDialog('productivity:interest', args);
    }
])
.matches('utilities.help', [
	function(session) {
		session.beginDialog('utilities:help');
	}
]);

/*** Under Maintainence ***/

bot.dialog('/', intents);

/*** To be replaced by user:login ***/

bot.dialog('/profile', [
    function (session, args, next) {
        if(args) {
            session.dialogData.get = args.get;
            next();
        } else {
            session.sendTyping();
            builder.Prompts.text(session, 'What can I call you?');
        }
    },
    function (session, results) {
        if(session.dialogData.get=="email"||!session.dialogData.get) {
            if(!session.dialogData.get) {
                session.userData.name = results.response;
            }
            session.sendTyping();
            builder.Prompts.text(session, 'Please give me your registered email id');
        }
    },
    function (session,results) {
        if(validateEmail(results.response)) {
            session.userData.email = results.response;
            session.sendTyping();
            builder.Prompts.text(session, 'Please give me your PIN');
        } else {
            session.send("Invalid email id");
            session.replaceDialog('/profile', {"get":"email"});
        }
    },
    function (session, results) {
        session.userData.password = results.response;
        session.userData.childArray = [];

        //Get Children Array Here!
        //'https://www.contentholmes.com/data/?email='+session.userData.email+'&password='+session.userData.password
        request('https://www.contentholmes.com/childArray/?email='+session.userData.email+'&password='+session.userData.password, function(error, response, body) {
            if(!error) {
                var res = JSON.parse(body);
                if(res.text.success==true) {
                    session.userData.childArray = [].concat(res.text.childArray);
                    console.log("Here: "+session.userData.childArray[0]);
                    session.endDialogWithResult({"result":true});
                    // console.log(session.userData.childArray[1]);
                } else {
                    session.sendTyping();
                    session.send("Invalid Credentials. Please register on http://www.contentholmes.com to avail yourself to my services");
                    session.endDialogWithResult({"result":false});
                }
            } else {
                session.sendTyping();
                session.send("Your data is wrong, you need to \"Change your profile info\"");
                session.endDialogWithResult({"result":true});
            }
        });
    }
]);

/*** To be replaced by the conversation update code below ***/

bot.dialog('firstRun', [
    function(session) {
        session.userData.version = version;
        var loginCard = new builder.HeroCard(session)
            .title("Welcome to Content Holmes")
            .subtitle("I am your personal assistant ask me anything :-)")
            .buttons([
                builder.CardAction.openUrl(session, "https://www.contentholmes.com/auth/facebook", "Sign Up!"),
                builder.CardAction.openUrl(session, "https://www.contentholmes.com","Visit our website")
            ]);
        session.send(new builder.Message(session)
            .addAttachment(loginCard));
        session.beginDialog('/profile');
    },
    function(session, results) {
        if(results.result==true) {
            session.sendTyping();
            session.send("Hello %s!", session.userData.name);
        } else {
            session.userData.version = 0;
        }
        session.endDialog();
    }]).triggerAction({
    onFindAction: function (context, callback) {
        var ver = context.userData.version || 0;
        var score = ver < version ? version : 0.0;
        callback(null, score);
    },
    onInterrupted: function(session, dialogId, dialogArgs, next) {
        session.send("Sorry... We need some info from you first");
    }
});

// bot.on('conversationUpdate', function(message) {
// 	if(message.membersAdded) {
// 		message.membersAdded.forEach(function(identity) {
// 			if(identity.id === message.address.bot.id) {
// 				bot.beginDialog(message.address, 'user:login', {
// 					"message": "Welcome to Content Holmes"
// 				});
// 			}
// 		});
// 	}
// });

socket.on('servermsg', function(data) {
    data = JSON.parse(data);
    var address = JSON.parse(data.address);
    var notification = data.notification;
    var msg = new builder.Message()
        .address(address)
        .text(notification);
    bot.send(msg, function(err) {});
});

// function updateAddress(session) {
//         if(session.userData.address!=JSON.stringify(session.message.address)) {
//             session.userData.address = JSON.stringify(session.message.address);
//             request('https://www.contentholmes.com/sendID/?email='+session.userData.email+'&password='+session.userData.password+'&id='+JSON.stringify(session.message.address), function(error, response, body) {});
//         }
// }

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//  return re.test(email);
  return true;
}

var connectorListener=connector.listen();
function listen() {
    return function (req, res) {
        var url = req.protocol + '://' + req.get('host');
        siteUrl=url;
        connectorListener(req, res);
    };
}
    
module.exports = { default: listen }