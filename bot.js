require("dotenv").config();
const axios = require('axios');
const puppeteer=require("puppeteer");
const mongoose=require("mongoose");
const { Posts, Pages }=require("./models/BotPosts.js");
const path = require('path');
const fs = require("fs");
const SITE= process.env.SITE_URL;

const main=async () => {
    let browser;
    try {
        browser=await puppeteer.launch({
            headless: true,
            executablePath: '/snap/bin/chromium', // Use the correct Chromium path here
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-notifications',
                '--disable-popup-blocking'
            ]
        });
        const page=await browser.newPage();

        // Find the existing page document


        // Scrape the page for posts
        const scrapePage=async () => {
            const postList=await page.evaluate(() => {
                let posts=Array.from(document.querySelectorAll('.post-item'));
                return posts.map(post => {
                    let postUrl=post.querySelector('a').href;
                    let title=post.querySelector('h3').innerText;
                    let poster=post.querySelector('img').src;
                    return { postUrl, title, poster };
                });
            });

            // Loop through the postList to scrape individual posts
            for (let post of postList) {
                const totalPosts=await Posts.countDocuments();
                console.log(`Scraping post: ${totalPosts+1} :) \n`);

                try {
                    await page.goto(post.postUrl);
                    await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 60000 }); // Increase to 60 seconds
                    let postDetails=await page.evaluate((post) => {
                        const {
                            title,
                            poster,
                        }=post;
                        const unwantedWords=["|", "480p", "720p", "1080p", "hindi", "english", "download", "complete", "&"];
                        const spans=Array.from(document.querySelectorAll('span'));
                        const images=Array.from(document.querySelectorAll('img[width="850"]'));

                        const featuredImage=images[0]?.src||poster;
                        const imdbRating=spans.find((elem) => elem.innerText.trim()==="IMDb Rating")?.parentElement?.innerText.split(":")[1]?.trim()||"N/A";
                        const releaseYear=spans.find((elem) => elem.innerText.trim()==="Release Year")?.parentElement?.innerText.split(":")[1]?.trim()||"N/A";
                        const genres=spans.find((elem) => elem.innerText.trim()==="Genre")?.parentElement?.innerText.split(":")[1]?.trim()||"N/A";
                        const format=spans.find((elem) => elem.innerText.trim()==="Format")?.parentElement?.innerText.split(":")[1]?.trim()||"N/A";
                        const language=spans.find((elem) => elem.innerText.trim()==="Language")?.parentElement?.innerText.split(":")[1]?.trim()||"N/A";
                        const starCast=spans.find((elem) => elem.innerText.trim()==="Star Cast")?.parentElement?.innerText.split(":")[1]?.trim()||"N/A";
                        const director=spans.find((elem) => elem.innerText.trim()==="Director")?.parentElement?.innerText.split(":")[1]?.trim()||"N/A";
                        const fileSize=spans.find((elem) => elem.innerText.trim()==="File Size")?.parentElement?.innerText.split(":")[1]?.trim()||"N/A";
                        const quality=spans.find((elem) => elem.innerText.trim()==="Quality")?.parentElement?.parentElement?.innerText.split(":")[1]?.trim()||"N/A";
                        let image=images[1]?.src;
                        if (!image) {
                            image=spans.find((elem) => elem.innerText.trim().includes('Screenshots: “See Before Downloading”'))?.parentElement?.nextElementSibling?.nextElementSibling?.getElementsByTagName("img")[0]?.src
                            if (!image) {
                                image=spans.find((elem) => elem.innerText.trim().includes('Screenshots: “See Before Downloading”'))?.parentElement?.nextElementSibling?.querySelector("img")?.src||"Image not found.";
                            }
                        }
                        const slug=location.pathname.split('/').filter(Boolean).pop();
                        const words=title.toLowerCase().split(" ");
                        const keywords=words.filter(word => !unwantedWords.includes(word));
                        const metaDesc=`${title} in HD quality for free.`;
                        const synopsis=spans.find((e) => e.innerText.includes("SYNOPSIS"))?.parentElement?.parentElement?.nextElementSibling?.getElementsByTagName("p")[0]?.innerText||"No synopsis available";

                        const ems=Array.from(document.querySelectorAll('em'));
                        const downloadLinks=ems.slice(1).map(em => {
                            return { type: em.innerText, link: em.parentElement?.href };
                        });

                        return {
                            poster,
                            title,
                            featuredImage,
                            imdbRating,
                            releaseYear,
                            genres,
                            format,
                            language,
                            starCast,
                            director,
                            fileSize,
                            quality,
                            image,
                            slug,
                            keywords,
                            metaDesc,
                            synopsis,
                            downloadLinks,
                        };
                    }, post);

                    // Function to download image
                    const downloadImage = async (url, savePath) => {
                        const response = await axios({
                        url,
                        method: 'GET',
                        responseType: 'stream',
                        });
                    
                        return new Promise((resolve, reject) => {
                        const stream = response.data.pipe(fs.createWriteStream(savePath));
                        stream.on('finish', resolve);
                        stream.on('error', reject);
                        });
                    };
                    
                    // Ensure the directory exists
                    const dirPoster = path.join(__dirname, 'public' ,'images', 'poster');
                    if (!fs.existsSync(dirPoster)) {
                        fs.mkdirSync(dirPoster, { recursive: true });
                    }
                    
                    // Ensure the directory exists
                    const dirImage = path.join(__dirname, 'public','images', 'image');
                    if (!fs.existsSync(dirImage)) {
                        fs.mkdirSync(dirImage, { recursive: true });
                    }
  
                  
                    
                    const savePathPoster = path.join(dirPoster, `${postDetails.slug}.jpg`);
                    const savePathImage = path.join(dirImage, `${postDetails.slug}.jpg`);

                    const existingPost=await Posts.findOne({ title: postDetails.title });
                    if (existingPost) {

                        console.log(`Post already exists: ${post.title} `);

                        // await Posts.findOneAndUpdate(
                        //     { title: postDetails.title }, // Find the post by title
                        //     {
                        //         $set: postDetails, // Update other fields in postDetails
                        //         $push: { categories: "hindi-dubbed-movies" } // Push "bollywood" into the category array
                        //     },
                        //     { upsert: true, new: true } // Create a new document if none is found and return the updated document
                        // );

                        // update all the fields
                        await Posts.findOneAndUpdate({ title: postDetails.title }, postDetails, { upsert: true, new: true });

                        console.log(`Post updated. \n`);
                        // const updatedPost=await Posts.findOne({ title: postDetails.title });
                        // console.log(updatedPost.categories, "\n");

                    } else {
                        
                         // save the post
                         downloadImage(postDetails.poster, savePathPoster)
                         .then(async () => {
                             
                             downloadImage(postDetails.image, savePathImage)
                             .then(async () => {
                                 console.log('Image downloaded and saved with the correct extension');
                                 await Posts.create(postDetails);  // Save the new post to the database
                                 console.log(`Post saved: ${post.title} \n`);
                             })
                             .catch((error) => {
                                 console.error('Failed to download the image:', error);
                             });
 
                         })
                         .catch((error) => {
                             console.error('Failed to download the poster:', error);
                         });

                    }

                } catch (error) {
                    console.error(`Error scraping post: ${post.title} \n`, error);
                }
            }
            try {
                // Find the existing page document
                const pageInfo=await Pages.findOne({});

                if (pageInfo&&pageInfo.pageUrl) {
                    console.log(`Resuming from last scraped page: ${pageInfo.pageUrl}`);
                    await page.goto(pageInfo.pageUrl);  // Resume from the last scraped URL
                    await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 60000 }); // Increase to 60 seconds
                } else {
                    console.log("No previous page found, starting from homepage --> ", SITE);
                    await page.goto(SITE);  // Default URL if not found
                    await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 60000 }); // Increase to 60 seconds
                }
                await scrapePage();
                
                const nextButton=await page.$('.nextpostslink');
                
                if (nextButton) {
                    console.log("Going to next page...");
                    await Promise.all([
                        page.evaluate(nextButton => nextButton.click(), nextButton),
                        page.waitForNavigation({ waitUntil: 'domcontentloaded' })
                    ]);

                    // Update the page URL in the database
                    const newPageUrl=page.url();
                    await Pages.findOneAndUpdate({}, { pageUrl: newPageUrl }, { upsert: true });
                    console.log(`Page URL updated: ${newPageUrl}`);
                } else {
                    console.log("No next page found.");
                }
                
            } catch (error) {
                console.error("Error going to the next page:", error);
            }
            
            // Recursive call to continue scraping the next pageee

            
        };
        // Start scraping the page
        await scrapePage();


    } catch (error) {
        console.error(error);
    } finally {
        await browser.close();
    }
};

    // Start the server
    mongoose.connect(process.env.LOCAL_URI).then(() => {
        console.log("Connected to the database.");
        console.log("Starting the scraping process... \n");
        main();
    }).catch((err) => {
        console.log("Error connecting to the database...");
        console.log(err);
    });  