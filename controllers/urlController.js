const shortid = require('shortid');
const qrCode = require('qrcode');
const Url = require('../models/Url'); 
const validator = require('validator');

const port = process.env.PORT || 3000; // Port number for the server



exports.shortenUrl = async (req, res) => { 
  const { url: originalUrl, customCode } = req.body; // Retrieve the URL and custom code from the request body
  let userId = req.cookies ? req.cookies.userId : null; // Retrieve the user ID from the cookie

  if (!userId) {
    userId = shortid.generate();
    res.cookie('userId', userId);
  }

  if (validator.isURL(originalUrl)) {
    try {
      let existingUrl = await Url.findOne({ originalUrl: originalUrl });

      if (existingUrl) {
        res.json({
          originalUrl: existingUrl.originalUrl,
          shortUrl: `http://localhost:${port}/${existingUrl.urlCode}`,
        });
      } else {
        if (customCode) {
          const existingCustomUrl = await Url.findOne({ urlCode: customCode });
          if (existingCustomUrl) {
            return res.status(400).json({ message: 'Custom URL code already in use' });
          }
        }

        const urlCode = customCode || shortid.generate();
        const shortUrl = `http://localhost:${port}/${urlCode}`;

        const urlData = new Url({
          originalUrl: originalUrl,
          urlCode: urlCode,
          userId: userId,
        });
        await urlData.save();

        const qrCodeDataUrl = await qrCode.toDataURL(shortUrl);

        res.json({
          originalUrl: originalUrl,
          shortUrl: shortUrl,
          qrCodeDataUrl: qrCodeDataUrl,
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  } else {
    res.status(400).json({ message: 'Invalid URL' });
  }
};


exports.customUrl = async (req, res) => {
  try {
    const { url: originalUrl, customSlug } = req.body;

    // Check if the custom slug is already taken
    const existingUrl = await Url.findOne({ urlCode: customSlug }); 
    if (existingUrl) {
      return res.status(409).json({ message: 'Custom slug is already taken' });
    }

    // Create a new URL document with custom slug
    const newUrl = new Url({ originalUrl: originalUrl, urlCode: customSlug }); 
    await newUrl.save();

    res.status(201).json({ message: 'Shortened URL created with custom slug' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.redirectUrl = async (req, res) => {
  try {
    const foundUrl = await Url.findOne({ urlCode: req.params.code });

    if (foundUrl) {
      await Url.updateOne({ urlCode: req.params.code }, { $inc: { clicks: 1 } }); // Increment the click count by 1
      return res.redirect(foundUrl.originalUrl);
    } else {
      return res.status(404).json({ message: 'No URL found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.urlAnalytics = async (req, res) => {
  try {
    const foundUrl = await Url.findOne({ urlCode: req.params.code });

    if (foundUrl) {
      res.json({
        originalUrl: foundUrl.originalUrl,
        shortUrl: `http://localhost:${port}/${foundUrl.urlCode}`,
        clicks: foundUrl.clicks,
        createdAt: foundUrl.createdAt,
      });
    } else {
      return res.status(404).json({ message: 'No URL found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

//
exports.generalAnalytics = async (req, res) => {
  try {
    const { slug } = req.query;

    // Retrieve the URL by slug
    const foundUrl = await Url.findOne({ urlCode: slug });
    if (!foundUrl) {
      return res.status(404).json({ message: 'URL not found' });
    }

    // Retrieve the click count for the URL
    const clickCount = foundUrl.clicks;

    // Retrieve the click details (e.g., IP address, timestamp)
    const clickDetails = foundUrl.clicks;

    res.status(200).json({ clickCount, clickDetails });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.history = async (req, res) => {
  try {
    // Retrieve all URLs created by the user 
    const userId = req.user.id; 
    const urls = await Url.find({ userId });

    res.status(200).json({ urls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
