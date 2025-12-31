import expresss from "express";
import cookieParser from "cookie-parser";
import cors from "cors";



const app = expresss();

app.use(cors({
    origin:process.env.CORS.ORIGIN,
    Credentials:true
}));
app.use(expresss.json({limit:"16kb"}));
app.use(expresss.urlencoded({extended:true , limit:"16kb"}));
app.use(expresss.static("public"));
app.use(cookieParser());




export default app;