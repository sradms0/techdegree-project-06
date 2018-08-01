# techdegree-project-06
Sixth Techdegree Project - Build a Content Scraper <br>
Build a data-mining application using Node.js

* attempt at meeting expectations
    * Create a scraper.js file that will contain your command line application 
      The project includes a package.json file that includes dependencies 
      The npm install command installs dependencies
    * Scraper checks for a folder called ‘data’
      If the folder doesn’t exist, the scraper creates one 
    * Choose and use third-party npm packages
        * For scraping content from the site, the cheerio module is used
        * To create the CSV file, the json2csv module is used
        * Both packages meet the following requirements:
            * At least 1,000 downloads
            * Has been updated in the last six months
    * Program the scraper
        * The scraper visits the website http://shirts4mike.com and uses http://shirts4mike.com/shirts.php as single entry point to scrape information for           8 tee-shirts from the site, without using any hard-coded urls like http://www.shirts4mike.com/shirt.php?id=101
    * Scraping and Saving Data:
        * The scraper gets the price, title, url and image url from the product page and saves the information into a CSV file
        * The information should be stored in an CSV file that is named for the date it was created, e.g. 2016-11-21.csv
        * CSV columns are ordered by: Title, Price, ImageURL, URL, and Time
        * The CSV file is saved inside the ‘data’ folder
        * If program is run twice, the data in the CSV file is overwritten with the updated information
    * If http://shirts4mike.com is down, an error message describing the issue should appear in the console
        * The error is human-friendly, rather than the direct message from the error object

* attempt at exceeding expectations
    * The package.json file runs the program when the npm start command is run.
    * When an error occurs, it is logged it to a file named scraper-error.log . 
      It should append to the bottom of the file with a time stamp and error e.g. [Tue Feb 16 2016 10:02:12 GMT-0800 (PST)] <error message> 
