export function save_data_in_chrome(_obj) {
  // stores data in chrome.storage
  chrome.storage.local.set(_obj);
}

export function get_data_from_chrome(_key) {
  // retrieve data from chrome.storage
  return chrome.storage.local.get(_key);
}

export async function chrome_data_exist(_key) {
  let data = await get_data_from_chrome(_key);
  let keys = Object.keys(data);
  return keys.length > 0 ? true : false;
}