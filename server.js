const express= require('express');
const app=express();
require('dotenv').config();
const mongoose=require('mongoose');
//view engine
app.set('view engine','ejs');
app.use(express.urlencoded({extended:false}));


const PORT =process.env.PORT ||5002;
const shortUrl=require('./models/shortUrls');

//connect to mongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('connected to MongoDB'))
.catch((err)=>console.log('MongoDB connection error:',err))

// app.get('/', (req,res) =>res.send('Server & DB ready!'))

//requests
app.get('/', async(req,res) =>{
    const shortUrls = await shortUrl.find();
    res.render('index',{shortUrls:shortUrls});

});

app.post('/shortUrls',async(req,res) =>
{await shortUrl.create({full: req.body.fullUrl})
res.redirect('/')});

app.get('/:shortUrl',async(req,res) =>{
    const foundShortUrl=await shortUrl.findOne({short:req.params.shortUrl})
    if (foundShortUrl == null) return res.sendStatus(404);
    foundShortUrl.clicks++;
    foundShortUrl.save();
    res.redirect(foundShortUrl.full);
})

app.listen(PORT,() =>{
    console.log(`Server is running on http://localhost:${PORT}`);
});