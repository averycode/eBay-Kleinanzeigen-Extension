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

      /* Popup container */
        .popup {
        position: relative;
        display: inline-block;
        cursor: pointer;
        }

        /* The actual popup (appears on top) */
        .popup .popuptext {
        visibility: hidden;
        width: 160px;
        background-color: #555;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 8px 0;
        position: absolute;
        z-index: 1;
        bottom: 125%;
        left: 50%;
        margin-left: -80px;
        }

        /* Popup arrow */
        .popup .popuptext::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #555 transparent transparent transparent;
        }

        /* Toggle this class when clicking on the popup container (hide and show the popup) */
        .popup .show {
        visibility: visible;
        -webkit-animation: fadeIn 1s;
        animation: fadeIn 1s
        }

        /* Add animation (fade in the popup) */
        @-webkit-keyframes fadeIn {
        from {opacity: 0;}
        to {opacity: 1;}
        }

        @keyframes fadeIn {
        from {opacity: 0;}
        to {opacity:1 ;}
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
let profileBox_span = document.createElement("span");

//Adding EventListeners
profileBox.addEventListener("mouseover", mouseover_profileBox);
profileBox.addEventListener("mouseout", mouseout_profileBox);

// everything in here what has to do with on and off
function runScript() {
    if (running == true) {
        // Seller Profile Box on
        profileBox.classList.add("profileBox");
        profileBox.classList.add("popup");
        profileBox_span.setAttribute("class", "popuptext");
        profileBox_span.innerText = `
            Seller Information:
            - Top or Flop
            - Freundlich 
            - Einschätzung
            - Gefährlichkeitsgrad
            - Warum?
            _________________
            Conclusion
        `;
        profileBox.appendChild(profileBox_span);

        //
    } else {
        // Seller Profile Box off
        profileBox.classList.remove("profileBox");
        profileBox.classList.remove("popup");
        profileBox.removeChild(profileBox_span);

        //
    }
}

function mouseover_profileBox() {
    if (running) {
        profileBox.classList.add("profileBox-mouseover");
        profileBox_span.classList.add("show");
    }
}

function mouseout_profileBox() {
    if (running) {
        profileBox.classList.remove("profileBox-mouseover");
        profileBox_span.classList.remove("show");
    }
}
