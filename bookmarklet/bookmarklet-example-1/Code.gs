var SHEET_NAME = "MASTER";

var SCRIPT_PROP = PropertiesService.getScriptProperties();

function doGet(e) {
  
  var params = JSON.stringify(e);
  return HtmlService.createHtmlOutput(params);
  
  if(typeof e !== 'undefined')
    return ContentService.createTextOutput(JSON.stringify(e.parameter));
  
  return handleResponse(e);
}

function doPost(e) {
  Logger.log("Start doPost task due to received event.");
  var post = e.parameters;
  Logger.log("POST data: " + post);
  
  // Go through the event data for matching params
  var submit_time = e.parameter.Timestamp;
  Logger.log("Submit time is: " + submit_time);
  var user_name = e.parameter.userName;
  Logger.log("USER_NAME: " + user_name);
  var dept = e.parameter.dept;
  Logger.log("USER_DEPT: " + dept);
  var time_spent = e.parameter.timeSpent;
  Logger.log("TIME_SPENT: " + time_spent);
  var task_url = e.parameter.url;
  Logger.log("TASK_URL: " + task_url);
  var comment_summary = e.parameter.summary;
  Logger.log("COMMENT_SUMMARY: " + comment_summary);
    
  Logger.log("Finished parsing params.");
         
             //+user_name+ ", " +dept+ ", " +time_spent+ ", " +task_url+ ", " +comment_summary);
  try {
    
    handleResponse(e);
    
  } catch (e) {
    
    Logger.log("e Value: " + e);
  }
  
  var params = JSON.stringify(e);
  return HtmlService.createHtmlOutput(params);
  
  Logger.log(e.getContentText("UTF-8"));
  Logger.log("POST params = " + params);

  // do something with the contents ...
  //for (p in e.parameters)
  //{

    //Logger.log (p.toString());
  //}

  var xmlDoc = Xml.parse(e.postData.contents);
  Logger.log("Parsed XML: " + xmlDoc);
  
  if(typeof e !== 'undefined')
    return ContentService.createTextOutput(JSON.stringify(e.parameter));
  Logger.log("POST request received: " + ContentService.createTextOutput(JSON.stringify(e.parameter)));
  
  return handleResponse(e);
}

function handleResponse(e) {
  
  Logger.log("Event: received handleResponse(e) signal.");
  
  // we want a public lock, one that locks for all invocations
  var lock = LockService.getPublicLock();
  lock.waitLock(30000); // wait 30 seconds before conceding defeat
  
  var params = JSON.stringify(e);
  Logger.log(" POST data parameters: [" + params + "]");
  //return HtmlService.createHtmlOutput(params);
  
  try {
    Logger.log("Open spreadsheet by ID.");
    var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
    Logger.log("Get SHEET_NAME...");
    var sheet = doc.getSheetByName(SHEET_NAME);
    
    var headRow = e.parameter.header_row || 1;
    var headers = sheet.getRange(1, 1, 8, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow()+1;
    var row = [];
    
    for (i in headers) {
      if (headers[i] == "Timestamp") {
        row.push(new Date());
      } else {
        row.push(e.parameter[headers[i]]);
      }
    }
    sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
    
    return ContentService.createTextOutput(JSON.stringify({"result":"success", "row": nextRow})).setMimeType(ContentService.MimeType.JSON);
  } catch(e){
    return ContentService.createTextOutput(JSON.stringify({"result":"error", "error": e})).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
  
}

function setup() {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    SCRIPT_PROP.setProperty("key", doc.getId());
}