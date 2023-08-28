const fs = require('fs');
const fio_login = require('./fio_login');
const fio_get_project_by_title = require('./fio_get_project_by_title');
const fio_get_stage_by_title = require('./fio_get_stage_by_title');
const fio_create_version_tag = require('./fio_create_version_tag');
const fio_get_tag_version_header = require('./fio_get_tag_version_header');
const fio_deploy_tag_to_stage = require('./fio_deploy_tag_to_stage');
const fio_logout = require('./fio_logout');

const configFile = fs.readFileSync("./config-test.json","utf8");
const config = JSON.parse(configFile);

var formioUrl = config.formioUrl;
var apiUrl = config.apiUrl;
var username = config.username;
var password = config.password;
var projectTitle = config.projectTitle;
var stageTitle = config.stageTitle;
var versionTag = config.versionTag;
var templateFile = config.templateFile;
var infoLogging = config.infoLogging;

var projectName = '';
var projectID = '';
var stageName = '';
var stageID = '';
var token = '';
var header = '';
var template = '';

// Logging
if (infoLogging === 'true') {console.log("\nCONFIG FILE:");console.log(config);};

// read Form.io templateFile into variable 
const templateJSON = fs.readFileSync(templateFile,"utf8");
template = JSON.parse(templateJSON);
// Logging
if (infoLogging === 'true') {console.log("\nTEMPLATE:");console.log(template);};


/* STEPS: 
To Migrate code template from Development to Target (Test, Pre-prod or Prod)
1. Check config.json file values have been assigned
2. Login to Form.io with username/password - return: token
3. Get the Project name and Project ID from lookup of Project Title (e.g. "eSubMod-portal")
4. Get the Stage name and Stage ID from lookup of Stage Title (e.g. "Dev Code")
5. Check passed Tag and Stage do not already exist (if exists then log error and exit out of module)
6. Create Project Version Tag : apiUrl, template, projectID, stageID, version tag and token (e.g. Project: eSubMod-portal / Stage: "Dev Code" / version: "0.0.3")
7. Deploy tag version to Live Stage : apiUrl, template, projectID, version tag and token
8. Logout of Form.io
*/

// 1. Check config.json file values have been assigned
if (infoLogging === 'true') console.log("\n1. Check config.json file values have been assigned");
if (formioUrl === '' || apiUrl === '') {
  console.log("ERROR - CONFIG FILE : Form.io 2 x urls have not been defined\n\n EXITING");
  return;
} else if (username === '' || password === '') {
  console.log("ERROR - CONFIG FILE : Username and/or Password have not been defined\n\n EXITING");
  return;
} else if (projectTitle === '' || stageTitle === '') {
  console.log("ERROR - CONFIG FILE : ProjectTitle and/or StageTitle have not been defined\n\n EXITING");
  return;
} else if (versionTag === '') {
  console.log("ERROR - CONFIG FILE : versionTag has not been defined\n\n EXITING");
  return;  
} else if (templateFile === '') {  
  console.log("ERROR - CONFIG FILE : templateFile has not been defined\n\n EXITING");
  return;
}
  
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// 2. Login to Form.io with username/password - return: token
if (infoLogging === 'true') console.log("\n2. Login to Form.io with username/password - return: token");
fio_login.login(formioUrl,username,password,infoLogging).then((token) => {
  if (token === "" || token === null || token === undefined) {
    console.log("\n ** ERROR - Username/Password: " + username + " no token returned.\n\n EXITING");
    return;
  }

  // Logging
  if (infoLogging === 'true') console.log("X-JWT-TOKEN Returned:\n" + token);



  // 3. Get the Project name and Project ID from lookup of Project Title (e.g. "eSubMod-portal")
  // Need to pull the following from Project: _id and Name
  // E.g., http://127.0.0.1:8080/project?title=eSubMod-portal
  if (infoLogging === 'true') console.log("\n3. Get the Project name and Project ID from lookup of Project Title");
  fio_get_project_by_title.getProjectByTitle(apiUrl,projectTitle,token,infoLogging).then((header) => {
    let projectJsonData = JSON.parse(header);
    if (projectJsonData.length > 0) {
      projectID = projectJsonData[0]["_id"];
      projectName = projectJsonData[0]["name"];
    } else {
      console.log("\n ** ERROR - Project: " + projectTitle + " does not not exist.\n\n EXITING");
      return;
    };

    // Logging
    if (infoLogging === 'true') console.log("\nProject Title/Name/ID: " + projectTitle + "/" + projectName + "/" + projectID);   
   

    // 4. Get the Stage name and Stage ID from lookup of Stage Title (e.g. "Dev Code")
    if (infoLogging === 'true') console.log("\n4. Get the Stage name and Stage ID from lookup of Stage Title");
    fio_get_stage_by_title.getStageByTitle(apiUrl,stageTitle,token,infoLogging).then((header) => {
      //console.log("getStageByTitle Response Returned: " + header);
      let stageJsonData = JSON.parse(header);
      if (stageJsonData.length > 0) {
        stageID = stageJsonData[0]["_id"];
        stageName = stageJsonData[0]["name"];
      } else {
        console.log("\n ** ERROR - Stage: " + stageTitle + " does not not exist.\n\n EXITING");
        return;
      };
      if (infoLogging === 'true') console.log("\nStage Title/Name/ID: " + stageTitle + "/" + stageName + "/" + stageID); 


      // 5. Check passed Tag and Stage do not already exist (if exists then log error and exit out of module)
      // VALIDATION: Tag Version does not currently exist.
      if (infoLogging === 'true') console.log("\n5. Check passed Tag and Stage do not already exist");     
      fio_get_tag_version_header.getTagVersionHeader(apiUrl,projectName,versionTag,token,infoLogging).then((header) => {
        
        if (infoLogging === 'true') console.log("\ngetTagVersionHeader Response Returned:\n" + header);
        stageJsonData = JSON.parse(header);

        if (stageJsonData.length > 0) {
          tagVersionHeaderID = stageJsonData[0]["_id"];
          console.log("\n ** ERROR - DUPLICATE TAG VERSION : Tag version already exists for this Project/Stage\n\n EXITING");
          return;
        }
return; // ########

        //6. Create Project Version Tag : apiUrl, template, projectID, stageID, version tag and token
        //Create a new tagged code version in Stage

        fio_create_version_tag.createVersion(apiUrl,template,projectID,stageID,versionTag,token,infoLogging).then((header) => {
          if (infoLogging === 'true') console.log("\ncreateVersion Response Returned:\n" + header);
          let tagJsonData = JSON.parse(header);
          let tagVersionTemplate = tagJsonData.template;
          
          if (infoLogging === 'true') console.log("\ntagVersionTemplate:\n" + JSON.stringify(tagVersionTemplate));

          
          //7. Deploy tag version to Live Stage : apiUrl, template, projectID, version tag and token
          fio_deploy_tag_to_stage.deployTagStage(apiUrl,tagVersionTemplate,projectID,token,infoLogging).then((header) => {
              if (infoLogging === 'true') console.log("deployTagStage Response Returned: " + header);


            //8. Logout of Form.io
            fio_logout.logout(formioUrl,token,infoLogging).then((header) => {
              if (infoLogging === 'true')console.log("logout Response Returned: " + header);

            }); //logout
          }); //deployTagStage
        }); //createVersion
      }); //getTagVersionHeader      
    }); //getStageByTitle      
  }); //getProjectByTitle
}); //login
