// This callback function is called when the content script has been
// injected and returned its results
function onPageInfo(o)  {
    document.getElementById('url').value = o.url;
    document.getElementById('summary').innerText = o.summary;
}

// This function checks for existing USER prefs in the chrome.storage.sync.get API
// and sets the value of the 'user-names' DIV if saved data is found
function getUserName() {
    console.log("Fetching stored USER from chrome.storage.sync ...");
    var val = {};
	chrome.storage.sync.get({'whichUserName': []}, function(val) {
	console.log("Got User from sync-store: " + val.whichUserName);
	document.getElementById('user-names').value = val.whichUserName;
	});
	
}

// This function checks for existing user DEPT prefs in the chrome.storage.sync.get API
// and sets the value of the 'user-names' DIV if saved data is found
function getUserDepartment() {
    console.log("Fetching stored DEPT from chrome.storage.sync ...");
    chrome.storage.sync.get({'whichDeptName': []}, function(val) {
    console.log("Got user DEPT from sync-store: " + val.whichDeptName);
    document.getElementById('depts').value = val.whichDeptName;
    });
}

// POST the data to the server using XMLHttpRequest
function addBookmark() {
      console.log("Begin adding task...");
      document.getElementById('save').value = "Saving entry...";
    
    // Cancel the form submit
      event.preventDefault();

    // The URL to POST our data to
    var postUrl = 'https://script.google.com/macros/s/AKfycbyL_Z9rukdwb0VaFOYVRwYjDegbJXpa9G41SndqTE2Ohqa5LXY/exec';
      
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
    
    var params =      //'Timestamp=' + Timestamp +
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
                // If it was a success, close the popup after a short delay (i.e. 1000ms = 1 second)
                document.getElementById('save').value = "Saved entry!";
                console.log("Succesfully SAVED task.");
                window.setTimeout(window.close, 1000);
            } else {
                // Show what went wrong
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

// When the popup HTML has loaded, add an event listener for the addBookmark function
window.addEventListener('load', function(evt) {
    // Handle the bookmark form submit event with our addBookmark function
    document.getElementById('addbookmark-task').addEventListener('submit', addBookmark);

    // Call the getPageInfo function in the background page, injecting content_script.js
    // into the current HTML page and passing in our onPageInfo function as the callback
    chrome.extension.getBackgroundPage().getPageInfo(onPageInfo);
    getUserName();
    getUserDepartment();
      
});