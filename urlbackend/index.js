const  dotenv = require("dotenv");
require('dotenv').config();
const  express = require("express");
const  cors = require("cors");
const  mongoose = require("mongoose");
const  shortid = require("shortid");
const  Url = require("./Url");
const  utils = require("./Util/util");
const qrCode = require("qrcode");

// configure dotenv
dotenv.config();
const app = express();

// cors for cross-origin requests to the frontend application
app.use(cors());
// parse requests of content-type - application/json
app.use(express.json());

// Database connection
console.log('MongoDB URI:', process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Db Connected`);
  })
  .catch((err) => {
    console.log(err.message);
  });

// get all saved URLs 
app.get("/all", async (req, res, next) => {
  try {
    const data = await Url.find().exec();
    res.json(data);
  } catch (error) {
    next(error);
  }
});


// URL shortener endpoint
app.post("/short", async (req, res) => {
  console.log("HERE",req.body.url);
  const { origUrl } = req.body;
  const base = `http://localhost:3333`;

  const urlId = shortid.generate();
  if (utils.validateUrl(origUrl)) {
    try {
      let url = await Url.findOne({ origUrl });
      if (url) {
        res.json(url);
      } else {
        const shortUrl = `${base}/${urlId}`;

        url = new Url({
          origUrl,
          shortUrl,
          urlId,
          date: new Date(),
        });

        await url.save();
        res.json(url);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json('Server Error');
    }
  } else {
    res.status(400).json('Invalid Original Url');
  }
});

// redirect endpoint
app.get("/:urlId", async (req, res) => {
  try {
    const url = await Url.findOne({ urlId: req.params.urlId });
    console.log(url)
    if (url) {
      url.clicks++;
      url.save();
      return res.redirect(url.origUrl);
    } else res.status(404).json("Not found");
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
});

// Function to generate a QR code for a given short URL
app.get("/qrcode/:urlId", async (req, res) => {
  try {
    const url = await Url.findOne({ urlId: req.params.urlId });

    if (url) {
      const shortUrl = url.shortUrl;

      // Generate QR code
      const qrCodeDataUrl = await generateQRCode(shortUrl);

      // Respond with the QR code image
      res.send(qrCodeDataUrl);
    } else {
      res.status(404).json("Not found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
});

// Function to generate a QR code from text (short URL)
async function generateQRCode(text) {
  try {
    // Generate QR code and return the data URL
    const qrCodeDataUrl = await qrCode.toDataURL(text);
    return qrCodeDataUrl;
  } catch (error) {
    throw error;
  }
}

// Port Listenning on 3333
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});