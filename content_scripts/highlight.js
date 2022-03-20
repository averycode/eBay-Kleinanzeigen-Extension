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
        --purple: #ffddff;
        --purple-alpha: #ffddff60;
        --purple-mouseover: #ddeedd60;

        --profileBox-color: var(--purple);
        --profileBox-color-alpha: var(--purple-alpha);
        --profileBox-color-mouseover: var(--purple-mouseover);

        --productInfo-color: var(--purple);
        --productInfo-color-alpha: var(--purple-alpha);
        --productInfo-color-mouseover: var(--purple-mouseover);
      }
      .profileBox {
          border: 3px solid var(--profileBox-color);
          background-color: var(--profileBox-color-alpha);
      }
      .profileBox-mouseover {
          border: 3px solid var(--profileBox-color);
          background-color: var(--profileBox-color-mouseover);
      }

      .productInfo {
          border: 3px solid var(--productInfo-color);
          background-color: var(--productInfo-color-alpha);
      }

      .productInfo-mouseover {
        border: 3px solid var(--productInfo-color);
        background-color: var(--productInfo-color-mouseover);
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

let productInfo = document.querySelector("#viewad-main-info");
let productInfo_span = document.createElement("span");
let productTitle = document
    .querySelector("#viewad-title")
    .innerText.replaceAll(" ", "-")
    .toLowerCase();
let productPrice = document.querySelector("#viewad-price").innerText;

// Adding EventListeners
profileBox.addEventListener("mouseover", mouseover_profileBox);
profileBox.addEventListener("mouseout", mouseout_profileBox);

productInfo.addEventListener("mouseover", mouseover_productInfo);
productInfo.addEventListener("mouseout", mouseout_productInfo);

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

        let spanString = ``;

        // Konditionen für ein sicheres und ein gefährliches Angebot definieren und dementsprechend die Farben ändern
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
                `Es muss sich nicht zwigend um ein betrügerisches Konto handeln. Allerdings ist Vorsicht geboten!`;
        }

        profileBox.classList.add("popup");
        profileBox_span.setAttribute("class", "popuptext");
        profileBox_span.innerText = spanString;
        profileBox.classList.add("profileBox");
        profileBox.appendChild(profileBox_span);

        //// Produkt Info Box on ////

        // Preisvergleich + Versand / Abholung
        ebay_fetch(productTitle);

        productInfo.classList.add("popup");
        productInfo_span.setAttribute("class", "popuptext");

        productInfo.classList.add("productInfo");
        productInfo.appendChild(productInfo_span);
    } else {
        //// Seller Profile Box off ////
        profileBox.classList.remove("profileBox");
        profileBox.classList.remove("popup");
        profileBox.removeChild(profileBox_span);

        //// Produkt Info Box off ////
        productInfo.classList.remove("productInfo");
        productInfo.classList.remove("popup");
        productInfo.removeChild(productInfo_span);
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

function mouseover_productInfo() {
    if (running) {
        productInfo.classList.add("productInfo-mouseover");
        productInfo_span.classList.add("show");
    }
}

function mouseout_productInfo() {
    if (running) {
        productInfo.classList.remove("productInfo-mouseover");
        productInfo_span.classList.remove("show");
    }
}

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

// Sidenote: runScript auf async setzen und ebay_fetch auf await.
async function ebay_fetch(productTitle) {
    await fetch("https://www.ebay-kleinanzeigen.de/s-" + productTitle + "/k0")
        .then(function (response) {
            return response.text();
        })
        .then(function (html) {
            let productPrice = document.querySelector("#viewad-price").innerText.trim();
            if (productPrice.includes(".")) {
                productPrice = productPrice.replace(".", "");
            }
            let regex_productPrice = /\d+/;
            productPrice = parseInt(regex_productPrice.exec(productPrice)[0]);

            // Preisvergleich
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, "text/html").body;
            let searchList = doc.querySelector("#srchrslt-adtable");
            let items = searchList.querySelectorAll(
                "li.ad-listitem.lazyload-item:not(.badge-topad)"
            );
            let prices = [];
            for (let item of items) {
                let price = item.querySelector(".aditem-main--middle--price").innerText.trim();
                if (price.includes(".")) {
                    price = price.replace(".", "");
                }
                let regex_price = /\d+/;
                if (regex_price.exec(price) !== null) {
                    price = parseInt(regex_price.exec(price)[0]);
                    prices.push(price);
                }
            }
            let sum = 0;
            for (let p of prices) {
                sum = sum + p;
            }
            let averagePrice = Math.floor(sum / prices.length);
            let abweichung = averagePrice * 0.5;
            let imDurchschnitt;

            let productString =
                `Der Durchschnittspreis für dieses Produkt liegt auf eBay Kleinanzeigen bei ` +
                averagePrice +
                ` €.
                `;
            if (productPrice < averagePrice - abweichung) {
                productString =
                    productString +
                    `
                    Der Preis weicht zu sehr vom Durchschnittspreis ab. Hier ist Vorsicht geboten.`;
                imDurchschnitt = false;
            } else if (productPrice > averagePrice + abweichung) {
                productString =
                    productString +
                    `
                    Der Preis ist deutlich teurer als der Durchschnittspreis. Hier ist Vorsicht geboten.`;
                imDurchschnitt = false;
            } else {
                productString =
                    productString +
                    `
                    Der Preis weicht nicht auffällig von dem Durschnittspreis ab.`;
                imDurchschnitt = true;
            }

            // TODO:
            // Highlights farblich ändern
            // Versand / Abholung
            let versandDetails = document
                .querySelector(".boxedarticle--details--shipping")
                .innerText.trim();

            let versandString = ``;

            if (versandDetails == "") {
                versandString =
                    versandString +
                    `
                    
                    Es sind keine Angaben zum Versand enthalten. Frag den Verkäufer ob eine Abholung möglich ist.
                    Falls eine Abholung nicht in Frage kommt, ist Vorsicht geboten!`;

                productInfo.style.setProperty("--productInfo-color", "var(--orange)");
                productInfo.style.setProperty("--productInfo-color-alpha", "var(--orange-alpha)");
                productInfo.style.setProperty(
                    "--productInfo-color-mouseover",
                    "var(--orange-mouseover)"
                );
            } else if (versandDetails == "Versand möglich") {
                versandString =
                    versandString +
                    `
                    
                    Ein Versand von diesem Produkt ist möglich. 
                    
                    Um betrügerische Aktionen aufzudecken, frage den Verkäufer ob auch eine Abholung in Frage kommen würde.
                    Falls eine Abholung nicht in Frage kommt, ist Vorsicht geboten!`;

                if (imDurchschnitt) {
                    productInfo.style.setProperty("--productInfo-color", "var(--orange)");
                    productInfo.style.setProperty(
                        "--productInfo-color-alpha",
                        "var(--orange-alpha)"
                    );
                    productInfo.style.setProperty(
                        "--productInfo-color-mouseover",
                        "var(--orange-mouseover)"
                    );
                } else {
                    productInfo.style.setProperty("--productInfo-color", "var(--red)");
                    productInfo.style.setProperty("--productInfo-color-alpha", "var(--red-alpha)");
                    productInfo.style.setProperty(
                        "--productInfo-color-mouseover",
                        "var(--red-mouseover)"
                    );
                }
            } else if (versandDetails == "Nur Abholung") {
                versandString =
                    versandString +
                    `
                    
                    Das Produkt ist nur zur Abholung verfügbar. Das mindert die Wahrscheinlichkeit eines Betruges.`;

                if (imDurchschnitt) {
                    productInfo.style.setProperty("--productInfo-color", "var(--green)");
                    productInfo.style.setProperty(
                        "--productInfo-color-alpha",
                        "var(--green-alpha)"
                    );
                    productInfo.style.setProperty(
                        "--productInfo-color-mouseover",
                        "var(--green-mouseover)"
                    );
                } else {
                    productInfo.style.setProperty("--productInfo-color", "var(--orange)");
                    productInfo.style.setProperty(
                        "--productInfo-color-alpha",
                        "var(--orange-alpha)"
                    );
                    productInfo.style.setProperty(
                        "--productInfo-color-mouseover",
                        "var(--orange-mouseover)"
                    );
                }
            } else if (versandDetails.startsWith("+")) {
                let regex_versand = /\d,\d+ €/;
                let versandPrice = regex_versand.exec(versandDetails)[0];
                versandString =
                    versandString +
                    `

                    Ein Versand von diesem Produkt ist möglich und kostet ` +
                    versandPrice +
                    `. 
                    
                    Um betrügerische Aktionen aufzudecken, frage den Verkäufer ob auch eine Abholung in Frage kommen würde.
                    Falls eine Abholung nicht in Frage kommt, ist Vorsicht geboten!`;

                if (imDurchschnitt) {
                    productInfo.style.setProperty("--productInfo-color", "var(--orange)");
                    productInfo.style.setProperty(
                        "--productInfo-color-alpha",
                        "var(--orange-alpha)"
                    );
                    productInfo.style.setProperty(
                        "--productInfo-color-mouseover",
                        "var(--orange-mouseover)"
                    );
                } else {
                    productInfo.style.setProperty("--productInfo-color", "var(--red)");
                    productInfo.style.setProperty("--productInfo-color-alpha", "var(--red-alpha)");
                    productInfo.style.setProperty(
                        "--productInfo-color-mouseover",
                        "var(--red-mouseover)"
                    );
                }
            }

            // Mögliche Versandstufen
            // gar nichts
            // nur Abholung
            // Versand möglich
            // + Versand ab 4,99€

            productInfo_span.innerText = productString + versandString;
        })
        .catch(function (err) {
            console.log("eBay Fetch Error : " + err);
        });
}
