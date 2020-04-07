const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/journalDB', {
  useNewUrlParser: true
});

const authorSchema = new mongoose.Schema({
  username: String,
  name: String,
  password: String,
});

const journalSchema = new mongoose.Schema({
  title: String,
  authorId: String,
});

const entrySchema = new mongoose.Schema({
  date: Date,
  body: String,
  imagePath: String,
  journalId: String,
});

const Entry = mongoose.model('Entry', entrySchema);
const Journal = mongoose.model('Journal', journalSchema);
const Author = mongoose.model('Author', authorSchema);

const multer = require('multer')
const upload = multer({
  dest: '../front-end/public/images/',
  limits: {
    fileSize: 10000000
  }
});

// Upload a photo. Uses the multer middleware for the upload and then returns
// the path where the photo is stored in the file system.
app.post('/api/photos', upload.single('photo'), async (req, res) => {
  // Just a safety check
  if (!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    path: "/images/" + req.file.filename
  });
});

app.post('/api/author/login', async (req, res) => {
  console.log('handling POST author/login');
  console.log(req.body);
  try {
    const authors = await Author.find({'username': req.body.username, 'password': req.body.password}).select('username name _id');
    console.log(authors);
    if(authors.length == 1) {
      res.send(authors[0]);
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Create a new authorSchema
app.post('/api/author', async (req, res) => {
  console.log('handling POST author');
  console.log('Body');
  console.log(req.body);
  try {
    const author = new Author({
      username: req.body.username,
      name: req.body.name,
      password: req.body.password,
    });
    console.log(author);

    await author.save();
    res.send(author);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Create a new journal
app.post('/api/journal', async (req, res) => {
  try {
    const journal = new Journal({
      authorId: req.body.authorId,
      title: req.body.title,
    });

    await journal.save();
    res.send(journal);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Post a new journal entry
app.post('/api/entry', async (req, res) => {
  try {
    const entry = new Entry({
      date: req.body.date,
      body: req.body.body,
      imagePath: req.body.imagePath,
      journalId: req.body.journalId,
    });

    await entry.save();
    res.send(entry);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Get a list of journals for an author
app.get('/api/journal/:id', async (req, res) => {
  try {
    let journals = await Journal.find().where('authorId').equals(req.params.id);
    res.send(journals);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Get a list of entries in a journal
app.get('/api/entry/:id', async (req, res) => {
  try {
    let entry = await Entry.find().where('journalId').equals(req.params.id);
    res.send(entry);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


//Delete an entry
app.delete('/api/entry/:id', async (req, res) => {
  try {
    await Entry.deleteOne({_id:req.params.id});
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Delete a journal
app.delete('/api/journal/:id', async (req, res) => {
  try {
    let journal = Journal.findOne({_id:req.params.id});
    //Delete all entries associated with that journal
    let entries = await Entry.find().where('journalId').equals(req.params.id);
    entries.forEach(entry => Entry.deleteOne({_id:entry._id}));
    await Journal.deleteOne({_id:req.params.id});
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Delete an author
app.delete('/api/author/:id', async (req, res) => {
  try {
    let author = await Author.findOne({_id:req.params.id});

    let journals = await Journal.find().where('authorId').equals(author._id);

    journals.forEach(async journal => {
      //Delete all entries associated with that journal
      let entries = await Entry.find().where('journalId').equals(journal._id);
      entries.forEach(entry => entry.delete());
      journal.delete();
    });

    await author.delete();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Update an entry
//NOTE: the date of an entry cannot be modified because it is the date the entry was created
app.put('/api/entry/:id', async (req, res) => {
  try {
    let item = await Entry.findOne({_id:req.params.id});
    item.body = req.body.body;
    item.imagePath = req.body.imagePath;
    item.journalId = req.body.journalId;
    await item.save();
    res.send(item);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Update a journal
//NOTE: The author of a journal cannot be changed because it is the user who owns it
app.put('/api/journal/:id', async (req, res) => {
  try {
    let item = await Journal.findOne({_id:req.params.id});
    item.title = req.body.title;
    await item.save();
    res.send(item);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Update an author
app.put('/api/author/:id', async (req, res) => {
  try {
    let item = await Author.findOne({_id:req.params.id});
    item.username = req.body.username;
    item.name = req.body.name;
    item.password = req.body.password;
    item.imagePath = req.body.imagePath;
    item.save();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log('Server listening on port 3000!'));
