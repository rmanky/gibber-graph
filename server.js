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
  dataCollection.insertOne(req.body)
   .then(dbresponse =>{
    res.json(dbresponse.ops)
    
    next();
  })
})


app.post("/load", (req, res) => {
  //console.log("send event");
  let fromClient = req.body;
  fromClient.username = req.session.login;
  dataCollection
    .find({ username: fromClient.username })
    .toArray()
    .then((r) => {
      res.json(r);
      //console.log(r);
    }); //send table
});






// app.use((req, res, next) => {
//   if (connection !== null) {
//     next();
//   } else {
//     res.status(503).send();
//     console.log("503"); //no database
//   }
// });

//----------MONGO----------
/**
//----------POST METHODS----------
app.post("/add", (req, res) => {
  let fromClient = req.body;
  fromClient.username = req.session.login;
  dataCollection
    .find({ username: fromClient.username })
    .toArray()
    .then((arr) => {
      if (arr.some((row) => row.route === req.body.route)) {
        console.log("sending not adding :/");
      } else {
        dataCollection.insertOne(fromClient).then((result) => {
          //console.log(result.ops[0]);
          dataCollection
            .find({ username: fromClient.username })
            .toArray()
            .then((r) => res.json(r)); //send table
        });
      }
    });
});

app.post("/update", (req, res) => {
  let fromClient = req.body;
  fromClient.username = req.session.login;
  dataCollection
    .find({ username: fromClient.username })
    .toArray()
    .then((arr) => {
      if (!arr.some((row) => row.route === req.body.route)) {
        console.log("nothing to delete :/");
      } else {
        dataCollection
          .updateMany(
            {
              //going to delete something
              _id: mongodb.ObjectID(
                arr.find((record) => record.route === req.body.route)._id //find the first record in array and get id
              ),
            },
            {
              $set: {
                //set multiple fields
                time: req.body.time,
                distance: req.body.distance,
                fitness: req.body.fitness,
              },
            }
          )
          .then((result) => {
            dataCollection
              .find({ username: fromClient.username })
              .toArray()
              .then((r) => res.json(r)); //send updated table
          });
      }
    });
});

app.post("/delete", (req, res) => {
  let fromClient = req.body;
  fromClient.username = req.session.login;
  dataCollection
    .find({ username: fromClient.username })
    .toArray()
    .then((arr) => {
      if (!arr.some((row) => row.route === req.body.route)) {
        console.log("nothing to delete :/");
      } else {
        dataCollection
          .deleteOne({
            //going to delete something
            _id: mongodb.ObjectID(
              arr.find((record) => record.route === req.body.route)._id //find the first record in array and get id
            ),
          })
          .then((result) => {
            dataCollection
              .find({ username: fromClient.username })
              .toArray()
              .then((r) => res.json(r)); //send table
          });
      }
    });
});

app.post("/load", (req, res) => {
  //console.log("send event");
  let fromClient = req.body;
  fromClient.username = req.session.login;
  dataCollection
    .find({ username: fromClient.username })
    .toArray()
    .then((r) => {
      res.json(r);
      //console.log(r);
    }); //send table
});

//----------POST METHODS----------
**/

// app.get("/home", (req, res) => {
//   if (req.session.login) {
//     res.sendFile(__dirname + "/public/home.html"); //send login page on default
//     console.log("home page event"); //log as page event when we send default page
//   } else {
//     res.sendFile(__dirname + "/public/login.html");
//     console.log("unauthorized login attempt");
//   }
// });

// app.get("/", (_, response) => {
//   response.sendfile(__dirname + "/dist/index.html");
// });

const listener = app.listen(process.env.PORT, function() {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
