// This callback function is called when the content script has been
// injected and returned its results
function onPageInfo(o)  {
    document.getElementById('url').value = o.url;
    document.getElementById('summary').innerText = o.summary;
}

// Global reference to the status display SPAN
var statusDisplay = null;

// POST the data to the server using XMLHttpRequest
function addBookmark() {
      console.log("Begin adding task...");
      document.getElementById('save').value = "Saving entry...";
    
    // Cancel the form submit
      event.preventDefault();

    // The URL to POST our data to
    var postUrl = 'https://script.google.com/macros/s/AKfycbzczzkcV1Tb575u8ylVVTSaEXimLasOPtRCU80MQTtr7cgnZfU/exec';
      
      // Set up an asynchronous AJAX POST request
      var xhr = new XMLHttpRequest();
      //console.log("XHR prepare: AJAX POST request...");
      xhr.open('POST', postUrl, true);
    
    // Prepare the data to be POSTed
    var userName = encodeURIComponent(document.getElementById('user-names').value);
    var dept = encodeURIComponent(document.getElementById('depts').value);
    var url = encodeURIComponent(document.getElementById('url').value);
    var summary = encodeURIComponent(document.getElementById('summary').value);
    var timeSpent = encodeURIComponent(document.getElementById('time-taken').value);
    
    var params =    //'Timestamp=' + Timestamp +
                    'userName=' + userName +
                    '&dept=' + dept +
                    '&timeSpent=' + timeSpent +
			              '&url=' + url +
                    '&summary=' + summary;
    
    // Replace any instances of the URLEncoded space char with +
    params = params.replace(/%20/g, '+');

    // Set correct header for form data
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    // Handle request state change events
    xhr.onreadystatechange = function() {
        // If the request completed
        if (xhr.readyState == 4) {
            document.getElementById('save').value = "Save entry";
            
            //console.log("XHR_COMPLETED.");
            if (xhr.status == 200) {
                // If it was a success, close the popup after a short delay
                document.getElementById('save').value = "Saved entry!";
                console.log("Succesfully SAVED task.");
                window.setTimeout(window.close, 1000);
            } else {// Show what went wrong
                console.log("ERROR saving task... : " + xhr.statusText);
            }
        }
    };

    // Send the request and set status
    xhr.send(params);
    //console.log("XHR_SEND: " + params);
    document.getElementById('save').value = "Saving entry...";
    console.log("Saving task...")
}

// When the popup HTML has loaded
window.addEventListener('load', function(evt) {
    // Handle the bookmark form submit event with our addBookmark function
    document.getElementById('addbookmark-task').addEventListener('submit', addBookmark);

    // Call the getPageInfo function in the background page, injecting content_script.js
    // into the current HTML page and passing in our onPageInfo function as the callback
    chrome.extension.getBackgroundPage().getPageInfo(onPageInfo);
    
});