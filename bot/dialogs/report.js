var builder = require('botbuilder');

var lib = new builder.Library('report');

lib.dialog('depressionScores', [
    function (session, args, next) {
        session.dialogData.args = args;
        session.beginDialog('user:info/childName', 
	        {
	      		"message": "Who's status do you need?",
	      		"entities": session.dialogData.args  	
	        }
        );
    },
    function (session, results, next) {
        session.dialogData.childname = results.childName;
        session.send("TO BE: Depression Data");
        session.endDialog();

        //Communication goes here.
        // request('https://www.contentholmes.com/data/?email='+session.userData.email+'&password='+session.userData.password+'&childName='+session.dialogData.childname, function(error, response, body) {
        //     if(!error) {
        //         session.sendTyping();
        //         var res = JSON.parse(body);
        //         if(res.text.success==true) {
        //             session.send("Depression Analysis Report for %s - ", session.dialogData.childname);
        //             res.text.answers.history.depressionScores.forEach(function(item,index) {
        //                 if(item.childName==session.dialogData.childname) {
        //                     item.allScores.forEach(function(item, index) {
        //                         item.time = new Date(item.time);
        //                         session.send(item.time.getDate()+"/"+(item.time.getMonth()+1)+"/"+item.time.getFullYear()+":   "+depressionlookup(item.score));
        //                     })
        //                 }
        //             });
        //         } else {
        //             session.send("I can't fetch that right now. Sorry :-(");
        //         }
        //     } else {
        //         session.send("There has been an error, please try to re-enter your data!");
        //     }
        // });
    }
 ]);

lib.dialog('history', [
    function (session, args, next) {
        session.dialogData.args = args;
        session.beginDialog('user:info/childName', 
	        {
	      		"message": "Who's history do you need?",
	      		"entities": session.dialogData.args  	
	        }
        );
    },
    function (session, results, next) {
        session.dialogData.childName = results.childName;
        session.send("TO BE: Historical Data");
        session.endDialog();
        //Communication goes here.
        // request('https://www.contentholmes.com/data/?email='+session.userData.email+'&password='+session.userData.password+'&childName='+session.dialogData.childName, function(error, response, body) {
        //     if(!error) {
        //         session.sendTyping();
        //         var res = JSON.parse(body);
        //         if(res.text.success==true) {
        //             var sysdate = new Date();
        //             session.send("Blocked sites accessed for %s as on %d/%d/%d - ", session.dialogData.childName, sysdate.getDate(), sysdate.getMonth()+1, sysdate.getFullYear());
        //             res.text.answers.history.URls.forEach(function(item,index) {
        //                 item.time = new Date(item.time);
        //                 if(item.childName==session.dialogData.childName&&item.time.getDate()==sysdate.getDate()) {
        //                     session.send(format(item.time.getHours())+""+format(item.time.getMinutes())+" hours - "+item.url);
        //                 }
        //             });
        //         } else {
        //             session.send("I can't fetch that right now. Sorry :-(");
        //         }
        //     } else {
        //         session.send("There has been an error, please try to re-enter your data!");
        //     }
        // });
    }
]);

lib.dialog('interest', [
    function(session, args, next) {
        session.dialogData.args = args;
        session.beginDialog('user:info/childName', 
	        {
	      		"message": "Who's interests do you need?",
	      		"entities": session.dialogData.args  	
	        }
        );
    },
    function(session, results, next) {
        session.dialogData.name = results.childName;
        session.send("TO BE: Interests data");
        session.endDialog();
        // session.sendTyping();
        // //Get request here
        // request('https://www.contentholmes.com/getinterests/?email='+session.userData.email+'&password='+session.userData.password+'&childName='+session.dialogData.name, function(error, response, body) {
        //     if(!error) {
        //         var res = JSON.parse(body);
        //         console.log(res);
        //         if(res.text.success==true) {
        //             //Do things here
        //             var carousel = [];
        //             console.log(res.text.interests);
        //             session.send("Here are somethings that your child likes. They'll love it when you gift them something related to it! :-)");
        //             // console.log(res.text.interests);
        //             for(var i = 0; i<res.text.interests.length;i++) {
        //                 carousel.push(new builder.HeroCard(session)
        //                                     .title(res.text.interests[i].title)
        //                                     .text("Buy something related to " + res.text.interests[i].title + " :-O")
        //                                     // .buttons([
        //                                     //     builder.CardAction.openURL(session, i.website, "Buy")
        //                                     // ])
        //                                     );
        //             }
        //             var msg = new builder.Message(session)
        //                 .attachmentLayout(builder.AttachmentLayout.carousel)
        //                 .attachments(carousel);
        //             builder.Prompts.text(session, msg);
        //         } else {
        //             session.send("Your info might be wrong. Can you please try logging in again?");
        //         }
        //     } else {
        //         session.send("Something went wrong. Please \"Change your personal info\"");
        //     }
        // });
    }
]);

function format(digit) {
    if(digit/10<1) {
        return "0"+digit;
    }
    return digit;
}

function depressionlookup(score) {
    score = parseInt(score);
    if(score<=-30) {
        return "Depressed ("+score+")";
    } else if (score<=-15) {
        return "Too sad ("+score+")";
    } else if (score<=-9) {
        return "Sad, but nothing to worry :-) ("+score+")";
    } else if (score<=0) {
        return "Normal ("+score+")";
    } else if (score<=6) {
        return "Somewhat happy ("+score+")";
    } else if (score<=15) {
        return "Happy ("+score+")";
    } else {
        return "Doing extremely well ("+score+")";
    }
}

module.exports.createLibrary = function() {
	return lib.clone();
}
