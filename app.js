const express=require("express");
const dotenv=require("dotenv")
const app=express();
const cookieParser=require("cookie-parser")
app.use("/uploads", express.static("uploads"));


const indexRouter=require("./routes/index.routes")
dotenv.config();
const connectToDb=require("./confiq/db")
connectToDb();

app.use(express.urlencoded({extended: true}));
app.use(express.json())

const router=require("./routes/user.routes")
app.set("view engine","ejs")
app.use(cookieParser())

app.use("/user",router);
app.use("/index", indexRouter);


app.listen(3000)