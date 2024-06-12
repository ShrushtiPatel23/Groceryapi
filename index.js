const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require("dotenv").config()

const PORT = process.env.PORT || 8000

console.log(process.env.MONGODB_URL)
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URL).then(() => console.log('connect to database')).catch((err) => {
    console.log(err)
})

const app = express()
app.use(cors())
app.use(express.json({ limit: "10mb", extended: true }))
app.use(express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 }))

//schema
const userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type:String,
        unique:true
    },
    password: String,
    confirmPassword: String,
    image: String,
})
const userModel = mongoose.model("user",userSchema)


//product schema
const schemaProduct = mongoose.Schema({
  name:String,
  category: String,
  image: String,
  price: String,
  description: String
})
const productModel = mongoose.model("product", schemaProduct)



app.get('/', (req, res) => {
    res.send("server is running")
})

app.post('/signup', async (req, res) => {
    console.log(req.body)
    const {email} = req.body

    userModel.findOne({ email: email })
    .then((result) => {
      console.log(result);
      if (result) {
        res.send({ message: "Email id is already taken" ,alert:false});
      } else {
        const data = userModel(req.body);
        data.save();
        res.send({ message: "Registration success",alert:true});
      }
    })
    .catch((err) => console.log(err));
})

//login api
app.post('/login',(req,res)=> {
    console.log(req.body)
    const {email} = req.body
    userModel.findOne({email:email}).then((result)=> {
      if(result){
        console.log(result)
        const datasend = {
          _id: result._id,
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,
          image: result.image
        }
        res.send({message:'Successfully Login',alert:true,data:datasend})
        console.log(datasend)
      } else {
        res.send({message:"Email id is not registered",alert:false})
      }
    })
}),


//product api
app.post('/uploaddata',async (req,res) => {
  console.log(req.body)
  const data = await productModel(req.body)
  const dataSave = data.save();
  res.send({message:'upload successfully'})
})



app.get('/product',async (req,res) => {
  const data = await productModel.find({})
  console.log(data)
  res.send(JSON.stringify(data))
})
app.listen(PORT, () => console.log('server is running at port: ' + PORT));