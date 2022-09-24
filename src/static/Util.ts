function checkQuerySelector(selector) {
  return document.querySelector(selector);
}

function checkQuerySelectorAll(selector) {
  return document.querySelectorAll(selector);
}

export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function debug(log) {
  console.debug(`[AutoLoadYTChapters debug] - ${log}`);
}

export function compareArrays(a1, a2) {
  return a2.filter(x => !a1.includes(x));
}

export async function waitForYouTubeToLoad(selector, isSelectorAll = false, counter = 0) {
  let element;
  if (isSelectorAll) {
    while(counter < 10) {
      element = checkQuerySelectorAll(selector);
      if (element && element.length > 0) {
        counter = 0;
        break;
      }

      await delay(1000);
      counter++;
    }
    return element;
  } else {
    while(counter < 10) {
      element = checkQuerySelector(selector);
      if (element) {
        counter = 0;
        break;
      }

      await delay(1000);
      counter++;
    }
    return element;
  }
}