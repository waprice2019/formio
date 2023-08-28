module.exports.logout = function (pUrl,pToken,pInfoLogging) {
    if (infoLogging === 'true') console.log("\n> Inside logout function\n");
  
    var portalBaseUrl = pUrl;
    var path = '/logout';
    var token = pToken;
    var infoLogging = pInfoLogging;
  
    if (infoLogging === 'true') console.log("\n> Inside logout function");
  
    var axios = require('axios');
    var FormData = require('form-data');
    var data = new FormData();
  
    var config = {
      method: 'get',
    maxBodyLength: Infinity,
      url: portalBaseUrl + path,
      headers: { 
        ...data.getHeaders(),
        'x-jwt-token': token
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
  