const legoData = require("./modules/legoSets");
const path = require("path");

const express = require('express');
const app = express();

app.set('view engine', 'ejs');

const HTTP_PORT = process.env.PORT || 8080;

//app.use(express.static('public'));
app.use(express.static(__dirname + '/public')); //Vercel
app.set('views', __dirname + '/views');


app.get('/', (req, res) => {
  //res.sendFile(path.join(__dirname, "/views/home.html"));
  res.render('home');
});

app.get('/about', (req, res) => {
  //res.sendFile(path.join(__dirname, "/views/about.html"));
  res.render('about');
});

app.get("/lego/sets", async (req,res)=>{
  let sets = [];
  try{
    if(req.query.theme){
      sets = await legoData.getSetsByTheme(req.query.theme);
      //res.send(sets);
    }else{
      sets = await legoData.getAllSets();
      //res.send(sets);
    }
    res.render('sets', {sets: sets});
  }catch(err){
    //res.status(404).send(err);
    res.status(404).render('404',{message: err});
  }

});

app.get("/lego/sets/:num", async (req,res)=>{
  try{
    let set = await legoData.getSetByNum(req.params.num);
    //res.send(set);
    res.render("set", {set: set});
  }catch(err){
    //res.status(404).send(err);
    res.status(404).render('404',{message: err});
  }
});

app.use((req, res, next) => {
  //res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
  res.status(404).render('404', {message: "I'm sorry, we're unable to find what you're looking for"});
});


legoData.initialize().then(()=>{
  app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
});