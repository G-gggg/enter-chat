let http = require('http');

function testPort(port){
    return new Promise((resolve, reject) => {
        let server = http.createServer();
    
        server.listen(port, () => {
          server.close();
          resolve(true);
        });
    
        server.on("error", (err) => {
          resolve(false);
        });
      });
}

async function getValidPort(port = 8080) {
    let validPort = null;
  
    while (!validPort) {
      let isValid = await testPort(port);
  
      if (isValid) {
        validPort = port;
        break;
      }
  
      port++;
    }
  
    return validPort;
  }

  module.exports = {getValidPort}