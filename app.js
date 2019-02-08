let express = require('express');
let fs = require('fs');
let extract = require('ipa-extract-info');
let cors = require('cors');

let app = express();
let ApkReader = require('node-apk-parser');

app.use(cors())

app.get('/', function (req, res) {
  res.send('');
});

app.get('/api/ota-file/:platform', function (req, res) {
  let fs = require('fs');
 
  let platform = req.params.platform;
  let path = '/../mobile-archive/' +  req.params.platform;
  let files = fs.readdirSync( __dirname + path ); // You can also use the async method
  let sorted = files.sort((a, b) => {
      let s1 = fs.statSync(__dirname + path + "/" + a);
      let s2 = fs.statSync(__dirname + path + "/" + b);
      return s1.ctime < s2.ctime;
  });
  startSort(sorted, platform, path, res)
});

app.get('/api/download/icon', function(req, res){
  let file = __dirname + '/images/favicon.ico';
  res.download(file);
});

app.get('/api/ota-file/download/:platform/:filename', function(req, res){
  let file = __dirname + '/../mobile-archive/' + req.params.platform + '/' + req.params.filename;
  res.download(file);
});

app.get('/api/ota-file/download-manifest/:filename', function(req, res){
  console.log(req.params.filename);
  let file = __dirname + '/../mobile-archive/ios-manifest/' + req.params.filename;
  res.download(file);
});

const findFile = (fd) => new Promise(r => {
  return extract(fd, function(err, info, raw){
    if (err) throw err;
    r(info[0].CFBundleVersion);
  });
})

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

const startSort = async (sorted, platform, path, res) => {
  let result = []
  await asyncForEach(sorted, async (item) => {
    let date = new Date(fs.statSync(__dirname + path + "/" + item).ctime).toLocaleString('en')
    if(platform == 'android'){
      result.push(getAndroidPath(__dirname + path + "/" + item, item, date))
    } else if(platform == 'ios'){
      if(item[0] != '.'){
        const absPath = __dirname + path + "/" + item;
        const fd = fs.openSync(absPath, 'r');
        const version = await findFile(fd);
        result.push({fileName: item, version: version, time: date, platform: 'ios' });
      }
    }
  })
  res.send(result);
}



const getAndroidPath = (path, file_name, date) => { 
  let reader = ApkReader.readFile(path)
  let manifest = reader.readManifestSync()
  return { fileName: file_name, version: manifest.versionName + ' (' + manifest.versionCode + ')', time: date, platform: 'android'};
}


const getiOSPath = (path, file_name, date, result, index, fileLength, res) => { 
  let fd = fs.openSync(path, 'r');
  extract(fd, function(err, info, raw){
    if (err) throw err;
    result.push({fileName: file_name, version: info[0].CFBundleVersion, time: date, platform: 'ios' });
    if(index >= fileLength - 1){
      res.send(result)
    }
  });
}




app.listen(4567, function () {
  console.log('Example app listening on port 4567!');
});
