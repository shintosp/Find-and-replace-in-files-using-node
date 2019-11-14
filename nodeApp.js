const path = require('path');
var fs = require('fs');

function readWriteSync(fPath) {
  var cfPath = fPath.split("\\");
  cfPath = cfPath.slice(1,cfPath.length-1).join("/");
  //var cfPath = fPath.replace(/\\/g, '/');

  var data = fs.readFileSync(fPath, 'utf-8');
  var url = "https://www.maronicklaw.com/"+cfPath+"/";

  var strValue = '<link rel="canonical" href="index.html"/>';
  var replaceWith = '<link rel="canonical" href="'+url+'"/>'
  var newValue = "";
  
  if(data.includes(strValue)) {
    newValue = data.replace(strValue, replaceWith);
    fs.writeFileSync(fPath, newValue, 'utf-8');
    console.log('-- Processed: ',fPath);
  }
}



function fromDir(startPath,filter){
  //console.log('Starting from dir '+startPath+'/');

  if (!fs.existsSync(startPath)){
      console.log("no dir ",startPath);
      return;
  }

  var files=fs.readdirSync(startPath);
  for(var i=0;i<files.length;i++){
      var filename=path.join(startPath,files[i]);
      var stat = fs.lstatSync(filename);
      if (stat.isDirectory()){
        fromDir(filename,filter); //recurse
      }
      else if (filename.indexOf(filter)>=0) {
        
        //console.log('-- Processed: ',filename);     

        readWriteSync(filename);      
      };
  };
};

fromDir('project','.html');



//------ ***Don't delete***-------------------------
/*(function() {
	var curPath = window.location.pathname;
	if(curPath.includes("/index.html")) {
		window.location.pathname = curPath.replace("/index.html","/");
	}
})();*/


//-------------------------------
//htaccess file

//RewriteEngine On
//RewriteBase /
//RewriteCond %{THE_REQUEST} ^.*/index\.html 
//RewriteCond %{SERVER_PORT} ^8002$
//RewriteRule ^(.*)index.html$ https://www.lancionelaw.com/$1 [R=301,L]
//--------------------------------