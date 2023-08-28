module.exports.getTagVersionHeader = function (pUrl,pProjectName,pVersionTag,pToken,pInfoLogging) {
    var axios = require('axios');
  
    var apiUrl = pUrl;
    var path = '/tag';
    var projectName = pProjectName;
    var versionTag = pVersionTag;
    var headers = '';
    var token = pToken;
  
    var infoLogging = pInfoLogging;
  
    if (infoLogging === 'true') console.log("\n> Inside getTagVersionHeader function");
  
    var config = {
      method: 'get',
      maxBodyLength: Infinity,
      // http://127.0.0.1:8080/hzoemhmmvkfbrvr/tag?tag=0.0.14
      url: apiUrl + '/' + projectName + path + '?tag=' + versionTag,
      headers: { 
        'Content-Type': 'application/json', 
        'x-jwt-token': token
      }
    };
    
    return axios(config)
    .then(function (response) {
      //headers = JSON.stringify(response.headers);
      rspdata = JSON.stringify(response.data);
      //console.log(rspdata);
      return rspdata;
    })
    .catch(function (error) {
      console.log(error);
    });
  };
  
  