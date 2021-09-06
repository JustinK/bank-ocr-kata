const fs = require('fs');
const readline = require('readline');

async function processPolicyNumberList() {
  // parse 'filepath' input from terminal
  // for example: npm run processor --filepath=test2.txt
  // if no params provided 'test.txt' will be used
  const filePath = process.env.npm_config_filepath || 'test.txt';

  // open file and read line by line
  const lineReader = readline.createInterface({
    input: fs.createReadStream(filePath),
  });

  lineReader.on('line', (line) => {
    console.log(`${line}`);
  });
}
processPolicyNumberList();
