console.log("highlight running");

const style = document.createElement("style");
style.innerHTML = `
      .profileBox {
          border: 3px solid yellow;
          background-color: #ff00ff60;
      }
      .profileBox-mouseover {
          border: 6px solid yellow;
          background-color: #ff00ff60;
      }
    `;
document.head.appendChild(style);

let running = true;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.on == true) {
        running = true;
        runScript();
    } else {
        running = false;
        runScript();
    }

    sendResponse("200");
});

// DOM Elements
let profileBox = document.querySelector("#viewad-profile-box");
profileBox.addEventListener("mouseover", mouseover_profileBox);
profileBox.addEventListener("mouseout", mouseout_profileBox);

// everything in here what has to do with on and off
function runScript() {
    if (running == true) {
        profileBox.classList.add("profileBox");
    } else {
        profileBox.classList.remove("profileBox");
    }
}

function mouseover_profileBox() {
    if (running) {
        profileBox.classList.add("profileBox-mouseover");
    }
}

function mouseout_profileBox() {
    if (running) {
        profileBox.classList.remove("profileBox-mouseover");
    }
}
