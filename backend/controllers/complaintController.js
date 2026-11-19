
import Complaint from "../models/Complaint.js";

// ==========================================
// CREATE NEW COMPLAINT
// ==========================================
export const createComplaint = async (req, res) => {
  try {
    const { title, category, description } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({
        message: "Please complete all complaint fields"
      });
    }

    const complaint = await Complaint.create({
      student: req.user._id,
      title,
      category,
      description,
      attachment: req.file
        ? `/uploads/${req.file.filename}`
        : "",
      history: [
        {
          status: "Pending",
          note: "Complaint submitted",
          updatedBy: req.user._id,
          at: new Date()
        }
      ]
    });

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// ==========================================
// GET LOGGED-IN STUDENT COMPLAINTS
// ==========================================
export const myComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      student: req.user._id
    }).sort({ createdAt: -1 });

    res.json({ complaints });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// ==========================================
// GET COMPLAINT DETAILS
// ==========================================
export const getComplaintDetails = async (req, res) => {
  try {
    const complaint = await Complaint.findById(
      req.params.id
    )
      .populate("student", "name email studentId department")
      .populate("history.updatedBy", "name role");

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found"
      });
    }

    // Students can only view their own complaints
    if (
      req.user.role !== "admin" &&
      String(complaint.student._id) !== String(req.user._id)
    ) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    res.json({ complaint });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// ==========================================
// GET ALL COMPLAINTS (ADMIN)
// ==========================================
export const getAllComplaints = async (req, res) => {
  try {
    const { status, search } = req.query;

    const filter = {};

    if (status && status !== "All") {
      filter.status = status;
    }

    let complaints = await Complaint.find(filter)
      .populate("student", "name email studentId department")
      .sort({ createdAt: -1 });

    if (search) {
      const keyword = search.toLowerCase();

      complaints = complaints.filter((complaint) =>
        complaint.title.toLowerCase().includes(keyword) ||
        complaint.student?.name?.toLowerCase().includes(keyword)
      );
    }

    res.json({ complaints });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// ==========================================
// UPDATE COMPLAINT STATUS (ADMIN)
// ==========================================
export const updateComplaintStatus = async (req, res) => {
  try {
    const { status, adminRemarks = "" } = req.body;

    const allowedStatuses = [
      "Pending",
      "In Progress",
      "Resolved",
      "Rejected"
    ];

    // Validate status
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid complaint status"
      });
    }

    // Find complaint
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found"
      });
    }

    const previousStatus = complaint.status;
    const remarks = String(adminRemarks).trim();

    // Update complaint information
    complaint.status = status;
    complaint.adminRemarks = remarks;

    // Add history only when status changes
    if (previousStatus !== status) {
      complaint.history.push({
        status: status,
        note: remarks || `Status changed from ${previousStatus} to ${status}`,
        updatedBy: req.user._id,
        at: new Date()
      });
    }

    await complaint.save();

    // Return updated complaint
    const updatedComplaint = await Complaint.findById(
      complaint._id
    )
      .populate("student", "name email studentId department")
      .populate("history.updatedBy", "name role");

    res.json({
      message: "Complaint status updated successfully",
      complaint: updatedComplaint
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
