import { NextFunction, Request, Response } from "express";
import userModel, { User }  from "./user.model";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import AuthenticatedRequest from "../../interfaces/AuthenticationRequest";
import mongoose from "mongoose";
import multer from "multer";

const registerUser = async (req: Request, res: Response) => {
    console.log(' req. body ', req.body);
    const { username, email, first_name, last_name, mobile_no, password, dob, image, gender, is_active, is_approved } = req.body;
    try {
        if (!username || !mobile_no) {
            return res.status(200).json({ status: 1,message: 'Mobile No and Password is mandatory', user: '' });
        }
        const userAvailable: User | null = await userModel.findOne({ mobile_no });
        if (userAvailable) {
            return res.status(200).json({ status: 1, message: 'Mobile number already registered', user: '' });
        }
        const userData = {
            username,
            email: email || null,
            first_name,
            last_name,
            mobile_no,
            password,
            dob,
            image,
            gender,
            is_active: is_active || "active", // If is_active is not provided, set it to "active"
            is_approved: is_approved || 0     // If is_approved is not provided, set it to 0
        };
        if (password) {
            userData.password = await bcrypt.hash(password, 10);
        }
        const user: User = await userModel.create(userData);
        return res.status(200).json({ status: 0,message: 'Registration success', user });
    }
    catch (error: any) {
        return res.status(400).json({ status: 1,message: error.message })
    }
}

const loginUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(200).json({ status:1, message: "All Fields are mandatory",  loginData: '' });
    }
    console.log(' body.req, ', req.body);
    const mobile_no = username;
    const user: User | null = await userModel.findOne({ mobile_no });
    console.log(user, ' user ');
    if (user && (await bcrypt.compare(password, user.password!))) {
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                mobile_no: user.mobile_no,
                id: user.id
            }
        }, 'durai'
        // {expiresIn: '1m'}
        )
        const loginData = {user, token: accessToken};
        return res.status(200).json({ status: 0, loginData, message: 'Login success' });
    } else {
        return res.status(200).json({ status: 1, message: "Invalid credentials",  loginData: '' });
    }
}

const checkCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        const user: User | null = await userModel.findById(userId);
        res.status(200).json({ status: 0, user, message: 'Data fetched successfully' });
    } catch (error) {

        res.status(500).json({ status: 1, user: '', message: "Internal server error" });
    }
}

const getAllUser = async(req: Request, res: Response) => {
    const users: User[] = await userModel.find();
    res.status(200).json(users);
}

const updateUser = async (req: AuthenticatedRequest, res: Response) => {
    console.log('params ', req.params);
    console.log( ' body ', req.body);

    const { username, email, first_name, last_name, mobile_no, password, dob, gender, is_active, is_approved, role_id } = req.body;
    const user_id = req.user.id;
    try {
        const user = await userModel.findById(user_id);
        console.log( ' user ', user );
        if (!user) {
            return res.status(404).json({ status: 1, message: 'User not found', user: '' });
        }
        const existingUserMobile = await userModel.findOne({ mobile_no, _id: { $ne: user_id } });
        if (existingUserMobile) {
            return res.status(400).json({ status: 1, message: 'User Mobile Number already exists', user: '' });
        }
        const existingUserEmail = await userModel.findOne({ mobile_no, _id: { $ne: user_id } });
        if (existingUserEmail) {
            return res.status(400).json({ status: 1, message: 'User Email already exists', user: '' });
        }
        const userData : any = {};
        if (first_name) {
            userData.first_name = first_name;
        }
        if (last_name) {
            userData.last_name = last_name;
        }
        if (role_id) {
            userData.role_id = role_id;
        }
        if (username) {
            userData.username = username;
        }
        if (email) {
            userData.email = email;
        }
        if (dob) {
            userData.dob = dob;
        }
        if (gender) {
            userData.gender = gender
        }
        if (is_active) {
            userData.is_active = is_active;
        }
        if (is_approved) {
            userData.is_approved = is_approved;
        }
        if (req.file?.path) {
            userData.image = req.file?.path;
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            user_id,
            userData,
            { new: true, runValidators: true }
        );
        return res.status(200).json({ status: 0, message: 'User updated successfully', updatedUser });
        
    } catch (error: any) {
        return res.status(400).json({ status: 1,message: error.message, user: '' })
    }
}

const uploadProfileImage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        // Upload file logic
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, "./uploads/profile");
            },
            filename: function (req, file, cb) {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, uniqueSuffix + file.originalname);
            }
        });

        const uploadProfileImg = multer({ storage: storage }).single("image");
        uploadProfileImg(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json({ status: 1, message: 'Error uploading file', user: '' });
            } else if (err) {
                return res.status(500).json({ status: 1, message: err.message, user: '' });
            }
            next();
        });
    }
    catch (error: any) {
        return res.status(500).json({ status: 1, message: error.message, user: '' });
    }
}

export { registerUser,  loginUser, checkCurrentUser, getAllUser, updateUser, uploadProfileImage };