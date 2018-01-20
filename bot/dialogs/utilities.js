var builder = require('botbuilder');

var lib = new builder.Library('utilities');

lib.dialog('help', [
    function(session) {
        session.sendTyping();
        session.send("Here are some things that you can ask me about!");
        builder.Prompts.text(session, createHelpCarousal(session));
        session.endDialog();
    } 
]);

function createHelpCarousal(session) {
    var carousal = [];
    carousal.push(new builder.HeroCard(session)
        .title("Block a website")
        .buttons([
            builder.CardAction.dialogAction(session, "block", "","Block")
        ])
    );

    carousal.push(new builder.HeroCard(session)
        .title("Unblock a website")
        .buttons([
            builder.CardAction.dialogAction(session, "unblock", "","Unblock")
        ])
    );

    carousal.push(new builder.HeroCard(session)
        .title("Put up an internet session")
        .buttons([
            builder.CardAction.dialogAction(session, "session", "","Session")
        ])
    );

    carousal.push(new builder.HeroCard(session)
        .title("Remove an internet session")
        .buttons([
            builder.CardAction.dialogAction(session, "unsession", "","Unsession")
        ])
    );
    
    var msg = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(carousal);
    return msg;
}

module.exports.createLibrary = function() {
	return lib.clone();
}