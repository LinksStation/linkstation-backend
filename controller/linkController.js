import Link from "../model/link.js";
import User from "../model/user.js";

export const create = async (req, res) => {
  const { id } = req.params;
  const { title, address } = req.body;
  const link = await Link.create({
    title,
    address,
    user: id,
  });

  await link.save();

  const userById = await User.findById(id);
  console.log("found user:", userById);

  userById.links.push(link);
  await userById.save();

  return res.send(userById);
};

export const userByLink = async (req, res) => {
  const { id } = req.params;
  const userByLink = await Link.findById(id).populate("user");
  res.send(userByLink);
};
