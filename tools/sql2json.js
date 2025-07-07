const fs = require('fs');
const readline = require('readline');

const inputFile = 'mapping_old_data/ward_mappings.sql';
const outputFile = 'json/ward_mappings.json';

const insertRegex = /INSERT INTO `ward_mappings` \([^)]+\) VALUES \((\d+), '([^']*)', '([^']*)', '([^']*)', '([^']*)', '([^']*)', '([^']*)', '([^']*)', '[^']*', '[^']*'\);/;

async function convert() {
  const rl = readline.createInterface({
    input: fs.createReadStream(inputFile),
    crlfDelay: Infinity
  });

  const results = [];

  for await (const line of rl) {
    if (line.startsWith('INSERT INTO')) {
      const match = insertRegex.exec(line);
      if (match) {
        results.push({
          old_ward_code: match[2],
          old_ward_name: match[3],
          old_district_name: match[4],
          old_province_name: match[5],
          new_ward_code: match[6],
          new_ward_name: match[7],
          new_province_name: match[8]
        });
      }
    }
  }

  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2), 'utf8');
  console.log(`Đã chuyển đổi xong! Đã lưu vào ${outputFile}`);
}

convert(); 