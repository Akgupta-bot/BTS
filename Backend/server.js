require("dotenv").config()
const app=require("./src/app")

const connectDB=require("./src/config/db")
connectDB()
console.log(process.env.EMAIL_USER);
console.log(process.env.REFRESH_TOKEN?.slice(0, 20));
app.listen("3000",()=>{
    console.log("server is runing on port 3000");
    
})