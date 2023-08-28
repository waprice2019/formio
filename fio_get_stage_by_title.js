module.exports.getStageByTitle = function (pUrl,pStageTitle,pToken,pInfoLogging) {

    var axios = require('axios');
    var apiUrl = pUrl;
    var path = '/project';
    var stageTitle = pStageTitle
    var token = pToken;
    var infoLogging = pInfoLogging;
    
    if (infoLogging === 'true') console.log("\n> Inside getStageByTitle function");
  
    var config = {
      method: 'get',
    maxBodyLength: Infinity,
      //http://127.0.0.1:8080/project?title=Dev Code
      url: apiUrl + path + '?title=' + stageTitle,
      headers: { 
        'Content-Type': 'application/json', 
        'x-jwt-token': token
      }
    };
  
    return axios(config)
    .then(function (response) {
      //console.log(JSON.stringify(response.data));
      rspdata = JSON.stringify(response.data);
      return rspdata;
    })
    .catch(function (error) {
      console.log(error);
    });
  };
  