const express = require('express');
const router = express.Router();
const { verifyDaily } = require('./services/DailyPick');
const { getAllMonsters, getMonsters, addMonster, getMonster, deleteMonster, updateMonster } = require('./services/Monster');
const { guessMonster } = require('./services/GuessMonster');
const { login, signin } = require("./services/Auth");
const { getFamilies, addFamily, getFamily, deleteFamily, updateFamily } = require("./services/Family");
const { getSkills, getSkill, addSkill, deleteSkill, updateSkill } = require("./services/Skill");
const { getBuffs, getBuff, addBuff, deleteBuff, updateBuff } = require("./services/Buff");
const { getDebuffs, getDebuff, addDebuff, deleteDebuff, updateDebuff } = require("./services/Debuff");
const { affecter, desaffecter } = require("./services/Affectation");

router.get("/getAllMonsters", getAllMonsters);

router.post("/guessMonster", guessMonster);

router.get("/verifyDaily", verifyDaily);

router.post("/auth/login", login);

router.post("/auth/signin", signin);

// Admin Router :
// Router Family
router.get("/admin/families", getFamilies);
router.get("/admin/families/:id", getFamily);
router.post("/admin/families/add", addFamily);
router.put("/admin/families/:id", updateFamily);
router.delete("/admin/families/:id", deleteFamily);

// Router Monster
router.get("/admin/monsters", getMonsters);
router.get("/admin/monsters/:id", getMonster);
router.post("/admin/monsters/add", addMonster);
router.put("/admin/monsters/:id", updateMonster);
router.delete("/admin/monsters/:id", deleteMonster);

// Router Skill
router.get("/admin/skills", getSkills);
router.get("/admin/skills/:id", getSkill);
router.post("/admin/skills/add", addSkill);
router.put("/admin/skills/:id", updateSkill);
router.delete("/admin/skills/:id", deleteSkill);

// Router Buff
router.get("/admin/buffs", getBuffs);
router.get("/admin/buffs/:id", getBuff);
router.post("/admin/buffs/add", addBuff);
router.put("/admin/buffs/:id", updateBuff);
router.delete("/admin/buffs/:id", deleteBuff);

// Router Debuff
router.get("/admin/debuffs", getDebuffs);
router.get("/admin/debuffs/:id", getDebuff);
router.post("/admin/debuffs/add", addDebuff);
router.put("/admin/debuffs/:id", updateDebuff);
router.delete("/admin/debuffs/:id", deleteDebuff);

// Router Affectation
router.post("/admin/affecter", affecter);
router.post("/admin/desaffecter", desaffecter);

module.exports = router;