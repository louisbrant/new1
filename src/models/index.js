import { Schema, model } from "mongoose";

const rafflesSchema = new Schema({
  raffleId: { type: Number, require: true, default: -1 },
  name: { type: String, require: true },
  description: { type: String, require: true },
  nftContract: { type: String, require: true, default: "" },
  nftId: { type: String, require: true, default: "" },
  price: { type: Number, require: true },
  winner: { type: String, default: "1" },
  winnerNum: { type: Number, default: 0 },
  endDate: { type: String, require: true },
  imageLink: { type: String, require: true, default: "" },
  discordLink: { type: String, require: true },
  twitterLink: { type: String, require: true },
  isOpen: { type: Boolean, default: true },
  isNFT: { type: Boolean, default: false },
  isDuplicate: { type: Boolean, default: false },
});

export const Raffles = model("raffles", rafflesSchema);

const WlrafflesSchema = new Schema({
  name: { type: String, require: true },
  description: { type: String, require: true },
  price: { type: Number, require: true },
  supply: { type: Number, require: true },
  winner: { type: String, default: "1" },
  winnerNum: { type: Number, default: 0 },
  endDate: { type: String, require: true },
  image: { type: String, require: true, default: "" },
  tweeter: { type: String, require: false, default: "" },
  discord: { type: String, require: false, default: "" },
  isOpen: { type: Boolean, default: true },
  isDuplicate: { type: Boolean, default: false },
});

export const WLRaffles = model("Wlraffles", WlrafflesSchema);

const raffleInfoSchema = new Schema({
  txHash: { type: String, require: true },
  raffleId: { type: Schema.Types.ObjectId, require: true, ref: "raffles" },
  ticketNum: { type: Number, require: true },
  username: { type: String, require: true },
  userid: { type: String, require: true },
  walletAddress: { type: String, require: true },
});
export const RafflesInfo = model("rafflesinfos", raffleInfoSchema);

const WinnersSchema = new Schema({
  raffleId: { type: String, require: true },
  userid: { type: String, require: true },
  username: { type: String, require: true },
  ticketNum: { type: String, require: true },
});
export const Winners = model("winners", WinnersSchema);
