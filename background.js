// @ts-nocheck
if (matchMedia('(prefers-color-scheme: dark)').matches) {
    chrome.browserAction.setIcon({ path: 'icons/logo – dark@2x.png' })
}

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.windows.create({ url: tab.url, incognito: true })
})