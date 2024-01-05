import express from "express";
import mongoose from "mongoose";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from 'path';
import multer from "multer";
import fs from "fs";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());

const uri = 'mongodb+srv://:s@login.vlh86.mongodb.net/s=o?retryWrites=true&w=majority&tls=true&tlsInsecure=true';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  tlsInsecure: true,
};

const User = mongoose.model('User', new mongoose.Schema({
  user: String,
  email: String,
  phone_no: String,
  password: String,
  image: String
}));

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    file.originalname = req.body.email + path.extname(file.originalname);
    cb(null, file.originalname);
  },
  destination: (req, file, cb) => {
    cb(null, "public/images");
  }
});

const upload = multer({ storage: storage });

mongoose.connect(uri, options)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(error => console.error("Error connecting to MongoDB Atlas", error));

const __dirname = dirname(fileURLToPath(import.meta.url));

const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

async function passchk(req, res, next) {
  const { user, password } = req.body;

  try {
    const foundUser = await User.findOne({ user, password });

    if (foundUser) {
      console.log("hi");
      req.isAuthenticated = true;
    }

    next();
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname));

import jjRouter from "./jj.js";

app.get("/joinin", (req, res) => {
  res.render('join.ejs');
});

app.get("/", (req, res) => res.render('index'));
app.get("/contact", (req, res) => res.render('contact'));
app.get("/sign", (req, res) => res.render('signin'));
app.get('/webinfo', (req,res) => res.render('aboutweb'));
app.get("/dashboard", async (req, res) => {
  let user = req.cookies.user;
  console.log(user);
  try {
    if (user) {
      const userlog = await User.findOne({ user });
      if (userlog) {
        res.render('dashboard', { userData: userlog });
      } else {
        res.redirect('/sign');
      }
    } else {
      res.redirect('/sign');
    }
  } catch (e) {

  }
});

const storage1 = multer.diskStorage({
  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
  destination: (req, file, cb) => {
    cb(null, "public/note");
  }
});

const upload1 = multer({ storage: storage1 });

app.post("/submit", upload.single('image'), async (req, res) => {
  try {
    const { user, email, phone_no, password } = req.body;
    console.log(req.file);
    await User.create({
      user,
      email,
      phone_no,
      password,
      image: req.body.email + ".jpg"
    });

    res.redirect('/');
  } catch (e) {
    console.error("Error handling form submission", e);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/signin", passchk, (req, res) => {
  if (req.isAuthenticated) {
    res.cookie('user', req.body.user, { maxAge: 60 * 1000 * 60 * 24 * 30 });
    console.log("hiii");
    res.redirect("/dashboard");
  } else {
    res.redirect('/');
  }
});

app.get("/notes1", (req, res) => {
  res.render("notes1");
});

app.post('/upload', upload1.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = path.join(__dirname, 'public', 'note', req.file.filename);
  res.send(`File uploaded successfully. Path: ${filePath}`);
});

// Add this route to handle the GET request for fetching images
app.get('/getImages', (req, res) => {
  const imagesDirectory = path.join(__dirname, 'public', 'note');

  // Use fs module to read the files in the directory

  fs.readdir(imagesDirectory, (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Filter only image files (you can modify this based on your file types)
      const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));

      // Send the list of image files as a response
      res.json(imageFiles.map(file => `/note/${file}`));
    }
  });
});

app.listen(port, () => console.log('Server is running on port ' + port));
