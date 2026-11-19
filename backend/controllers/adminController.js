
import User from "../models/User.js";
import Complaint from "../models/Complaint.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [
      total,
      pending,
      inProgress,
      resolved,
      rejected,
      students
    ] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: "Pending" }),
      Complaint.countDocuments({ status: "In Progress" }),
      Complaint.countDocuments({ status: "Resolved" }),
      Complaint.countDocuments({ status: "Rejected" }),
      User.countDocuments({ role: "student" })
    ]);

    res.json({
      stats: {
        total,
        pending,
        inProgress,
        resolved,
        rejected,
        students
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
