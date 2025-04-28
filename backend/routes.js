const state = require("./state");
const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv").config();
const cors = require("cors");
const router = express.Router();

router.use(cors());
router.use(express.json());

router.post("/getTURNCredentials", async (req, res) => {
  const ttl = 86400;
  const response = await axios.post(
    dotenv.parsed.API_TURN_URL,
    { ttl },
    {
      headers: {
        Authorization: `Bearer ${dotenv.parsed.API_TURN_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  const { data } = response;
  res.json(data);
});

router.post("/verifyPassword", (req, res) => {
  const { password, roomId } = req.body;

  const room = state.activeGroupCalls.find((group) => group.roomId === roomId);
  if (!room) {
    res.json({ verified: false });
  }

  if (room.groupPassword === password) {
    res.json({ verified: true });
  } else {
    res.json({ verified: false });
  }
});

router.post("/isCallPossible", (req, res) => {
  const { roomId } = req.body;

  const room = state.activeGroupCalls.find((group) => group.roomId === roomId);

  if (room.users.length + 1 >= 4) {
    res.json({ possible: false });
  } else {
    res.json({ possible: true });
  }
});

module.exports = router;

router.get("/getGroupPeerIds", (req, res) => {
  const roomId = req.query.roomId;
  const allGroups = state.activeGroupCalls;

  const group = allGroups.find((group) => group.roomId === roomId);
  console.log("GROUP");
  console.log(group);

  const usersIds = [];
  group.users?.forEach((user) => usersIds.push(user.peerId));
  const hostPeerId = group.peerId;
  const ids = [...usersIds, hostPeerId];
  console.log(ids)

  res.json({ ids });
});
