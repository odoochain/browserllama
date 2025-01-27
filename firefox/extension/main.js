let message;

// inject content script
chrome.runtime.sendMessage({action: "inject"}, function(response) {
  if (chrome.runtime.lastError) {
      console.error("Error connecting:", chrome.runtime.lastError);
  } else {
      console.log("injecting:", response);
  }
});

function disableButtonsForDuration(durationInSeconds) {
  const summariseBtn = document.getElementById("summarise");
  const chatBtn = document.getElementById("chat_button");

  summariseBtn.disabled = true;
  chatBtn.disabled = true;

  setTimeout(() => {
    summariseBtn.disabled = false;
    chatBtn.disabled = false;
  }, durationInSeconds * 1000);
}


function showStatus(message, duration = 3000) {
  const popup = document.getElementById('status-popup');
  const statusMessage = document.getElementById('status-message');

  // disableButtonsForDuration(5)
  
  statusMessage.textContent = message;
  popup.classList.remove('hidden');
  
  setTimeout(() => {
    popup.classList.add('hidden');
  }, duration);
}

function changePage(url) {
  if (url) {
      window.location.href = url;
  } else {
      console.error("Invalid URL provided."); 
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // Check if we should run the connect logic
  if (localStorage.getItem('runConnectLogic') === 'true') {
    bgcon(1);
    // Reset the flag
    localStorage.removeItem('runConnectLogic');
  }

  document
    .getElementById('summarise')
    .addEventListener('click', function() {
      bgcon(3);
    });  
});

//change page on button click
document.addEventListener('DOMContentLoaded', () => {
  const summariseButton = document.getElementById('summarise');
  if (summariseButton) {
    summariseButton.addEventListener('click', () => {
      window.location.href = 'summary.html';
    });
  }

  const chatButton = document.getElementById('chat_button');
  if (chatButton) {
    chatButton.addEventListener('click', () => {
      window.location.href = 'chat.html';
    });
  }
});


//communicate with background script using named connection
//some useless code, remove later
function bgcon(task){
  const portbg = chrome.runtime.connect({ name: "popup<->background" });
  if(task==1){
    showStatus("Connecting...", 5000);
    portbg.postMessage(1);
  }else if(task==2){
    //send value of input box to background.js
    message = { text: document.getElementById('input-text').value };
    portbg.postMessage(message);
  }else if(task ==3){
    //this is for summarise webpage
    portbg.postMessage(2);
  }else{
    portbg.postMessage("invalid task number");
  }

  portbg.onMessage.addListener((smsg) => {
    console.log("Received message from service worker:", smsg);
    if(smsg == "error" || smsg == "connection_failed" || smsg == "failed_to_send_message_to_backend"){
      window.location.href = 'error.html';
    }else if(smsg == "ping_success"){
        showStatus("Connected", 1000);
    }else if(smsg == "ping_failed"){
        showStatus("retrying connection", 5000);
    }else if(smsg == "host incompatible"){
      changePage('compatibility-issue.html')
    }else{
      console.log("main.js received invalid message")
      showStatus("something went wrong", 4000);
    }
  });
}


