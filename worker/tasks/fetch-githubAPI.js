var fetch = require('node-fetch');
const redis = require("redis");
const client = redis.createClient();

const { promisify } = require("util");

const setAsync = promisify(client.set).bind(client);

const job_url = 'https://jobs.github.com/positions.json';

const fetchGitApi = async () =>{

    let resultCount = 1;
    let onPage = 0;
    const allJobs = [];

    while(resultCount > 0){
        const response = await fetch(`${job_url}?page=${onPage}`);
        const jobs = await response.json();
        allJobs.push(...jobs);

        resultCount = jobs.length;
        console.log("JOB LENGTH:", jobs.length);
        onPage++;
    }
    console.log("ALL JOBS", allJobs.length);

    const filtered_jobs = allJobs.filter((job)=>{
        const jobTitle = job.title.toLowerCase();
        if(jobTitle.includes('senior') || jobTitle.includes('manager') || jobTitle.includes('sr.') || jobTitle.includes('architect')){
            return false;
        }
        return true;
    })
    console.log("FILTERED JOBS", filtered_jobs.length);

    const success = await setAsync('github', JSON.stringify(filtered_jobs));

    console.log("SUCCESS", {success});
}

fetchGitApi();

module.exports = fetchGitApi;