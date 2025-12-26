import handleAsyncError from "../middleware/handleAsyncerror.js";
import User from "../models/userModel.js";
 
export const registeruser = handleAsyncError (async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "this is temp id",
            url: "this is temp url"
        }
    });
    return res.status(201).json({
        success: true,
        user,
    });
});