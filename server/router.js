const express = require('express');
const router = express.Router();
const { verifyDaily } = require('./services/DailyPick');
const { getAllMonsters, getMonsters, addMonsterService, getMonster, deleteMonsterService, updateMonsterService } = require('./services/Monster');
const { guessMonster } = require('./services/GuessMonster');
const { login, signin } = require("./services/Auth");
const { getFamiliesService, addFamilyService, getFamilyService, deleteFamilyService, updateFamilyService } = require("./services/Family");
const { getSkills, getSkill, addSkillService, deleteSkillService, updateSkillService } = require("./services/Skill");
const { getBuffs, getBuff, addBuffService, deleteBuffService, updateBuffService } = require("./services/Buff");
const { getDebuffs, getDebuff, addDebuffService, deleteDebuffService, updateDebuffService } = require("./services/Debuff");
const { affecter, desaffecter } = require("./services/Affectation");
const { UserHasPermissionAdmin } = require('./services/User');
const { search } = require('./services/Search');
const { getImageService } = require('./services/Image');

// router.get("/getAllMonsters", getAllMonsters);

router.post("/guessMonster", guessMonster);

router.get("/verifyDaily", verifyDaily);

// Search Router :
router.get("/search", search);

// Image Router :
router.get("/image/:folder/:filename", getImageService);

// Auth Router :
router.post("/auth/login", login);
router.post("/auth/signin", signin);

// Admin Router :
// Router Family
router.get("/admin/families", UserHasPermissionAdmin, getFamiliesService);
router.get("/admin/families/:id", UserHasPermissionAdmin, getFamilyService);
router.post("/admin/families/add", UserHasPermissionAdmin, addFamilyService);
router.put("/admin/families/:id", UserHasPermissionAdmin, updateFamilyService);
router.delete("/admin/families/:id", UserHasPermissionAdmin, deleteFamilyService);

// Router Monster
router.get("/admin/monsters", UserHasPermissionAdmin, getMonsters);
router.get("/admin/monsters/:id", UserHasPermissionAdmin, getMonster);
router.post("/admin/monsters/add", UserHasPermissionAdmin, addMonsterService);
router.put("/admin/monsters/:id", UserHasPermissionAdmin, updateMonsterService);
router.delete("/admin/monsters/:id", UserHasPermissionAdmin, deleteMonsterService);

// Router Skill
router.get("/admin/skills", UserHasPermissionAdmin, getSkills);
router.get("/admin/skills/:id", UserHasPermissionAdmin, getSkill);
router.post("/admin/skills/add", UserHasPermissionAdmin, addSkillService);
router.put("/admin/skills/:id", UserHasPermissionAdmin, updateSkillService);
router.delete("/admin/skills/:id", UserHasPermissionAdmin, deleteSkillService);

// Router Buff
router.get("/admin/buffs", UserHasPermissionAdmin, getBuffs);
router.get("/admin/buffs/:id", UserHasPermissionAdmin, getBuff);
router.post("/admin/buffs/add", UserHasPermissionAdmin, addBuffService);
router.put("/admin/buffs/:id", UserHasPermissionAdmin, updateBuffService);
router.delete("/admin/buffs/:id", UserHasPermissionAdmin, deleteBuffService);

// Router Debuff
router.get("/admin/debuffs", UserHasPermissionAdmin, getDebuffs);
router.get("/admin/debuffs/:id", UserHasPermissionAdmin, getDebuff);
router.post("/admin/debuffs/add", UserHasPermissionAdmin, addDebuffService);
router.put("/admin/debuffs/:id", UserHasPermissionAdmin, updateDebuffService);
router.delete("/admin/debuffs/:id", UserHasPermissionAdmin, deleteDebuffService);

// Router Affectation
router.post("/admin/affecter", UserHasPermissionAdmin, affecter);
router.post("/admin/desaffecter", UserHasPermissionAdmin, desaffecter);

module.exports = router;