## OTA-Server Architechure 
### Introduction
Mobile OTA (Over-The-Air) update is an application distribution method which delivers test application prior to public launch process. We are required to set the frontend and backend service to connect with the development pipline process.

### Architecture
This project is run on nodeJS environment. All applications will be compiled by development pipeline from Gitlab / Jenkins, and will be generated to a separated directory file which are named as platform names. It separates into three directory folders: <br>
<br>
![](screenshot/screenshot1.png)
<br>

It include two key public APIs:

1. Get file list from different platform: ```/api/ota-file/{platform}```
2. Get application file built by pipeline from directory file: ```/api/ota-file/download/{platform}/{filename}```

Other internal APIs:
1. Get iOS manifest file from directoty: ```/api/ota-file/download-manifest/{filename}```
2. Get icon image: ```/api/download/icon``` 

### Compile Project
The project is dockerized and can be compiled with following command:
```docker-compose up```

