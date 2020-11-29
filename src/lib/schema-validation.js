const Ajv = require('ajv');
const ObjectId = require('mongodb').ObjectID;
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const ajv = new Ajv({allErrors: true, jsonPointers: true, nullable: true});

const addSchemas = async () => {
    console.log(path.join(__dirname, '/schemas/*.json'));
    const schemaFiles = await glob.sync(path.join(__dirname, '/schemas/*.json'));
    console.log('From Schema files',schemaFiles);
    schemaFiles.forEach(file => {
        const fileData = JSON.parse(fs.readFileSync(file,'utf-8'));
        ajv.addSchema(fileData,path.basename(file,'.json'));
    });

    const emailRegex = /^([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    ajv.addFormat('emailAddress', emailRegex);

    ajv.addFormat('objectid', {
        validate: (objId) => {
            return ObjectId.isValid(objId);
        }
    });

    ajv.addKeyword('isNotEmpty', {
        validate: function validate(schema, data){
            const result = typeof data === 'string' && data.trim() !== '';
            if(!result){
                validate.errors = [{ keyword: 'isNotEmpty', message: 'Cannot be an empty string', params: { keyword: 'isNotEmpty' } }];
            }
            return result;
        },
        errors: true
    });

    require('ajv-errors')(ajv);
}

const validateJson = (schema, json) => {
    const result = ajv.validate(schema, json);
    return {
        result,
        errors: ajv.errors
    };
};

module.exports = {
    addSchemas,
    validateJson
};

