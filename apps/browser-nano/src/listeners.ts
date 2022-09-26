export async function openSiteByCurrentTabUrl(tab: chrome.tabs.Tab) {
  if (tab.url) {
    const params = new URLSearchParams({
      s: `[[${tab.url}]]`,
      from: 'extension',
    })

    await chrome.windows.create({
      url: `${process.env.APP_BASE_URL}/draft?${params.toString()}`,
      width: 550,
      height: 650,
      left: 100,
    })
  } else {
    console.debug('tab.url is undefined')
  }
}
