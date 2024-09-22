const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mime = require('mime-types');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

app.get("/", (req, res) => {
  res.json({ msg: "try endpoint /bfhl" });
});

// This is theGET endpoint
app.get("/bfhl", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

// This is the POST endpoint
app.post("/bfhl", (req, res) => {
  try {
    const { data, file_b64 } = req.body;

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ is_success: false, error: "Invalid input format" });
    }

    if (data.some(item => typeof item !== 'string')) {
      return res.status(400).json({ is_success: false, error: "All items in data array must be strings" });
    }

    const numbers = data.filter((item) => !isNaN(item));
    const alphabets = data.filter((item) => isNaN(item) && item.length === 1);
    const highestLowercaseAlphabet = 
      alphabets.filter(char => char.toLowerCase() === char)
               .sort((a, b) => b.localeCompare(a))[0] || null;

    let fileValid = false;
    let fileMimeType = null;
    let fileSizeKb = null;

    if (file_b64) {
      try {
        const buffer = Buffer.from(file_b64, 'base64');
        fileValid = true;
        fileMimeType = mime.lookup(buffer) || "application/octet-stream";
        fileSizeKb = (buffer.length / 1024).toFixed(2);
      } catch (error) {
        console.error("Error processing file:", error);
        fileValid = false;
      }
    }

    const response = {
      is_success: true,
      user_id: "syam_karni_datta_uppalapti_23082003",
      email: "ud9211@srmist.edu.in",
      roll_number: "RA2111030010270",
      numbers,
      alphabets,
      highest_lowercase_alphabet: highestLowercaseAlphabet ? [highestLowercaseAlphabet] : [],
      file_valid: fileValid,
    };

    if (fileValid) {
      response.file_mime_type = fileMimeType;
      response.file_size_kb = fileSizeKb;
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ is_success: false, error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});