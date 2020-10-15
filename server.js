//server script
const express = require("express"),
  bp = require("body-parser"),
  compression = require("compression"),
  passport = require("passport"),
  GitHubStrategy = require("passport-github").Strategy,
  cookieParser = require("cookie-parser"),
  session = require("express-session"),
  mongodb = require("mongodb"),
  app = express(); //start app

app.use(bp.json());
app.use(express.static("dist"));
app.use('/imgs', express.static("src/imgs"));

//**********OAuth**********

app.use(
  session({
    name: "session",
    secret: process.env.COOKIE_SECRET,
    saveUninitialized: true,
    resave: true
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: "https://gibber-graph.glitch.me/auth/github/callback"
    },
    async function(accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    }
  )
);

app.get("/auth/user", async (req, res) => {
  if (req.user) {
    return res.json(req.user);
  } else {
    return res.json({ failed: true });
  }
});

app.get("/auth/github", passport.authenticate("github"));

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  function(req, res) {
    req.session.login = req.user.username;
    res.redirect("/");
  }
);

app.get("/error", (req, res) => res.send("Login failed"));

app.get("/auth/logout", (request, response) => {
  request.logout();
  response.redirect("/");
});

//**********OAuth**********

//----------MONGO----------
let connection = null;
let UserData = null;
let dataCollection = null;

const uri =
  "mongodb+srv://" +
  process.env.USER +
  ":" +
  process.env.PASS +
  "@" +
  process.env.HOST +
  "/UserData" +
  process.env.DB;

const client = new mongodb.MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

client.connect().then(__connection => {
  // store reference to collection
  connection = __connection;
  UserData = connection.db("UserData");
  dataCollection = connection.db("UserData").collection("data");
});



app.post('/add',bp.json(), function(req,res,next){
  dataCollection = client.db("main").collection("gibber-graph");
  console.log(req.body.user);
  dataCollection.deleteMany( { "user" : req.body.user }, function(err, obj) {
    if (err) throw err;
    dataCollection.insertOne(req.body)
   .then(dbresponse =>{
    res.json(dbresponse.ops)
    console.log("Done adding")
    next();
  })
  });
})


app.post("/load",bp.json(), function(req,res,next){
  dataCollection.find({ user: req.body.user }).toArray(function(err, obj) {
    if (err) console.log("this didn't work");
     const allResults = obj
         res.writeHead( 200, { 'Content-Type': 'application/json'})
         res.write(JSON.stringify(allResults));
         res.end()
  })
});


const listener = app.listen(process.env.PORT, function() {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
