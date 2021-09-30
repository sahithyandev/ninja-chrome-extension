chrome.storage.sync.get({ theme: 'light' }, items => {
    document.documentElement.setAttribute('theme', items.theme);
})

function saveOptions(data, message = 'Successfully wrote to storage') {
    // save options to the storage
    chrome.storage.sync.set(data, () => {
        console.log(message);
    })
}
let privateWebsites = [];
function retrieveOptions() {
    chrome.storage.sync.get({ privateWebsites: [] }, items => {
        privateWebsites = items.privateWebsites
        updateUI();
    })
}
retrieveOptions();

chrome.storage.onChanged.addListener((changes, areaName) => {
  retrieveOptions();
});

function updatePrivateWebsites() {
    const PrivateWebsiteItem = document.getElementById('private-website-item-template').content.querySelector('div');
    let itemElementList = privateWebsites.map(website => {
        let itemElement = document.importNode(PrivateWebsiteItem, true);
        itemElement.querySelector('.item-name').innerHTML = website;
        itemElement.querySelector('.delete-icon-container').onclick = function () {
            console.log(website);
            saveOptions({ privateWebsites: removeFromArray(privateWebsites, website)})
        }
        return itemElement;
    })
    console.log(itemElementList);
    let privateWebsitesContainer = document.getElementById('private-websites-container');
    privateWebsitesContainer.innerHTML = '';
    if (itemElementList.length != 0) {
        privateWebsitesContainer.append(...itemElementList);
    }
}

function updateUI() {
    console.log(privateWebsites)
    updatePrivateWebsites();
}
document.getElementById("add-private-website-button").onclick = function () {
    let newWebsite = prompt("Enter the website's url (Ex. google.com) : ");
    if (newWebsite) {
        saveOptions({ privateWebsites: [...privateWebsites, newWebsite] })
    }
}