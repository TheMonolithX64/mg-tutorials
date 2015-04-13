// Save options to chrome.storage.sync

function save_options() {
      console.log("Started saving...");
	
	var whichUSER = document.getElementById('userNameOptions').value;
	var whichDEPT = document.getElementById('deptOptions').value;
	var val = {};
	chrome.storage.sync.set({
		whichUserName: whichUSER
		}, function(val) {
		      document.getElementById('currentUSER').innerHTML = whichUSER;
		});
	chrome.storage.sync.set({
		whichDeptName: whichDEPT
		}, function(val) {
		      document.getElementById('currentDEPT').innerHTML = whichDEPT;
		});
		
		if (whichUSER !== null){
		      document.getElementById('user_option_set').src = "/assets/user-lock.png";
		      document.getElementById('op-user-img').src = "/assets/circle-ok.png";
		      console.log("Set user IMG to 'user-lock.png'.");
		}
		if (whichDEPT !== null) {
		      document.getElementById('dept_option_set').src = "/assets/settings.png";
		      document.getElementById('op-dept-img').src = "/assets/circle-ok.png";
		      console.log("Set department IMG to 'settings.png'.");
		}
		
		// Update status to let user know options were saved.
		var options_status = document.getElementById('options_status');
		options_status.textContent = 'Options saved.';
		document.getElementById('options_output').style.visibility = "hidden";
		console.log("whichUSER = " + whichUSER);
		console.log("whichDEPT = " + whichDEPT);
		var options_output = document.getElementById('options_output');
		options_output.innerText = "Preferences saved. User set to: " +whichUSER+ ". Component set to: " +whichDEPT+ ".";
		
		console.log("Saved options.");
		setTimeout(function(val) {
			options_status.textContent = '';
			}, 750);
	}
// Restores select box using preferences stored in chrome.storage
	function restore_options() {
		// Use default POC name = me
		chrome.storage.sync.get({
		whichUserName: "Not set",
		whichDeptName: "Not set"
		}, function(items) {
		      console.log("Restoring options...");
			document.getElementById('userNameOptions').value = items.whichUserName;
			document.getElementById('currentUSER').innerText = items.whichUserName;
			//console.log("Restore POC User: " + items.whichPocName);
			document.getElementById('deptOptions').value = items.whichDeptName;
			document.getElementById('currentDEPT').innerText = items.whichDeptName;
			
			if (items.whichUserName === "Not set" && items.whichDeptName === "Not set") {
			     console.log("No key data found...using defaults. Set USER and DEPARTMENT");
		            document.getElementById('user_option_set').src = "/assets/user-alert.png";
		            document.getElementById('dept_option_set').src = "/assets/warning-sign.png";
		            document.getElementById('op-user-img').src = "/assets/warning-sign.png";
		            document.getElementById('op-dept-img').src = "/assets/warning-sign.png";
		            document.getElementById('options_output').value = "No exisiting prefs data found in sync store. Please set your USERNAME and DEPARTMENT above and click 'Save options'.";
		            document.getElementById('options_output').style.display = "block";
			}
			if (items.whichUserName === null || items.whichUserName === undefined || items.whichUserName === '') {
			      document.getElementById('user_option_set').src = "/assets/user-alert.png";
			      document.getElementById('op-user-img').src = "/assets/circle-remove.png";
			      console.log("WARNING : no user prefs data found in sync store.");
			      document.getElementById('options_output').value = "No exisiting prefs data found in sync store. Please set your USERNAME and DEPARTMENT above and click 'Save options'.";
			}
			if (items.whichUserName !== null && items.whichUserName !== "Not set") {
		      document.getElementById('user_option_set').src = "/assets/user-lock.png";
		      console.log("SUCCESS : found user prefs data in sync store.");
		      console.log("Set user IMG to 'user-lock.png'.");
		      document.getElementById('op-user-img').src = "/assets/circle-ok.png";
		}
		if (items.whichDeptName === null || items.whichDeptName === undefined || items.whichDeptName === '') {
		      document.getElementById('dept_option_set').src = "/assets/warning-sign.png";
		      document.getElementById('op-dept-img').src = "/assets/circle-remove.png";
		      console.log("WARNING : no user DEPT prefs data found in sync store.");
		      document.getElementById('options_output').value = "No exisiting prefs data found in sync store. Please set your USERNAME and DEPARTMENT above and click 'Save options'.";
		      
		}
		if (items.whichDeptName !== null && items.whichDeptName !== "Not set") {
		      document.getElementById('dept_option_set').src = "/assets/settings.png";
		      document.getElementById('op-dept-img').src = "/assets/circle-ok.png";
		      console.log("SUCCESS : found user DEPT prefs data in sync store.");
		      console.log("Set department IMG to 'settings.png'.");
		    
		} else {
		
		      document.getElementById('options_output').innerText = "Finished loading user preferences";
		}
		      console.log("Restored User pref: " + items.whichUserName);
			console.log("Restored Department pref: " + items.whichDeptName);
			console.log("Restore finished.");
			
			});
		}

function clear_options() {
	      
	      console.log("Clear started...see all keys below")
	      chrome.storage.sync.get(null, function(items) {
            var allKeys = Object.keys(items);
            console.log("Keys: " + allKeys);
            });
      
      document.getElementById('userNameOptions').value = "Not set";
      document.getElementById('deptOptions').value = "Not set";
	document.getElementById('user_option_set').src = "/assets/circle-remove.png";
	document.getElementById('dept_option_set').src = "/assets/circle-remove.png";
	document.getElementById('op-user-img').src = "/assets/circle-remove.png";
	document.getElementById('op-dept-img').src = "/assets/circle-remove.png";
	
	document.getElementById('currentUSER').innerText = 'Not set';
	document.getElementById('currentDEPT').innerText = 'Not set';
	document.getElementById('options_output').innerText = "No exisiting prefs data found in sync store. Please set your USERNAME and DEPARTMENT above and click 'Save options'.";
	//document.getElementById('options_output').style.visibility = "hidden";
		chrome.storage.sync.clear();
		console.log("Cleared chrome.storage.sync keys.");
		}

// init::

    document.addEventListener('DOMContentLoaded', restore_options);
	document.getElementById('options_save').addEventListener('click', save_options);
	document.getElementById('options_clear').addEventListener('click', clear_options);
	//document.getElementById('options_output').style.visbility = "hidden";
	var output = document.getElementById('options_output');
	//console.log("Got 'options_output'. " + output);
	//var logarea = document.querySelector('textarea');
	
	//function log(str) {
		//logarea.value = str + "\n" + logarea.value;
		//}
		
	function valueChanged(newValue) {
	      console.log("A key value has changed.");
	      var old_output = document.getElementById('options_output').innerText;
	      console.log("Old value: " + old_output);
	      console.log("New value: " + newValue);
	      
		}
	
	function debugChanges(changes, namespace) {
		for (key in changes) {
		console.log('Storage change: key='+key+' value='+JSON.stringify(changes[key]));
		}
	}
	
	chrome.storage.onChanged.addListener(function(changes, namespace) {
	      
	for (key in changes) {
          var storageChange = changes[key];
          console.log('Storage key "%s" in namespace "%s" changed. ' +
                      'Old value was "%s", new value is "%s".',
                      key,
                      namespace,
                      storageChange.oldValue,
                      storageChange.newValue);
        }
        if(key === "whichUserName") {
              console.log("Key is 'whichUserName'.");
              chrome.storage.sync.get("whichUserName", function(val) {valueChanged(val.whichUserName)});
              console.log("USER Result: " + val.whichUserName);
        }
        if(key === "whichDeptName") {
              console.log("Key is 'whichDeptName'.");
              chrome.storage.sync.get("whichDeptName", function(val) {valueChanged(val.whichDeptName)});
              console.log("DEPT Result: " + val.whichDeptName);
        }
		
		//debugChanges(changes, namespace);
	});