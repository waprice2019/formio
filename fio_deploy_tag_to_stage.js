// Deploy a new code version with template, apiUrl, stageID, ProjectID and token
module.exports.deployTagStage = function (pUrl,pTagVersionTemplate,pProjectID,pToken,pInfoLogging) {
    
    var apiUrl = pUrl;
    var path = '/deploy';
    var tagVersionTemplate = pTagVersionTemplate;
    var projectID = pProjectID;
    var token = pToken;
    var infoLogging = pInfoLogging;

    if (infoLogging === 'true') console.log("\n> Inside deployTagStage function");

    var headers = '';
    var axios = require('axios');

    var data = JSON.stringify({
    "type": "template",
    "template": tagVersionTemplate
    });
    
    //console.log("Data bf Deploy" + data)
    
    var config = {
    method: 'post',
    maxBodyLength: Infinity,
        url: apiUrl + '/project/' + projectID + path,
    //url: '{{apiUrl}}/project/{{projectId}}/deploy',
    headers: { 
        'x-jwt-token': token, 
        'Content-Type': 'application/json'
    },
    data : data
    };

    return axios(config)
    .then(function (response) {
        rspdata = JSON.stringify(response.data);
        console.log(JSON.stringify(response.data));
        return rspdata;
    })
    .catch(function (error) {
        console.log(error);
    });
 };

