//@ts-nocheck
const $ = (str = '') => document.getElementById(str);

let activeTab;
const getDomainName = (url = '') => {
    let urlExtractorRegEx = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/igm;
    return url.match(urlExtractorRegEx)[0];
}

chrome.tabs.query({
    active: true,
    currentWindow: true
}, tabsArray => {
    activeTab = tabsArray[0];
    updateUI();
});

const div = $('domain-address');

function updateUI() {
    console.log(activeTab);
    div.innerHTML = getDomainName(activeTab.url);;
}