import { CSS } from './YoutubeCSS';
import { CODE } from './RefCode';
import { waitForYouTubeToLoad, delay, debug } from '../static/Util.js';

let isAdPlaying = false;
let chapterCounter = 0;

export function initialize() {
  let path: string = window.location.pathname;
  path = path.replace('http://', '').replace('https://', '').replace('www.','').replace('youtube.com','');
  path = path.substring(1);
  
  if (path === "") {
    return "homepage";
  } else if (path.substring(0, 18) === "feed/subscriptions") {
    return "subscriptions";
  } else if (path.substring(0, 12) === "feed/explore") {
    return "explore";
  } else if (path.substring(0, 5) === "watch") {
    return "video";
  } else if (path.substring(0, 6) === "shorts") {
    return "shorts";
  } else if (path.substring(0, 2) === "c/" && path.substring(path.length - 6, path.length + 1) === "videos") {
    return "channel_videos";
  }

  return path;
}

async function lookForPremiumMembership() {
  let youtubeHead = await waitForYouTubeToLoad(CSS.youtubeHead, false, 9);
  if (! youtubeHead) return false;

  return youtubeHead.getAttribute("logo-type") === CSS.youtubePremium;
}

export async function displayChapters() {
  // user is watching a video
  debug("Watching a video");
  let videoPlayer = await waitForYouTubeToLoad(CSS.videoPlayer, false, 8);
  if (! videoPlayer) return;
  
  // look for premium membership
  let youtubePremiumExist = await lookForPremiumMembership();
  if (! youtubePremiumExist) {
    // normal youtube is playing 
    // check for youtube ads
    let videoAds = await waitForYouTubeToLoad(CSS.ads, false, 8);
    if (videoAds) {
      debug("Ad is playing");
      
      isAdPlaying = true;
      await playingAds();
    }
  }

  // look for chapters
  debug("Looking for video chapters");
  let videoChapter = await waitForYouTubeToLoad(CSS.chapters, false, 8);
  if (videoChapter) {
    lookForChapters();
  } else {
    debug("Couldn't find video chapters");
  }
}

async function playingAds() {
  if (! isAdPlaying) return;
  
  await delay(1000);
  let wasAdPlaying = await waitForYouTubeToLoad(CSS.ads);
  if (wasAdPlaying) await playingAds();
  isAdPlaying = false;
}

async function lookForChapters() {
  // automatically open chapters
  let videoChapter = await waitForYouTubeToLoad(CSS.chapters, false, 8);
  if (videoChapter && videoChapter.style.display !== "none") {
    debug("Found video chapters");
    let chapterSidePanel = await waitForYouTubeToLoad(CSS.sidePanel, true, 9); // run it once
    let chaptersElement;
    chapterSidePanel.forEach(cSP => {
      if (cSP.getAttribute("target-id") === CSS.chapterSidePanelTarget) {
        chaptersElement = cSP;
        return;
      }
    });

    if (! chaptersElement) return;
    if (chaptersElement.getAttribute("visibility") === CSS.sidePanelExpanded) {
      await delay(2000)
      if (chaptersElement.getAttribute("visibility") === CSS.sidePanelExpanded) return;
    }

    videoChapter.click();
    chapterCounter = 30;
  }
  
  if (chapterCounter < 30) {
    chapterCounter++;
    await delay(500);
    await lookForChapters();
  }
}

export function injectLinks(domain: string) {
  let referenceCode: string = "tag=";
  switch(domain) {
    case "amazon.co.uk":
      referenceCode += CODE.UK;
      break;
    default:
      referenceCode += CODE.US;
      break;
  }

  let currentLink: string = window.location.href;
  let path: string = window.location.pathname;
  if (path === "/" || path === "/ref=nav_logo") {
    // do nothing we're on the homepage
    return;
  }

  let productLink: string;
  // look for existing ref code
  let refExist = currentLink.split(referenceCode);
  if (refExist.length > 1) return;
  
  let linkArr = currentLink.split("tag=");
  if (linkArr.length > 1) {
    // ref code already exist. now replace it.
    productLink = linkArr[0];
    let lastChar = productLink.charAt(productLink.length - 1);
    let refCodeArr = linkArr[1].split("&");
    if (refCodeArr.length > 1) {
      // ref code is in the middle of the URL
      if (lastChar !== "&") {
        productLink += "&"
      }
      productLink += referenceCode;
      productLink += "&";
      productLink += refCodeArr[1];
    } else {
      // ref code is at the end of the URL
      if (lastChar !== "&") {
        productLink += "&"
      }
      productLink += referenceCode;
    }
  } else {
    // update automatically added ref code
    linkArr = currentLink.split("tag=")
    productLink = linkArr[0];
    let lastChar = productLink.charAt(productLink.length - 1);
    if (lastChar !== "&") {
      productLink += "&"
    }
    productLink += referenceCode;
  }
  
  history.pushState({}, null, productLink);
}