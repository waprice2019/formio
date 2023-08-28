var rToken;
var token = "";

module.exports.login = function (pUrl,pUsername,pPassword,pInfoLogging) {
  var formioUrl = pUrl;
  var username = pUsername;
  var password = pPassword;
  var infoLogging =pInfoLogging;

  if (infoLogging === 'true') console.log("\n> Inside login function\n");
  
  var path = '/user/login';
  var responseHeaders = '';
  var token;

  var axios = require('axios');
  const fs = require('fs');

  const cert = fs.readFileSync("./ctpesubmissions.test.fda.gov.crt");
  //console.log("Cert:\n" + cert);

  var data = JSON.stringify({
    "data": {
      "email": username,
      "password": password
    }
  });

  var config = {
    method: 'post',
  maxBodyLength: Infinity,
    url: formioUrl + path,
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };

  return axios(config)
  .then(function (response) {
    //console.log(JSON.stringify(response.data));
    responseHeaders = JSON.stringify(response.headers);
    //console.log(responseHeaders);
    token = response.headers['x-jwt-token'];
    return token;
  })
  .catch(function (error) {
    console.log(error);
  });
};
