import mongoose from 'mongoose';
import express, { NextFunction, Request, Response} from 'express';
import cors from 'cors';
import passport  from 'passport';
import passportLocal from 'passport-local';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './Modals/User';
import { DatabaseUserInterface, UserInterface } from './Interfaces/UserInterface';

dotenv.config() //When application starts it wraps everything from dot env files into varialbes 
// that can be used in our application

mongoose.connect(`mongodb+srv://aamir251:Aamir123@cluster0.h0dn7.mongodb.net/NodeTS?retryWrites=true&w=majority`,
    (err : Error) => {
        if (err) throw err
        console.log("Connected to Mongo");
    
})


// MiddleWares

const app = express()
// exress.json is so that we can read the request that is received from the client
app.use(express.json())

// cors url is localhost as it will be the location of our react app

app.use(cors({origin : "http://localhost:3000", credentials : true}))

// settngs for our passport application
app.use(
    session({
        secret : "secretcode",
        resave : true,
        saveUninitialized : true,
    })
)

app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())

const LocalStrategy = passportLocal.Strategy;
passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({username : username}, (err:Error, user : DatabaseUserInterface) => {
        if(err) throw err;
        if(!user) return done(null, false, { message : "User doesn't exist"});
        bcrypt.compare(password, user.password, (err, result : boolean) => {
            if(err) throw err;
            if(result) {
                return done(null, user);
            } else {
                return done(null, false)
            }
        });
    });
}));
passport.serializeUser((user:DatabaseUserInterface, callback) => {
    callback(null, user._id)
})

passport.deserializeUser((id:string, callback) => {
    // This deserialize takes the username, isAdmin and id of the current user and sets it to req.user
    User.findOne({_id : id}, (err: any, user : DatabaseUserInterface) => {
        const userInformation : UserInterface = {
            username : user.username,
            isAdmin : user.isAdmin,
            id : user._id
        };
        callback(err, userInformation)
    })
})

// IsAdmin Middleware

const isAdminMiddleware = (req : Request, res : Response, next : NextFunction) => {
    const { user } : any = req;
    if (user) {
        User.findOne({username : user?.username}, (err : Error, doc : DatabaseUserInterface) => {
            if (err) {
                throw err   
            }

            if (doc.isAdmin) {
                next()
            } else {
                res.send("Sorry you are not an admin")
            }
        })
    }

}

// Route to Register
app.post("/register", async (req:Request, res: Response) => {

    const { username, password } = req?.body;
    if (!username || !password || typeof username !== "string" || typeof password !== "string" ) {
        res.send("Improper Values");
        return
    }

    // Checking if user already exists

    User.findOne({username}, async (err : Error, doc: DatabaseUserInterface) => {
        if(err) throw err;
        if(doc) res.send("User Already Exists");
        if (!doc) {
            const hashedPassword = await bcrypt.hash(password, 10);
        
            const newUser = new User({
                username,
                password : hashedPassword
            });
                        
            await newUser.save()
            res.send("success")
        }
    })

})

app.post("/login", passport.authenticate("local"), (req, res) => {
    res.send(req.user)
})

app.get("/user", (req,res) => {
    console.log(req.user);
    
    res.send(req.user)
})

app.get("/logout", (req, res) => {
    req.logout();
    res.send("Logged Out Success")
})

// To get all users
app.get("/getallusers", isAdminMiddleware, async (req, res) => {

    await User.find({}, (err : Error, data : DatabaseUserInterface[] ) => {
        // we don't want to send hashed password of each user to frontend;
        // so we filter the data
        const filteredUsers : UserInterface[] = []
        
        data.forEach((item : DatabaseUserInterface) => {
            const userInformation = {
                id : item._id,
                username : item.username,
                isAdmin : item.isAdmin 
            }

            filteredUsers.push(userInformation);
        }) 
        res.send(filteredUsers)
    })
})

app.listen(4000, () => console.log("Server Started"))