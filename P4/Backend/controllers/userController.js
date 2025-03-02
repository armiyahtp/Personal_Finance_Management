import User from "../models/UserSchema.js";

export const registerControllers = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter all fields",
            });
        }

        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists",
            });
        }

        // ✅ No manual hashing needed (Mongoose will handle it)
        const newUser = new User({ name, email, password });
        await newUser.save();

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: { id: newUser._id, name: newUser.name, email: newUser.email },
        });
    } catch (err) {
        console.error("❌ Registration Error:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Internal Server Error",
        });
    }
};



export const loginControllers = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter all fields",
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        // ✅ Compare passwords using Mongoose method
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Incorrect email or password",
            });
        }

        const { password: _, ...userData } = user.toObject();

        return res.status(200).json({
            success: true,
            message: `Welcome back, ${user.name}`,
            user: userData,
        });
    } catch (err) {
        console.error("❌ Login Error:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Internal Server Error",
        });
    }
};


export const allUsers = async (req, res, next) => {
    try{
        const user = await User.find({_id: {$ne: req.params.id}}).select([
            "email",
            "username",
            "avatarImage",
            "_id",
        ]);

        return res.json(user);
    }
    catch(err){
        next(err);
    }
}