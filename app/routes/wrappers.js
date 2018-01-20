module.exports = {


	blockURL      :   blockURL,  
    unblockURL    :   unblockURL, 
    session       :   session,
    unsession     :   unsession,
    newUser       :   newUser,
    fetchSession  :   fetchSession,
    fetchURL      :   fetchURL,
    fetchInterests:   fetchInterests,
    report        :   report 

  };  

function blockURL(res,email,password,childName,URL,duration){}

function unblockURL(res,email,password,childName,URL){}

function session(res,email,password,childName,duration){}

function unsession(res,email,password,childName){}

function newUser(res,email,childName,password,token){}

function fetchSession(res,email,password,childName){}

function fetchURL(res,email,password,childName){}

function fetchInterests(res,email,password,childName){}

function report(res,token,time,value,email,password,childName){}