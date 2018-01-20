var builder = require('botbuilder');

var lib = new builder.Library('productivity');

import * as wrapperfunc from '../../app/routes/wrappers.js';

lib.dialog('info/website', [
	function(session, args) {
		var website;
		if(args.entities) {
			website = builder.EntityRecognizer.findEntity(args.entities.entities, 'productivity::website'); 
			if(website) website = website.entity;
		}
		if(!website) {
            builder.Prompts.text(session, args.message);
		} else {
			session.endDialogWithResult({"website":website});
		}
	},
	function(session, result) {
		session.endDialogWithResult({"website":result.response});
	}
]);

lib.dialog('info/duration', [
	function(session, args) {
		var duration;
		if(args.entities) {
			duration = builder.EntityRecognizer.findEntity(args.entities.entities, 'builtin.datetimeV2.duration');
			if(duration) duration = duration.resolution;
		}
		if(!duration && args.default==null) {
			builder.Prompts.number(session, args.message + " (in hours)");
		} else if (!duration && args.default!=null) {
			session.endDialogWithResult({"duration": args.default})
		} else {
			session.endDialogWithResult({"duration": duration.values[0].value});
		}
	},
	function(session, result) {
		session.endDialogWithDialog({"duration": result.response*3600});
	}
]);

lib.dialog('actions/block', [
    function(session, args, next) {
        session.dialogData.args = args;
        console.log(args);
        session.beginDialog('user:info/childName', 
        	{
        		"message": "Block for whom?", 
        		"entities": session.dialogData.args
        	}
        );
    },
    function (session, results, next) {
        session.dialogData.name = results.childName;
        session.beginDialog('productivity:info/website', 
        	{
        		"message": "Can you tell me the website you want to block? I understand names (Eg- Facebook) and categories (Eg- Gaming Websites) as well :-).", 
        		"entities": session.dialogData.args
        	}
        );
    },
    function (session, results, next) {
	    session.dialogData.website = results.website;
        session.beginDialog('productivity:info/duration', 
           {
                "message": "For how much time?",
                "entities": session.dialogData.args,
                "default": 24*3600
           }
        );
    },
    function (session, results) {
        session.dialogData.duration = results.duration;
        session.send("TO BE: Blocked %s for %s for %s seconds", session.dialogData.website, session.dialogData.name, session.dialogData.duration);
        wrapperfunc.blockURL(session.userData.res,session.userData.email,session.userData.password,session.dialogData.name,session.dialogData.website,session.dialogData.duration);
        session.endDialog();
        //Communication goes here!
        //session.send('https://www.contentholmes.com/blockURL/?email='+session.userData.email+'&password='+session.userData.password+'&childName='+session.dialogData.name+'&url='+session.dialogData.website);
        // request('https://www.contentholmes.com/blockURL/?email='+session.userData.email+'&password='+session.userData.password+'&childName='+session.dialogData.name+'&url='+session.dialogData.website+'&duration='+expirytime, function (error, response, body) {
        //     if(!error) {
        //         session.sendTyping();
        //         var res = JSON.parse(body);
        //         if(res.text.success==true) {
        //             session.send("Blocked %s for %s for %s hours", session.dialogData.website, session.dialogData.name, session.dialogData.time);
        //             session.endDialog();
        //         } else {
        //             session.send("Oops. This is way ahead of my thinking curve. I seem to have lost my charm.");
        //             session.endDialog();
        //         }
        //     } else {
        //         session.send("Something went wrong. Please \"Change your personal info\"");
        //         session.endDialog();
        //     }
        // });
    }
]);

lib.dialog('actions/session',[
    function(session, args, next) {
        session.dialogData.args = args;
        session.beginDialog('user:info/childName', 
            {
                "message": "Who do you need sessioning for?", 
                "entities": session.dialogData.args
            }
        );
    },
    function (session, results, next) {
        session.dialogData.name = results.childName;
        session.beginDialog('productivity:info/duration',
        	{
        		"message": "How many hours do you need sessioning for?",
        		"entities": session.dialogData.args,
        		"default": 3600*24
        	}
        ); 
    },
    function (session, results, next) {
        session.dialogData.time = results.duration;
        session.send("TO BE: Now %s will be able to access internet only for %s seconds.", session.dialogData.name, JSON.stringify(session.dialogData.time));
        wrapperfunc.session(session.userData.res,session.userData.email,session.userData.password,session.dialogData.name,session.dialogData.time);
        session.endDialog();
        //Communication goes here!
        // request('https://www.contentholmes.com/session/?email='+session.userData.email+'&password='+session.userData.password+'&childName='+session.dialogData.name+'&url='+session.dialogData.website+'&duration='+session.dialogData.time, function(error, response, body) {
        //     if(!error) {
        //         session.sendTyping();
        //         var res = JSON.parse(body);
        //         if(res.text.success==true) {
        //             session.send("Session timings now effective for %s.", session.dialogData.name);
        //             session.endDialog();
        //         } else {
        //             session.send("Oops. Watson... This doesn't seem good.");
        //             session.endDialog();
        //         }
        //     } else {
        //         session.send("Hmm... There seems to be some error. Sorry, I guess this functionality is not available for now.");
        //         session.endDialog();
        //     }
        // });
    }
]);

lib.dialog('actions/unblock', [
    function(session, args, next) {
        session.dialogData.args = args;
        session.beginDialog('user:info/childName', 
            {
                "message": "So you want to unblock.. Cool! For whom??", 
                "entities": session.dialogData.args
            }
        );
    },
    function (session, results, next) {
        session.dialogData.name = results.childName;
     	session.beginDialog('productivity:info/website', 
            {
                "message": "Can you tell me the website you want to unblock", 
                "entities": session.dialogData.args
            }
    	);
 	},
    function (session, results, next) {
        session.dialogData.website = results.website;
        session.send("TO BE: Unblocked %s for %s :-)", session.dialogData.website, session.dialogData.name);
        wrapperfunc.unblockURL(session.userData.res,session.userData.email,session.userData.password,session.dialogData.name,session.dialogData.website);
        session.endDialog();
        
        //Communication goes here!
        // request('https://www.contentholmes.com/unblockURL/?email='+session.userData.email+'&password='+session.userData.password+'&childName='+session.dialogData.name+'&url='+session.dialogData.website, function (error, response, body) {
        //     if(!error) {
        //         session.sendTyping();
        //         var res = JSON.parse(body);
        //         if(res.text.success==true) {
        //             session.send("Unblocked %s for %s :-)", session.dialogData.website, session.dialogData.name);
        //             session.endDialog();
        //         } else {
        //             session.send(res.text.reason);
        //             session.endDialog();
        //         }
        //     } else {
        //         session.sendTyping();
        //         session.send("Okay... I guess your data is wrong. Try \"Changing your info\".");
        //         session.endDialog();
        //     }
        // });
        // session.send(session.dialogData.name);
        // session.send(session.dialogData.website);
    }
]);

lib.dialog('actions/unsession',[
    function(session, args, next) {
        session.dialogData.args = args;
        session.beginDialog('user:info/childName', 
            {
                "message": "Who is the lucky guy getting unsessioned :O? Can you give me his name?", 
                "entities": session.dialogData.args
            }
        );
    },
    function (session, results, next) {
    	session.dialogData.name = results.childName;
    	session.send("TO BE: Removed sessioning for %s :-)", session.dialogData.name);
        wrapperfunc.unsession(session.userData.res,session.userData.email,session.userData.password,session.dialogData.name);
    	session.endDialog();
        
        //Communication goes here!

        // request('https://www.contentholmes.com/unsession/?email='+session.userData.email+'&password='+session.userData.password+'&childName='+session.dialogData.name+'&url='+session.dialogData.website, function (error, response, body) {
        //     if(!error) {
        //         session.sendTyping();
        //         var res = JSON.parse(body);
        //         if(res.text.success==true) {
        //             session.send("Removed sessioning for %s :-)", session.dialogData.name);
        //             session.endDialog();
        //         } else {
        //             session.send(res.text.reason);
        //             session.endDialog();
        //         }
        //     } else {
        //         session.sendTyping();
        //         session.send("Okay... I guess your data is wrong. Try \"Changing your info\".");
        //         session.endDialog();
        //     }
        // });
        // session.send(session.dialogData.name);
        // session.send(session.dialogData.website);
    }
]);


module.exports.createLibrary = function() {
	return lib.clone();
}
