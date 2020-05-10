const express = require("express");
const router = express.Router();
const proyectoController = require("../controllers/proyectoController");
const { check } = require("express-validator");
const auth = require("../middleware/auth");

router.post(
  "/",
  [check("nombre", "El nombre del proyecto es obligatorios").not().isEmpty()],
  auth,
  proyectoController.crearProyecto
);

router.get("/", auth, proyectoController.obtenerProyectos);

router.put(
  "/:id",
  [check("nombre", "El nombre del proyecto es obligatorios").not().isEmpty()],
  auth,
  proyectoController.actualizarProyecto
);

router.delete("/:id",auth,proyectoController.eliminarProyecto)

module.exports = router;
