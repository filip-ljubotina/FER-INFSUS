const express = require("express");
const ctrl = require("../controllers/controllers");
const router = express.Router();

router.get("/korisnici", ctrl.fetchUsers);
router.get("/odjel", ctrl.fetchDepartments);
router.post("/odjel", ctrl.createDepartment);
router.put("/odjel", ctrl.updateDepartment);
router.delete("/odjel", ctrl.deleteDepartment);
router.get("/materijaliZaOdjel", ctrl.fetchMaterialsByDepartment);
router.post("/noviPotrosniMaterijal", ctrl.createConsumableMaterial);
router.put("/azurirajMaterijal", ctrl.updateMaterial);
router.delete("/obrisiPotrosniMaterijal", ctrl.deleteMaterial);

module.exports = router;
