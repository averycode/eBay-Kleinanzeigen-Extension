console.log("highlight running");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.on == true) {
        console.log("Ext is on");
    } else {
        console.log("Ext is off");
    }

    sendResponse("200");
});