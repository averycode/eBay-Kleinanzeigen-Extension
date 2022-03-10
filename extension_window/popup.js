console.log("popup running!");

const onoff = document.querySelector("input[name=checkbox");

function isOn() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {on: onoff.checked}, function(response) {
          console.log(response);
        });
    });
}

onoff.addEventListener("click", isOn);