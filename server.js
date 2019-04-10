const express = require('express')
const app = express()
var port = 8000

app.set('views', __dirname + '/views')
app.use(express.static(__dirname + "/public/dist/public")) //MUST point the server to the Angular folder
app.set('view engine', 'ejs')

const bodyParser = require('body-parser') //to handle http post requests => accessible through req.body
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

const path = require('path')

const request = require('request')
var cookieSession = require('cookie-session')

app.use(cookieSession({
  name:'session',
  keys: ['y,(mPga(8kN'],
  maxAge: 60000000
}))


const bcrypt = require('bcryptjs')
var salt = bcrypt.genSaltSync(10)


const Sequelize = require('sequelize')
const sequelize = new Sequelize('JobTracker', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
}) 

var User = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER, 
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING, 
        allowNull: false,
        validate: {
          isEmail: true
        }
    },
    password: {
        type: Sequelize.STRING, 
        allowNull: false
    },
    firstName: {
        type: Sequelize.STRING, allowNull: false
    },
    lastName: {
        type: Sequelize.STRING, allowNull: false
    },
    createdAt: {
        type: Sequelize.DATE, defaultValue: Sequelize.NOW
    }
  },
  {
    timestamps: false,
})

var Job = sequelize.define('jobs', {
    id: {
        type: Sequelize.INTEGER, 
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.STRING, allowNull: false
    },
    company: {
        type: Sequelize.STRING, allowNull: false
    },
    logo: {
        type: Sequelize.STRING
    },
    datePosted: {
        type: Sequelize.STRING
    },
    type: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.TEXT
    },
    howToApply: {
        type: Sequelize.TEXT
    },
    url: {
        type: Sequelize.STRING
    },
    location: {
        type: Sequelize.STRING
    },
    status: {
        type: Sequelize.STRING,
        defaultValue: 'Interested'
    },
    contactName: {
        type: Sequelize.STRING,
    },
    contactPosition: {
        type: Sequelize.STRING,
    },
    contactEmail: {
        type: Sequelize.STRING,
    },
    salaryRange: {
        type: Sequelize.INTEGER,
    },
    performanceBonus: {
        type: Sequelize.BOOLEAN,
    },
    stockCompensation: {
        type: Sequelize.BOOLEAN,
    },
    health: {
        type: Sequelize.BOOLEAN,
    },
    dental: {
        type: Sequelize.BOOLEAN,
    },
    vision: {
        type: Sequelize.BOOLEAN,
    },
    K: {
        type: Sequelize.BOOLEAN,
    },
    lifeInsurance: {
        type: Sequelize.BOOLEAN,
    },
    commuterStipend: {
        type: Sequelize.BOOLEAN,
    },
    cateredLunch: {
        type: Sequelize.BOOLEAN,
    },
    gymStipend: {
        type: Sequelize.BOOLEAN,
    },
    phoneStipend: {
        type: Sequelize.BOOLEAN,
    },
    createdAt: {
        type: Sequelize.DATE, defaultValue: Sequelize.NOW
    },
    updatedAt: {
        type: Sequelize.DATE, defaultValue: Sequelize.NOW
    }
  },
  {
    timestamps: true,
})

User.hasMany(Job);
Job.belongsTo(User, {foreighKey: 'userId'});


app.post('/registerUser', (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(user =>{
    if (!user){
      
      bcrypt.hash(req.body.password, salt, (err, hash)=>{
        if (err) { 
            res.json( {status: 'Error hashing password: '+err} ) 
        } else {
            var pw = hash
            User.create({
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email,
              password: pw
              
            }).then((result)=>{
              res.json({status: "success"})
              req.session.id = result.id
              console.log("Successfully registered user. Session ID: "+req.session.id)
            })
            }
        }) 
    }
    else {
      res.json({status: 'duplicate'})
    }
  })
})

app.post('/addFavJob', (req, res) => {
  console.log('Adding job to favorites. Session ID: '+req.session.id)
  Job.create({...req.body, userId: req.session.id}).then((result) => res.json ({job: result}))
})

app.get('/getFavorites', (req, res) => {
  console.log('Getting favorites. Session ID: '+req.session.id)
  Job.findAll({
    where: {
      userId: req.session.id
    }
  })
  .then((result)=>{
    res.json({data: result})

  })
})
  

app.post('/loginUser', (req, res) =>{
  User.findOne({
    where: {
      email: req.body.email
    }
  })
  .then(user =>{
    bcrypt.compare(req.body.password, user.password, (err) =>{
      if(err){
        res.json({status: 'failure'})
      }
      else { 
        req.session.id = user.id
        console.log("Session: "+ req.session.id)
        res.json({status: 'success'}) 
      }
    })
  })
  .catch(err =>{
    res.json({status: 'email not found'})
    })
})  

app.post('/jobSearch', (req, res) => {
  if(req.session.id == null){
    res.json({status: 'fail'})
  } else {
    request('https://jobs.github.com/positions.json?description='+req.body.keyWord+'&location='+req.body.location, (err, response, body)=>{
      res.send(body)
      console.log("Session: "+req.session.id)
    })
  }
})

app.delete('/deleteJob/:id', (req, res) =>{
  if(req.session.id == null){
    res.send('You must be logged in to delete a job')
  } else {
    Job.destroy({
      where: { 
        id: req.params.id,
        userId: req.session.id
      }
    })
    .then(status => {
      if(status == 1){
        res.json({status: 'Successfully deleted'})
      } else {
        res.json({status: 'Error deleting job'})
      }
    })
  }
})

app.put('/putJobDetails/:id', (req, res)=>{
  console.log(req.body)
  Job.update({
    status: req.body.status,
    contactName: req.body.contactName,
    contactPosition: req.body.contactPosition,
    contactEmail: req.body.contactEmail,
    salaryRange: req.body.salaryRange,
    performanceBonus: req.body.performanceBonus,
    stockCompensation: req.body.stockCompensation,
    health: req.body.health,
    dental: req.body.dental,
    vision: req.body.vision,
    K: req.body.K,
    lifeInsurance: req.body.lifeInsurance,
    commuterStipend: req.body.commuterStipend,
    cateredLunch: req.body.cateredLunch,
    gymStipend: req.body.gymStipend,
    phoneStipend: req.body.phoneStipend
  }, {where: {id: req.params.id}}).then(result => {
    res.send(result)
  })
})

app.post('/addNewJob', (req,res) =>{
  Job.create({...req.body, userId: req.session.id}).then((result) => res.json ({job: result}))
})

app.put('/putStatus', (req, res) => {
  Job.update({status: req.body.status}, {where: {id: req.body.id}}).then(result => {
    res.send(result)
  })
})

app.get('/getCompany/:id', (req, res) => {
  Job.findAll({
    where: {
      id: req.params.id
    }
  })
  .then((result)=>{
    res.json({data: result})
  })
})

app.get('/jobStatusChart', (req, res)=>{
  sequelize.query("SELECT status, count(status) as 'count' FROM JOBS GROUP BY status").then(([results, metadata])=>{
    let xAxis = []
    let yAxis = []
    for(let i = 0; i < results.length; i++){
      xAxis.push(results[i]['status'])
      yAxis.push(results[i]['count'])
    }
    res.json({xAxis, yAxis})
  })
})

app.get('/salaryChart', (req, res) => {
  Job.findAll({attributes: ['company', 'salaryRange']}).then(result => {
    let xAxis = []
    let yAxis = []
    for(var i = 0; i < result.length; i++){
      xAxis.push(result[i].company)
      yAxis.push(result[i].salaryRange/1000)
    }
    res.json({xAxis, yAxis})
  })
})

app.get('/jobsAddedChart', (req, res) => {
  sequelize.query("SELECT count(date_format(createdAt, '%m/%d')) as 'count', date_format(createdAt, '%m/%d') as 'date'  FROM JobTracker.jobs group by date_format(createdAt, '%m/%d')").then(([results, metadata])=> {
    let xAxis = []
    let yAxis = []
    for(var i = 0; i < results.length; i++){
      yAxis.push(results[i].count)
      xAxis.push(results[i].date)
    }
    res.json({xAxis, yAxis})
  })
})




app.get('/logOut', (req, res)=> {
  req.session = null
  res.redirect('/')
})
    
//if none of the routes match the ones in this file, use angular's routes
app.all("*", (req, res, next) => {
  res.sendFile(path.resolve('./public/dist/public/index.html'))
})
  

app.listen(port, () => console.log("listening on port: "+port))