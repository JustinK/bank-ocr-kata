import { createReadStream, createWriteStream } from 'fs';
import { createInterface } from 'readline';
import PolicyNumber from './PolicyNumber.js';
async function processPolicyNumberList() {
  // parse 'filepath' input from terminal
  // for example: npm run processor --filepath=input/test2.txt
  // if no params provided 'test.txt' will be used
  const filePath = process.env.npm_config_filepath || 'input/test.txt';
  let policyLineCount = 0;
  let lines = {
    0: null,
    1: null,
    2: null,
    3: null,
  };
  // open file and read line by line
  const lineReader = createInterface({
    input: createReadStream(filePath),
  });

  // open file write stream to write to as policy numbers are parsed
  const writer = createWriteStream(`output/${Date.now()}_output.text`, {
    flags: 'a',
  });

  // go through each line in file and on each 4th line parse the input
  lineReader.on('line', (line) => {
    lines[policyLineCount] = line;
    if (policyLineCount === 3) {
      lines[policyLineCount] = line;
      const policyNumber = new PolicyNumber();
      const number = policyNumber.parseLines(lines);
      writer.write(`${number}\r\n`);

      //reset 'lines' & 'policyLineCount' for next policy number in file
      Object.keys(lines).forEach((key) => (lines[key] = null));
      policyLineCount = 0;
    } else {
      policyLineCount++;
    }
  });
}
processPolicyNumberList();
