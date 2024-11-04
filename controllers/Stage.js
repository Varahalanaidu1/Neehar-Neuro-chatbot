const Stage = require("../models/Stage");

const fetchUsers = async (req, res) => {
    try {
        // Fetch stages with populated __user field
        const __stages = await Stage.find().populate("__user", "phone name").lean();

        // Initialize stages dictionary
        const stages = {
            "Book an Appointment": [],
            "View Prescription": [],
            "Other Services": []
        };

        // Organize the stages
        __stages.forEach(stage => {
            // Ensure the stage is valid (i.e., exists in stages keys)
            if (stages[stage.stage]) {
                stages[stage.stage].push(stage);
            }
        });

        // Send the successful response with the categorized stages
        res.json({
            success: true,
            message: "List of persons in each stage",
            stages
        });
    } catch (error) {
        // Handle any errors (e.g., database errors)
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching users",
            error: error.message
        });
    }
};

module.exports = {
    fetchUsers
};
