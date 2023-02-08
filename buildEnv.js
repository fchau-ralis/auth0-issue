require('dotenv').config();

const fs = require('fs');
const path = require('path');

const environmentFilesDirectory = path.join(__dirname, './src/environments');
const targetEnvironmentFileName = 'environment.ts';

const NODE_ENV = process.env.NODE_ENV || 'development';

const isProduction = NODE_ENV === 'production' ? true : false;

const template = `export const environment = 
{ 
    \n\tproduction: ${isProduction}, \n\tapiUrl: '${process.env.API_BASE_URL}', 
    \n\tauth0_domain: '${process.env.AUTH0_DOMAIN}', 
    \n\tauth0_client_id: '${process.env.AUTH0_CLIENT_ID}', 
    \n\tauth0_audience: '${process.env.AUTH0_AUDIENCE}'};`;

// Write environment file
fs.writeFileSync(
    path.join(environmentFilesDirectory, targetEnvironmentFileName),
    template
);
