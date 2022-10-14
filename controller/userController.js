import User from "../model/user.js";
import Crypto from "crypto";
import catchAsync from "../utils/catchAsync.js";

// exports.update = catchAsync(async (req, res) => {});

const linkByUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("links");

  res.send(user.links);
};

export default linkByUser;
