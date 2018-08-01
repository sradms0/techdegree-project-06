#!/usr/bin/env node

const request = require('request');
const cheerio = require('cheerio');
const Json2csvParser = require('json2csv').Parser;
const fs = require('fs');

const homeUrl = 'http://shirts4mike.com/';
const shirtsUrl = `${homeUrl}shirt.php`;

// based on error code from request, create "friendlier" output,
// log to console and logfile
function logger(error) {
    let logMessage = 'Error: ';
    const logPath = './scraper-error.log';

    if (error.message.toLowerCase().includes('enotfound')) {
        logMessage += 'page not found (check network connection)';
    } else {
        logMessage += `something went wrong with fetching from ${homeUrl}`;
    }

    if (!fs.existsSync(`${logPath}`)) console.log(`${logPath} created`);
    fs.appendFile(logPath, `[${new Date()}] ${logMessage}\n`, (error) => {
        if (error) throw error;
    });
    console.log(logMessage);
}

// get all hrefs to shirts and parse each for query
function createQueries() {
    return new Promise((resolve, reject) => {
        request(shirtsUrl, (error, response, html) => {
            if (!error && response.statusCode === 200) {
                try {
                    let $ = cheerio.load(html);
                    const queries = $('.products li a')
                        .toArray()
                        .map(a => a.attribs.href.slice(a.attribs.href.indexOf('?')));
                    resolve(queries);
                } catch(error) {
                    reject(error)
                }
            } else {
                logger(error);
            }
        });
    });
}

// create shirt object
function createShirt(query) {
    return new Promise((resolve, reject) => {
        // go to each shirt link
        const shirtUrl = `${shirtsUrl}${query}`;
        request(shirtUrl, (error, response, html) => {
            if (!error && response.statusCode === 200) {
                try {
                    $ = cheerio.load(html);
                    // get price, title, url, and img url
                    const shirt = {
                        "Title": $('title').text(),
                        "Price": $('.price').text(),
                        "ImageUrl": `${homeUrl}${$('.shirt-picture img').attr('src')}`,
                        "URL": shirtUrl,
                        "Time": new Date().toLocaleString()
                    };
                    resolve(shirt);
                } catch(error)  {
                    reject(error);
                }
            } else {
                logger(error)
            }
        });

    });
}

// iterate createShirt
function createShirts() {
    return createQueries().then(queries => {
        // map multiple promises to shirts array
        const shirts = queries.map(query => createShirt(query));
        // resolve each
        return Promise.all(shirts);
    });
}



// get all shirt objects, then create csv file
function main() {
    createShirts().then(shirts => {
        const fields = Object.keys(shirts[0]);
        const json2csvParser = new Json2csvParser({fields});
        const csv = json2csvParser.parse(shirts);

        const dataPath = './data';
        if (!fs.existsSync(`${dataPath}`)) {
            fs.mkdirSync(`${dataPath}`);
            console.log(`${dataPath} directory created`);
        }

        fs.writeFile(`${dataPath}/${new Date().toISOString().slice(0, 10)}.csv`, csv, (error) => {
            if (error) throw error;
            console.log('request successful');
        })
    });
}

main();

