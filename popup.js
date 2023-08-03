
import { getActiveTabURL } from "./utils.js";
// adding a new bookmark row to the popup
const addNewBookmark = (bookmarks, bookmark) => {
  const bookmarkTitleElement = document.createElement("div");
  const controlsElement = document.createElement("div");
  const newBookmarkElement = document.createElement("div");
  // on maifest.json
  bookmarkTitleElement.textContent = bookmark.desc;
  bookmarkTitleElement.className = "bookmark-title";
  controlsElement.className = "bookmark-controls";

  setBookmarkAttributes("play", onPlay, controlsElement);
  setBookmarkAttributes("delete", onDelete, controlsElement);

  newBookmarkElement.id = "bookmark-" + bookmark.time;
  newBookmarkElement.className = "bookmark";
  // help in playing the video
  newBookmarkElement.setAttribute("timestamp", bookmark.time);
  // add it to the box
  newBookmarkElement.appendChild(bookmarkTitleElement);
  newBookmarkElement.appendChild(controlsElement);
  bookmarks.appendChild(newBookmarkElement);
};
// pass it all the current bookmarks
const viewBookmarks = (currentBookmarks=[]) => {
  const bookmarksElement = document.getElementById("bookmarks");
  bookmarksElement.innerHTML = "";
  // if it is not an empty array
  if (currentBookmarks.length > 0) {
    // call this function whenever a bookmark is added
    for (let i = 0; i < currentBookmarks.length; i++) {
      const bookmark = currentBookmarks[i];
      addNewBookmark(bookmarksElement, bookmark);
    }
  } else {
    bookmarksElement.innerHTML = '<i class="row">Sorry, No bookmarks to show. But you can add one using the new control button in the video :)</i>';
  }

  return;
};
// so that the video gets played from wherever it was timestamped
const onPlay = async e => {
  const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
  const activeTab = await getActiveTabURL();

  chrome.tabs.sendMessage(activeTab.id, {
    type: "PLAY",
    value: bookmarkTime,
  });
};
// remove functionality
const onDelete = async e => {
  const activeTab = await getActiveTabURL();
  const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
  const bookmarkElementToDelete = document.getElementById(
    "bookmark-" + bookmarkTime
  );
// this will give us the element to delete line 56/57
  bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete);
// function to del
  chrome.tabs.sendMessage(activeTab.id, {
    type: "DELETE",
    value: bookmarkTime,
  }, viewBookmarks);
};

const setBookmarkAttributes =  (src, eventListener, controlParentElement) => {
  const controlElement = document.createElement("img");

  controlElement.src = "assets/" + src + ".png";
  controlElement.title = src;
  controlElement.addEventListener("click", eventListener);
  // container to have all the passing function
  controlParentElement.appendChild(controlElement);
};
// this triggers when html file has been inititially loaded
// grab active tab
document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getActiveTabURL();
  // it has unique identifier after every ?
  const queryParameters = activeTab.url.split("?")[1];
  const urlParameters = new URLSearchParams(queryParameters);

  const currentVideo = urlParameters.get("v");

  if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
    // currentvideo is the key
    chrome.storage.sync.get([currentVideo], (data) => {
      // to fetch all the bookmarks
      const currentVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]) : [];
      // help us to view
      viewBookmarks(currentVideoBookmarks);
    });
  } else {
    // when we are not on youtube
    // from css in the boiler plate
    const container = document.getElementsByClassName("container")[0];
    
    container.innerHTML = '<div class="title">Not a youtube video page.</div>';
  }
});

