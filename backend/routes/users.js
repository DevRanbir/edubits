const express = require("express");
const router = express.Router();
const User = require("../models/User");

const protect = require("../middleware/authMiddleware");

router.get("/me/progress", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const progressObj = {};
    user.progress.forEach((val, key) => { progressObj[key] = val; });
    res.json({ progress: progressObj });
  } catch (err) {
    res.status(500).json({ error: "Request failed" });
  }
});

router.put("/me", protect, async (req, res) => {
  try {
    const update = {};
    if (typeof req.body.name === "string" && req.body.name.trim()) {
      update.name = req.body.name.trim().slice(0, 80);
    }
    if (typeof req.body.avatar === "string") {
      update.avatar = req.body.avatar;
    }
    if (typeof req.body.academicYear === "string") update.academicYear = req.body.academicYear.trim().slice(0, 40);
    if (typeof req.body.academicProgram === "string") update.academicProgram = req.body.academicProgram.trim().slice(0, 100);
    if (req.body.toolSettings && typeof req.body.toolSettings === "object" && !Array.isArray(req.body.toolSettings)) {
      update.toolSettings = req.body.toolSettings;
    }

    const user = await User.findByIdAndUpdate(req.user._id, update, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) return res.status(404).json({ error: "User not found" });

    // Same safe shape the auth endpoints return - never send the whole document
    res.json({
      user: {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        onboardingCompleted: user.onboardingCompleted,
        academicYear: user.academicYear,
        academicProgram: user.academicProgram,
        toolSettings: user.toolSettings,
      },
    });
  } catch (err) {
    res.status(400).json({ error: "Request failed" });
  }
});

router.get("/me/settings", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("toolSettings");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ settings: user.toolSettings || {} });
  } catch {
    res.status(500).json({ error: "Request failed" });
  }
});

router.put("/me/settings", protect, async (req, res) => {
  try {
    if (!req.body.settings || typeof req.body.settings !== "object" || Array.isArray(req.body.settings)) {
      return res.status(400).json({ error: "Settings must be an object" });
    }
    const settingsUpdate = Object.fromEntries(
      Object.entries(req.body.settings).map(([key, value]) => [`toolSettings.${key}`, value])
    );
    const user = await User.findByIdAndUpdate(req.user._id, { $set: settingsUpdate }, { new: true }).select("toolSettings");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ settings: user.toolSettings || {} });
  } catch {
    res.status(500).json({ error: "Request failed" });
  }
});

module.exports = router;
