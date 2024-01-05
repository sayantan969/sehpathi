import express from "express";
import multer from "multer";
const router = express.Router()

router.get("/dasboard/notes",(req,res)=>
{
    res.render("notes1.ejs")
}
)




export default router;