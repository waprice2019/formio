module.exports.getProjectByTitle = function (pUrl,pProjectTitle,pToken,pInfoLogging) {

    var axios = require('axios');
    var apiUrl = pUrl;
    var path = '/project';
    var projectTitle = pProjectTitle
    var token = pToken;
    var infoLogging = pInfoLogging;
  
    if (infoLogging === 'true') console.log("\n> Inside getProjectByTitle function");
  
    var config = {
      method: 'get',
    maxBodyLength: Infinity,
      // http://127.0.0.1:8080/project?title=eSubMod-portal
      url: apiUrl + path + '?title=' + projectTitle,
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
  
  