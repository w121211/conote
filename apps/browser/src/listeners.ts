export async function openSiteByCurrentTabUrl(tab: chrome.tabs.Tab) {
  if (tab.url) {
    const params = new URLSearchParams({
      s: `[[${tab.url}]]`,
      ext: '1',
    })
    // const tabUrl = encodeURIComponent(tab.url ?? '')

    const window = await chrome.windows.create({
      url: `${process.env.APP_BASE_URL}/draft?${params.toString()}`,
      width: 500,
      height: 900,
      left: 100,
    })
  } else {
    console.debug('tab.url is undefined')
  }
}
