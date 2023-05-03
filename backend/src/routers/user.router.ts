import { sample_users } from "../data";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { User, UserModel, UserSchema } from "../models/user.model";
import bcrypt from "bcryptjs";
import { Router } from "express";
import { BAD_REQUEST } from "../constants/http_status";
const router = Router();

router.get("/seed", asyncHandler(
    async(req, res) => {
      const usersCount = await UserModel.countDocuments();
      if(usersCount > 0){
        res.send("Seed is already done!");
      }
    
      await UserModel.create(sample_users);
      // const encryptedPassword = await bcrypt.hash(sample_users.password, 10);
      res.send("Seed Is Done!");
    }
))

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

//working on it
router.get("/:id"), asyncHandler(
        async (req, res) => {
          // const {id} = req.body;
          const user = await UserModel.findById(req.params.id);
          res.send(user);
        })

//working on it
router.put('/update/:id', asyncHandler(
    async (req, res) => {
        
      const {name, email, address, id} = req.body;
      const user = await UserModel.findOne({id});
    
      // const updateUser : UpdateUser = {
      //   name: name,
      //   email: email.toLowerCase(),
      //   address: address
      // }
      await UserModel.findByIdAndUpdate({id: id},
         {name: name, email: email, address: address}, ()=> {
          if (!user) {
            return res.status(201).send({
               status: true,
               message: "User Account Updated Successfully!",
            });
          }
          else{
           return res.status(500).send({
               status: false,
               message: "User Account Cannot Update",
            });
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