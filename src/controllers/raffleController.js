import { Users, Raffles, WLRaffles, RafflesInfo, Winners } from "../models";

export const createUser = async (req, res, next) => {
  let userData = req.body;
  const { id } = req.body;
  const user = await Users.findOne({ userid: id });
  if (!user) {
    userData.userid = id;

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

export const updateUserWallet = async (req, res, next) => {
  const { walletAddress, userid } = req.body;
  const result = await Users.findOne({ userid });
  if (result) {
    if (result.walletAddress) {
      const isRight = result.walletAddress === walletAddress;
      return res.json({ status: true, isRight, data: result });
    } else {
      const result = await Users.findOneAndUpdate(
        { userid },
        { walletAddress }
      );
      if (!result) {
        return res.json({
          status: false,
          isRight,
          data: "Interanal server error",
        });
      } else {
        return res.json({ status: true, isRight: true, data: result });
      }
    }
  } else {
    return res.json({
      status: false,
      isRight: false,
      data: "This user is not exist.",
    });
  }
};

export const create = async (req, res, next) => {
  const raffleData = req.body;
  const { raffleId, isNFT } = raffleData;
  if (isNFT) {
    const raffle = await Raffles.find({ raffleId });
    if (raffle.length === 0) {
      let newRaffle = new Raffles(raffleData);

      const result = await newRaffle.save();
      if (!result) {
        return res.json({ status: false, data: "Internal server error" });
      } else {
        return res.json({ status: true, data: result });
      }
    } else {
      return res.json({ status: true, data: "already exist" });
    }
  } else {
    let newRaffle = new Raffles(raffleData);
    const result = await newRaffle.save();
    if (!result) {
      return res.json({ status: false, data: "Internal server error" });
    } else {
      return res.json({ status: true, data: result });
    }
  }
};

export const buy = async (req, res, next) => {
  const data = req.body;
  const { raffleId, userid, txHash, ticketNum } = data;
  const raffle = await RafflesInfo.findOne({ raffleId, userid });
  if (raffle) {
    if (txHash !== raffle.txHash) {
      const result = await RafflesInfo.findOneAndUpdate(
        { raffleId, userid },
        { ticketNum: raffle.ticketNum + Number(ticketNum), txHash }
      );
      return res.json({ status: true, data: result });
    } else {
      return res.json({ status: true, data: "already exist" });
    }
  } else {
    let newData = new RafflesInfo(data);
    const result = await newData.save();
    if (!result) {
      return res.json({ status: false, data: "Internal server error" });
    } else {
      return res.json({ status: true, data: result });
    }
  }
};

export const get = async (req, res, next) => {
  const openRaffles = await WLRaffles.aggregate([
    { $match: { isOpen: true } },
    {
      $lookup: {
        from: "rafflesinfos",
        localField: "_id",
        foreignField: "raffleId",
        as: "rafflesInfos",
      },
    },
  ]);
  const closedRaffles = await WLRaffles.aggregate([
    { $match: { isOpen: false } },
    {
      $lookup: {
        from: "rafflesinfos",
        localField: "_id",
        foreignField: "raffleId",
        as: "rafflesInfos",
      },
    },
  ]);
  res.send({ status: true, openRaffles, closedRaffles });
};

export const checkNFT = async (req, res, next) => {
  const { nftId } = req.body;
  const raffle = await Raffles.findOne({ nftId });
  if (raffle) {
    res.send({ status: false });
  } else {
    res.send({ status: true });
  }
};

export const getOpenRaffles = async () => {
  const openRaffles = await WLRaffles.aggregate([
    { $match: { isOpen: true } },
    {
      $lookup: {
        from: "rafflesinfos",
        localField: "_id",
        foreignField: "raffleId",
        as: "rafflesInfos",
      },
    },
  ]);
  return openRaffles;
};
// export const getOpenRaffles = async () => {
//   const openRaffles = await Raffles.aggregate([
//     { $match: { isOpen: true } },
//     {
//       $lookup: {
//         from: "rafflesinfos",
//         localField: "_id",
//         foreignField: "raffleId",
//         as: "rafflesInfos",
//       },
//     },
//   ]);
//   return openRaffles;
// };

const updateWinner = async (_id) => {
  const rr = await WLRaffles.findOneAndUpdate({ _id: _id }, { isOpen: false });
  return rr;
};

export const updateNFTWinner = async (raffleId, walletAddress) => {
  await updateWinner(raffleId);
  if ("No Winner" === walletAddress) {
    const rr = await Raffles.findOneAndUpdate(
      { _id: raffleId },
      { winner: walletAddress, isOpen: false }
    );
  } else {
    let userInfo = await RafflesInfo.findOne({ raffleId, walletAddress });
    const { username, ticketNum, userid } = userInfo;
    let newData = new Winners({
      raffleId,
      userid: userid,
      username,
      ticketNum,
    });
    await newData.save();
  }
};

export const updateWLwinners = async (_id, users) => {
  await updateWinner(_id);
  for (let i = 0; i < users.length; i++) {
    let userInfo = await RafflesInfo.findOne({ _id, userid: users[i] });
    const { username, ticketNum } = userInfo;
    let newData = new Winners({
      _id,
      userid: users[i],
      username,
      ticketNum,
    });
    await newData.save();
  }
};
export const getWinner = async (req, res, next) => {
  const { raffleId } = req.body;
  const winners = await Winners.find({ raffleId });
  return res.json({ status: true, winners });
};

export const newWL = async (req, res, next) => {
  const raffleData = JSON.parse(req.body.data);
  raffleData.image = req.files[0].filename;
  let newRaffle = new WLRaffles(raffleData);
  const result = await newRaffle.save();
  if (!result) {
    return res.json({ status: false, data: "Internal server error" });
  } else {
    return res.json({ status: true, data: result });
  }
};

export const imageMulti = (req, res, next) => {
  let d = req.files;
  let row = {};
  for (let i in d) {
    row[d[i].fieldname] = d[i].filename;
  }
  req.images = row;
  next();
};
