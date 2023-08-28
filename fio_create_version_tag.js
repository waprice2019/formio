module.exports.createVersion = function (pUrl,pTemplate,pProjectID,pStageID,pVersionTag,pToken,pInfoLogging) {
    
    var apiUrl = pUrl;
    var path = '/tag';
    var template = pTemplate;
    var projectID = pProjectID;
    var stageID = pStageID;
    var versionTag = pVersionTag;
    var token = pToken;
   
    var headers = '';
    var infoLogging = pInfoLogging;
  
    if (infoLogging === 'true') console.log("\n> Inside createVersion function");
  
  
    // Create a new code version with template, apiUrl, stageID, ProjectID and token
    var axios = require('axios');
  
    var data = JSON.stringify({
      "project": projectID,
      "tag": versionTag,
      "template": template
    });
  
   // console.log("Data: " + data);
  
    var config = {
      method: 'post',
    maxBodyLength: Infinity,
      //url: '{{apiUrl}}/project/{{stageId}}/tag',
      url: apiUrl + '/project/' + stageID + path,
      headers: { 
        'x-jwt-token': token, 
        'Content-Type': 'application/json'
      },
      data : data
    };
  
    return axios(config)
    .then(function (response) {
      rspdata = JSON.stringify(response.data);
      //console.log(JSON.stringify(response.data));
      return rspdata;
    })
    .catch(function (error) {
      console.log(error);
    });
  };
  