import { sample_users } from "../data";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { User, UserModel, UserSchema } from "../models/user.model";
import bcrypt from "bcryptjs";
import { Router } from "express";
import { BAD_REQUEST } from "../constants/http_status";
const router = Router();

//run this when first connect to database
//to seed the user infomation to the database
router.get("/seed", asyncHandler(
    async(req, res) => {

      //check if there is any user in the database
      const usersCount = await UserModel.countDocuments();
      //if yes send
      if(usersCount > 0){
        res.send("Seed is already done!");
      }
    
      //if no take the data from data.js then inport it to the database
      await UserModel.create(sample_users);
      // const encryptedPassword = await bcrypt.hash(sample_users.password, 10);
      res.send("Seed Is Done!");
    }
))

//login users
router.post("/login", asyncHandler(
  async (req, res) => {
    const {email, password} = req.body;  
    const user = await UserModel.findOne({email});
    if (user && password === user.password || 
      user && (await bcrypt.compare(password, user.password)) ) {
      res.send(generateTokenResponse(user));
     }
   
     else{
       res.status(BAD_REQUEST).send("Username or password is invalid!");
     }
  
  }
))

//get user by id
router.get("/:userId", asyncHandler(
  async (req, res) => {
    const user = await UserModel.findById(req.params.userId);
    res.send(user);
  }
))

//working on it
router.put('/update/:userId', asyncHandler(
    async (req, res) => {
        
      const {name, email, address} = req.body;
      const user = await UserModel.findById(req.params.userId);
    
      // const updateUser : UpdateUser = {
      //   name: name,
      //   email: email.toLowerCase(),
      //   address: address
      // }
      const UpdateUser = await UserModel.findByIdAndUpdate(req.params.userId,
         {name: name, email: email, address: address}, async () => {
          if (!user) {
            res.send("Update Successfully");
            }
          else{
            res.status(BAD_REQUEST).send("User Account Cannot Update");
          }
        });
    }
))

router.post('/register', asyncHandler(
    async (req, res) => {
      const {name, email, password, address} = req.body;
      const user = await UserModel.findOne({email});
      if(user){
        res.status(BAD_REQUEST)
        .send('User is already exist, please login!');
        return;
      }
  
      const encryptedPassword = await bcrypt.hash(password, 10);
  
      const newUser:User = {
        id:'',
        name,
        email: email.toLowerCase(),
        password: encryptedPassword,
        address,
        isAdmin: false
      }
  
      const dbUser = await UserModel.create(newUser);
      res.send(generateTokenResponse(dbUser));
    }
  ))

  


const generateTokenResponse = (user: User) => {
    const token = jwt.sign({
        id: user.id, email:user.email, isAdmin: user.isAdmin
    }, process.env.JWT_SECRET!, {
        expiresIn: "30d"
    });

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        address: user.address,
        isAdmin: user.isAdmin,
        token: token
      };
}

export default router; 