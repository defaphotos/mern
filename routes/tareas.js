const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const auth = require("../middleware/auth");
const tareaController = require("../controllers/tareaController");

router.post(
  "/",
  [
    check("nombre", "El nombre de la tarea es obligatorio").not().isEmpty(),
    check("proyecto", "El Proyecto es obligatorio"),
  ],
  auth,
  tareaController.crearTarea
);
router.get("/", auth, tareaController.obtenerTareas);

router.put("/:id",auth,tareaController.actualizarTarea);
router.delete("/:id",auth,tareaController.eliminarTarea)
module.exports = router;
