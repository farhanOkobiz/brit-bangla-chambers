import userSchema from "../models/userSchema.js";
import RequestForAdvocate from "../models/requestForAdvocateSchema.js";
import RequestService from "../models/requestServiceSchema.js";
import { Notification } from "../models/notificationSchema.js";
import clientSchema from "../models/clientSchema.js";
import { FileRequest } from "../models/fileRequestSchema.js";
import specializationSchema from "../models/specializationSchema.js";
import blogSchema from "../models/blogSchema.js";
import caseFileSchema from "../models/caseFileSchema.js";
import serviceSchema from "../models/serviceSchema.js";
import Staft from "../models/staffSchema.js";

const getAdminDashboardData = async (req, res) => {
  try {
    // Total number of users
    const totalUsers = await userSchema.countDocuments();
      // Total number of users
    const totalStaff = await Staft.countDocuments();
    // Total number of advocates
    const totalAdvocates = await userSchema.countDocuments({ role: "advocate" });
    // Total number of clients
    const totalClients = await clientSchema.countDocuments();
    // Total number of requests for advocate
    const totalRequestsForAdvocate = await RequestForAdvocate.countDocuments();
    // Total number of requests for service
    const totalRequestsForService = await RequestService.countDocuments();
    // Total number of file requests
    const totalFileRequests = await FileRequest.countDocuments();
    // Total number of blogs
    const totalBlogs = await blogSchema.countDocuments();
    // Total number of case files
    const totalCaseFiles = await caseFileSchema.countDocuments();
    // Total number of services
    const totalServices = await serviceSchema.countDocuments();
    // Total number of specializations
    const totalSpecializations = await specializationSchema.countDocuments();
    // Fetching recent notifications
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(5);

    return res.status(200).json({
      ok: true,
      totalUsers,
      totalStaff,
      totalAdvocates,
      totalClients,
      totalRequestsForAdvocate,
      totalRequestsForService,
      totalFileRequests,
      totalBlogs,
      totalCaseFiles,
      totalServices,
      totalSpecializations,
      notifications,
      message: "Admin dashboard data fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    return res.status(500).json({
      ok: false,
      message: "Failed to fetch admin dashboard data",
    });
  }
}

export {
    getAdminDashboardData,
}
