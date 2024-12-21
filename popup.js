console.log("hi");
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("enable").addEventListener("click", async () => {
    console.log("button clicked");

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log("Active tab queried:", tabs);

      if (tabs.length === 0) {
        console.error("No active tab found.");
        return;
      }

      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          console.log("Inside injected function.");
          alert("Script Executed"); // Confirm the script is executed in the tab
        }
      });
    });
  });
});


document.getElementById("disable").addEventListener("click", () => {
  // Send message to content.js to disable the interpreter
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: disableInterpreter
      });
  });
});
