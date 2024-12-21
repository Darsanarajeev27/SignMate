
document.getElementById("enable").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: enableInterpreter,
    });
  });
});

document.getElementById("disable").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: disableInterpreter,
    });
  });
});

function enableInterpreter() {
  if (!document.getElementById("signMateBox")) {
    const box = document.createElement("div");
    box.id = "signMateBox";
    box.style.position = "fixed";
    box.style.top = "10px";
    box.style.right = "10px";
    box.style.width = "300px";
    box.style.height = "200px";
    box.style.backgroundColor = "white";
    box.style.border = "1px solid black";
    box.style.zIndex = "10000";
    box.innerText = "SignMate Interpreter (Add Animation Here)";
    document.body.appendChild(box);
  }
}

function disableInterpreter() {
  const box = document.getElementById("signMateBox");
  if (box) {
    box.remove();
  }
}
