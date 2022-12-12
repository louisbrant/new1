import { Users } from "../models/sign";

export const signup = async (req, res, next) => {
  let userData = req.body.data;
  userData.permission = "user";
  userData.note = "";
  userData.date = new Date().valueOf();
  userData.credit = "0";
  userData.status = "in-active";
  userData.profile = "";
  const user = await Users.findOne({ email: userData.email });
  if (!user) {
    const newUser = new Users(userData);
    const result = await newUser.save();
    if (!result) {
      return res.json({ status: false, data: "Interanal server error" });
    } else {
      return res.json({ status: true, data: result });
    }
  } else {
    return res.json({ status: true, data: "already exist" });
  }
};

export const signin = async (req, res, next) => {
  const { mail, pass } = req.body.data;
  const user = await Users.findOne({ email: mail });
  if (user !== null) {
    if (user.password === pass) {
      res.send(user.permission);
    } else {
      res.send("password");
    }
  } else {
    res.send("not exist");
  }
};

export const getUserData = async (req, res, next) => {
  const result = await Users.find({});
  res.send(result);
};

export const updateNote = async (req, res, next) => {
  await Users.updateOne(
    { _id: req.body.data._id },
    { note: req.body.data.note }
  );
  res.send("success");
};

export const updatestatus = async (req, res, next) => {
  await Users.updateOne(
    {
      _id: req.body.data._id,
    },
    { status: req.body.data.status }
  );
  res.send("success");
};

export const deleteUser = async (req, res, next) => {
  await Users.remove({ _id: req.body._id });
  res.send("success");
};

export const addCredit = async (req, res, next) => {
  let credit = await Users.find({ _id: req.body.data._id });
  let updateCredit = Number(credit[0].credit) + Number(req.body.data.credit);
  await Users.updateOne({ _id: req.body.data._id }, { credit: updateCredit });
  res.send("success");
};
