// https://stackoverflow.com/questions/49208561/how-to-merge-object-of-multiple-json-into-one-json-file-using-node-js
// {
//     "passed": 1,
//     "fixtures": [
//       {
//         "name": "Getting Started one",
//         "path": "testOne.ts"
//       }
//     ]
//   

const fs = require('fs');
const path = require('path');
const data_folder = process.argv[2]; // first argument 
const theme_folder = (process.argv[3] ? process.argv[3] + '/' : ''); // second argument 

if (!data_folder) {
    console.error(`Usage:\n node ${path.basename(process.argv[1])} file_directory [theme_folder]\ni.e.\nnode ${path.basename(process.argv[1])} _products simpletheme`);
    return 1;
}

const dir = path.join(__dirname, '../' + theme_folder + data_folder);
const target_file = path.join(__dirname, '../' +  theme_folder + data_folder + ".json");
console.log(`dir = ${dir}`);
console.log(`target_file = ${target_file}`);
// let finalContent = {}
// finalContent[data_folder] = {}
let finalContent = {
    [data_folder]: []
};

const read_directory = async dir =>
    fs.readdirSync(dir).reduce((finalContent, file) => {
        filePath = path.join(dir, file);
        console.log("Merging " + filePath + " into " + target_file);
        let content = require(filePath);
        // finalContent.passed += content.passed;
        content["slug"] = path.basename(filePath,'.json');
        finalContent[data_folder] = finalContent[data_folder].concat(content);
        // finalContent[data_folder].push({slug: path.basename(target_file)});
        return finalContent;
    }, { [data_folder]: [] });

read_directory(dir)
.then(data => { fs.writeFileSync(target_file, JSON.stringify(data)); })
.catch(error => { fs.writeFileSync(target_file, JSON.stringify(finalContent)); }
);
