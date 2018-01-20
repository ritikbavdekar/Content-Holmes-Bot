var builder = require('botbuilder');

var lib = new builder.Library('user');

lib.dialog('login', [
	function(session, args) {
		var loginCard = new builder.SigninCard(session)
			.text(args.message)
			.button("Sign In", "https://www.contentholmes.com");

		session.send(new builder.Message(session)
            .addAttachment(loginCard));
		session.endDialog();
	}
]);

lib.dialog('login/failed', [
	function(session) {
		session.beginDialog('login', 
			{
				"message": "Oops. Looks like login failed. You'll need to try again :-("
			}
		);
		session.endDialog();
	}
]);

lib.dialog('login/success', [
	function(session) {

	}
]);

lib.dialog('info/childName', [
	function(session, args) {
		var childName;
		if(session.userData.childArray.length == 1) {
			childName = session.userData.childArray[0];
		} else if(args.entities) {
			childName = builder.EntityRecognizer.findEntity(args.entities.entities, 'user::childName');
			if(childName) childName = childName.entity;
		}
		if(!childName||session.userData.childArray.indexOf(childName)==-1) {
            builder.Prompts.choice(session, args.message, session.userData.childArray);
		} else {
			session.endDialogWithResult({"childName":childName});
		}
	},
	function(session, result) {
		endDialogWithResult({"childName":result.response.entity});
	}
]);


module.exports.createLibrary = function() {
	return lib.clone();
}
