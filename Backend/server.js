require("dotenv").config()
const cors=require("cors")
const app=require("./src/app")

const connectDB=require("./src/config/db")
connectDB()
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
console.log(process.env.EMAIL_USER);
console.log(process.env.REFRESH_TOKEN?.slice(0, 20));
app.listen("3000",()=>{
    console.log("server is runing on port 3000");
    
})