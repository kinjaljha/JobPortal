var cron = require('node-cron');
var fetchGitHub = require('./tasks/fetch-githubAPI'); 


cron.schedule('*/1 * * * *', fetchGitHub, null);