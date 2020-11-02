// @sts-nocheck
if (matchMedia('(prefers-color-scheme: dark)').matches) {
    chrome.storage.sync.set({
        theme: 'dark'
    })
    // chrome.browserAction.setIcon({ path: 'icons/logo – dark@2x.png' })
}
let privateWebsites = [];

function retrieveOptions() {
    chrome.storage.sync.get({ privateWebsites: [''] }, items => {
        privateWebsites = items.privateWebsites
    })
}

chrome.storage.onChanged.addListener((changes, areaName) => {
    retrieveOptions();
})

retrieveOptions();

const isChromeURL = (url) => url.split(':')[0] === "chrome";

function openLinkInIncognito(tab) {
    const { id, url } = tab;

    if (isChromeURL(url)) {
        alert("Chrome URLs can't be opened in about");
        return;
    }

    try {
        chrome.tabs.remove(id, function () { });
        chrome.windows.create({ url: url, incognito: true });
        chrome.history.deleteUrl({ url }, () => {
            console.log(`${url} deleted from history`);
        });
    } catch (e) {
        console.log(e);
    }
}

function getActiveTab() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true }, items => {
            resolve(items[0]);
        })
    })
}

chrome.browserAction.onClicked.addListener(openLinkInIncognito);

chrome.webNavigation.onCommitted.addListener(details => {
    if (details.frameId == 0) {
        if (privateWebsites.includes(new URL(details.url).hostname)) {
            console.log('history added', details);
            openLinkInIncognito({ id: details.tabId, url: details.url });
        }
    }
})
chrome.commands.onCommand.addListener(async command => {
    console.log(`${command} activated`);

    if (command == 'add_private_website') {
        let activeTab = await getActiveTab()
        let activeTabHostname = new URL(activeTab.url).hostname;
        console.log(activeTabHostname)

        let newPrivateWebsites = [...privateWebsites];
        let message = '';
        if (privateWebsites.includes(activeTabHostname)) {
            // if already in the list, remove it.
            newPrivateWebsites = removeFromArray(newPrivateWebsites, activeTabHostname);
            message = `Successfully ${activeTabHostname} removed from Private Websites - Ninja`
        } else {
            // if not already in the list, add it.
            newPrivateWebsites.push(activeTabHostname);
            message = `Successfully ${activeTabHostname} added to Private Websites - Ninja`
        }
        chrome.storage.sync.set({ privateWebsites: newPrivateWebsites }, () => {
            console.log('storage updated', newPrivateWebsites)
        })
    }
})

console.log(removeFromArray);