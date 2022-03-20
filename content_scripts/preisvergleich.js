// console.log("preisvergleich running");

// let doc;

// ebay_fetch(productTitle);

// async function ebay_fetch(productTitle) {
//     fetch("https://www.ebay-kleinanzeigen.de/s-" + productTitle + "/k0")
//         .then(function (response) {
//             return response.text();
//         })
//         .then(function (html) {
//             let parser = new DOMParser();
//             doc = parser.parseFromString(html, "text/html").body;
//             let searchList = doc.querySelector("#srchrslt-adtable");
//             let items = searchList.querySelectorAll(
//                 "li.ad-listitem.lazyload-item:not(.badge-topad)"
//             );
//             let prices = [];
//             for (let item of items) {
//                 let price = item.querySelector(".aditem-main--middle--price").innerText.trim();
//                 let regex_price = /\d+/;
//                 if (regex_price.exec(price) !== null) {
//                     price = parseInt(regex_price.exec(price)[0]);
//                     prices.push(price);
//                 }
//             }
//             let sum = 0;
//             for (let p of prices) {
//                 sum = sum + p;
//             }
//             let averagePrice = Math.floor(sum / prices.length);
//             console.log("preisvergleich.js : " + averagePrice);
//         })
//         .catch(function (err) {
//             console.log(err);
//         });
// }
