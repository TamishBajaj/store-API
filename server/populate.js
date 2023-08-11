// productsJson wali file se data ko databse me dynamically store karne ke liye use kia hai


require('dotenv').config()
const connectDB=require('./db/connect')
const Product=require('./models/product')
const jsonProduct=require('./products.json')

const start= async ()=>{
    try {
        await connectDB(process.env.MONGO_URI)
        await Product.deleteMany()             // optional step just did it so that nothing in database is there
 
        await Product.create(jsonProduct)
        console.log("sucess!!!")
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

start()