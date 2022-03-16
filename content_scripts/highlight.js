console.log("highlight running");

// CSS
const style = document.createElement("style");
style.innerHTML = `
      :root {
        --green: #00FF00;
        --green-alpha: #00FF0060;
        --green-mouseover: #11DD1160;
        --orange: #FFA500;
        --orange-alpha: #FFA50060;
        --orange-mouseover: #FF800060;
        --red: #FF0000;
        --red-alpha: #FF000060;
        --red-mouseover: #DD111160;
        --purple: #ff00ff;
        --purple-alpha: #ff00ff60;
        --purple-mouseover: #dd00dd60;

        --profileBox-color: var(--purple);
        --profileBox-color-alpha: var(--purple-alpha);
        --profileBox-color-mouseover: var(--purple-mouseover);
      }
      .profileBox {
          border: 3px solid var(--profileBox-color);
          background-color: var(--profileBox-color-alpha);
      }
      .profileBox-mouseover {
          border: 3px solid var(--profileBox-color);
          background-color: var(--profileBox-color-mouseover);
      }

      .zufrieden {
          border: 3px solid var(--green);
          background-color: var(--green-alpha);
      }

      .gefahr {
          border: 3px solid var(--red);
          background-color: var(--red-alpha)
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
            -webkit-animation: fadeIn 0.5s;
            animation: fadeIn 0.5s
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

// receive Message from popup.js
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

// Adding EventListeners
profileBox.addEventListener("mouseover", mouseover_profileBox);
profileBox.addEventListener("mouseout", mouseout_profileBox);

// everything in here what has to do with on and off
function runScript() {
    if (running == true) {
        //// Seller Profile Box on ////
        let profileBox_children =
            document.querySelector("#viewad-contact").firstChild.nextElementSibling
                .firstElementChild.firstElementChild.lastElementChild;

        // Zufriedenheitsgrad 0 - 2 / gar nicht
        let zufriedenheit = document.querySelector(".userbadges-profile-rating");
        if (zufriedenheit != null) {
            zufriedenheit = zufriedenheit.firstElementChild.getAttribute("badge-level");
        }

        //Freundlichkeit 0 - 2 / gar nicht
        let freundlichkeit = document.querySelector(".userbadges-profile-friendliness");
        if (freundlichkeit != null) {
            freundlichkeit = freundlichkeit.firstElementChild.getAttribute("badge-level");
        }

        // Zuverlässigkeit 0 - 2 / gar nicht
        let zuverlässigkeit = document.querySelector(".userbadges-profile-reliability");
        if (zuverlässigkeit != null) {
            zuverlässigkeit = zuverlässigkeit.firstElementChild.getAttribute("badge-level");
        }

        // Aktivitätszeitraum des Verkäufers - gibt die Anzahl der Tage als String an
        let aktivSeit_dom = profileBox_children.lastElementChild.innerText;
        let regex_aktivSeit = /(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})/;
        let aktivSeit = regex_aktivSeit.exec(aktivSeit_dom)[0];
        aktivSeit = aktivitaetsZeitraum(aktivSeit);

        // Sicher bezahlen falls vorhanden
        let sicherZahlen = document.querySelector(".viewad-secure-payment-badge");

        let spanString = `Einschätzung

        `;

        // TODO: Konditionen für ein sicheres und ein gefährliches Angebot definieren und dementsprechend die Farben ändern
        if (aktivSeit > 180 && (zufriedenheit > 0 || sicherZahlen)) {
            profileBox.style.setProperty("--profileBox-color", "var(--green)");
            profileBox.style.setProperty("--profileBox-color-alpha", "var(--green-alpha)");
            profileBox.style.setProperty("--profileBox-color-mouseover", "var(--green-mouseover)");
            spanString =
                spanString +
                `Der Verkäufer ist seit länger als einem halben Jahr aktiv. Das ist ein gutes Zeichen!

                `;
            if (zufriedenheit > 0) {
                spanString =
                    spanString +
                    `Im Durchschnitt waren die Kunden sehr zufrieden mit dem Verkäufer.

                `;
            }
            if (sicherZahlen) {
                spanString =
                    spanString +
                    `Der Verkäufer bietet sicheres Zahlen über eBay Kleinanzeigen an. Im Notfall bekommst du so dein Geld zurück.
                    
                    `;
            }
            spanString = spanString + `Der Verkäufer scheint ungefährlich zu sein.`;
        } else if (aktivSeit > 180) {
            profileBox.style.setProperty("--profileBox-color", "var(--orange)");
            profileBox.style.setProperty("--profileBox-color-alpha", "var(--orange-alpha)");
            profileBox.style.setProperty("--profileBox-color-mouseover", "var(--orange-mouseover)");
            spanString =
                spanString +
                `Der Verkäufer ist seit länger als einem halben Jahr aktiv. Das ist ein gutes Zeichen!
            
            Leider liegen keine Kundenbewertungen vor die analysiert werden können.

            Sicheres Zahlen wurde nicht hinterlegt.

            Der Verkäufer scheint nicht gefährlich zu sein. Jedoch könnte es zu Komplikationen beim Kaufvorgang kommen.
            `;
        } else {
            profileBox.style.setProperty("--profileBox-color", "var(--red)");
            profileBox.style.setProperty("--profileBox-color-alpha", "var(--red-alpha)");
            profileBox.style.setProperty("--profileBox-color-mouseover", "var(--red-mouseover)");
            spanString =
                spanString +
                `Der Verkäufer ist erst seit kurzen auf eBay Kleinanzeigen aktiv und konnte somit bei eventuellen betrügerischen Aktionen noch nicht entdeckt werden.
                
                `;

            if (zufriedenheit || freundlichkeit || zuverlässigkeit) {
                spanString =
                    spanString +
                    `Es liegen zwar Kundenbewertungen vor, diese könnten in der kurzen Zeit aber gefälscht sein.
                
                `;
            } else {
                spanString =
                    spanString +
                    `Kundenbewertungen liegen nicht vor.
                
                `;
            }

            if (sicherZahlen) {
                spanString =
                    spanString +
                    `Sicheres Zahlen wurde hinterlegt.
                
                `;
            } else {
                spanString =
                    spanString +
                    `Sicheres Zahlen wurde nicht hinterlegt
                
                `;
            }

            spanString =
                spanString +
                `Es muss sich nicht zwigend um ein betrügerisches Angebot handeln. Allerdings ist Vorsicht geboten!`;
        }

        profileBox.classList.add("popup");
        profileBox_span.setAttribute("class", "popuptext");
        profileBox_span.innerText = spanString;
        profileBox.classList.add("profileBox");
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

// Check ob die Funtion richtig funtioniert
function Date_EUtoAM(date) {
    let temp = date.split(".");
    return temp[2] + "-" + temp[1] + "-" + temp[0];
}

function aktivitaetsZeitraum(seit) {
    seit = new Date(Date_EUtoAM(seit));
    let today = new Date();
    let timeDiff = today.getTime() - seit.getTime();
    return Math.floor(timeDiff / (1000 * 3600 * 24));
}
