const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 3000;

app.get('/tikdl', async (req, res) => {
    const { link } = req.query;

    if (!link) {
        return res.status(400).json({ error: 'Link is required' });
    }

    const url = "https://tiktokio.com/api/v1/tk-htmx";
    
    const data = new URLSearchParams({
        prefix: 'dtGslxrcdcG9raW8uY29t',
        vid: link
    });
    
    const headers = {
        'HX-Request': 'true',
        'HX-Trigger': 'search-btn',
        'HX-Target': 'tiktok-parse-result',
        'HX-Current-URL': 'https://tiktokio.com/',
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    
    try {
        const response = await axios.post(url, data, { headers });
        const $ = cheerio.load(response.data);
        
        const downloadLinks = [];
        $('a[href*="download"]').each((_, element) => {
            downloadLinks.push($(element).attr('href'));
        });
        
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ download_links: downloadLinks }, null, 4));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch download links' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
