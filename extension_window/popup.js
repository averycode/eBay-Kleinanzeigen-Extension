console.log("popup running!");

const onoff = document.querySelector("input[name=checkbox");
onoff.checked = true;

function isOn() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { on: onoff.checked }, function (response) {
            console.log(response);
        });
    });
}

isOn();
onoff.addEventListener("click", isOn);
