import blogSchema from "../models/blogSchema.js";
import caseFileSchema from "../models/caseFileSchema.js";
import { FileRequest } from "../models/fileRequestSchema.js";
import { Notification } from "../models/notificationSchema.js";
import requestServiceSchema from "../models/requestServiceSchema.js";

const getInformation = async (req, res) => {
    try {
        // number of blogs of a advocate
        const userId = req.user.id;
        const blogs = await blogSchema.find({ user_id: userId }).countDocuments();
        // number of case files of a advocate
        const caseFiles = await caseFileSchema.find({ advocate_id: userId }).countDocuments();
        // number of file requests of a advocate
        const fileRequests = await FileRequest.find({ advocate_id: userId }).countDocuments();
        // Fetching recent notifications
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(5);
       // fetching Requests for Advocate
        const requests = await requestServiceSchema.find({ forwardedTo: userId })
            .populate("clientId", "full_name")
            .sort({ createdAt: -1 })
            .limit(5);



        return res.status(200).json({
            ok: true,
            blogs,
            caseFiles,
            fileRequests,
            notifications,
            requests,
            message: "Advocate information fetched successfully",
        });
    }
    catch (error) {
        console.error("Error fetching advocate information:", error);
        return res.status(500).json({
            ok: false,
            message: "Failed to fetch advocate information",
        });
    }
}

export { getInformation };
