const fs = require('fs')
const path = require('path');


const getConfig = () => {
    const config = fs.readFileSync(path.join(__dirname, '../config','settings.json'), 'utf-8');
    const localConfigFilePath = path.join(__dirname+'../config', 'settings-local.json');

    console.log('From Config', config);
    console.log('From Local', localConfigFilePath);

    //Check for local config file and merge with the main file
    if(fs.existsSync(localConfigFilePath)) {
        const localConfigFile = JSON.parse(fs.readFileSync(localConfigFilePath, 'utf-8'));
        config = Object.assign(config, localConfigFile);
    }

    // //Override from .env file
    // console.log('From Object keys',Object.keys(config));
    // Object.keys(config).forEach((configkey) => {
    //     if(process.env[configkey]){
    //         config[configkey] = process.env[configkey];
    //     }
    // });

    return config;

}

module.exports = { getConfig };