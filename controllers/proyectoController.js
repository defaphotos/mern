const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");
exports.crearProyecto = async (request, response) => {
  const errores = validationResult(request);
  if (!errores.isEmpty()) {
    return response.status(400).json({ errores: errores.array() });
  }
  try {
    const proyecto = new Proyecto(request.body);
    proyecto.creador = request.usuario.id;
    proyecto.save();
    response.json(proyecto);
  } catch (error) {
    console.log(error);
    response.status(500).send("Hubo un error");
  }
};

exports.obtenerProyectos = async (request, response) => {
  try {
    const proyectos = await Proyecto.find({
      creador: request.usuario.id,
    }).sort({ creado: -1 });
    response.json({ proyectos });
  } catch (error) {
    console.log(error);
    response.status(500).send("Hubo un error");
  }
};

exports.actualizarProyecto = async (request, response) => {
  const errores = validationResult(request);
  if (!errores.isEmpty()) {
    return response.status(400).json({ errores: errores.array() });
  }
  const { nombre } = request.body;
  const nuevoProyecto = {};

  if (nombre) {
    nuevoProyecto.nombre = nombre;
  }

  try {
    let proyecto = await Proyecto.findById(request.params.id);
    if (!proyecto) {
      return response.status(404).json({ msg: "Proyecto no encontrado" });
    }

    if (proyecto.creador.toString() !== request.usuario.id) {
      return response.status(401).json({ msg: "No autorizado" });
    }

    proyecto = await Proyecto.findByIdAndUpdate(
      { _id: request.params.id },
      { $set: nuevoProyecto },
      { new: true }
    );

    response.json({proyecto});
  } catch (error) {
    console.log(error);
    response.status(500).send("Error en el servidor");
  }
};

exports.eliminarProyecto =async(request,response)=>{
    try {
        let proyecto = await Proyecto.findById(request.params.id);
        if(!proyecto){
            return response.status(404).json({msg:"Proyecto no existe"});
        }

        if(proyecto.creador.toString() !== request.usuario.id){
            return response.status(401).json({msg:"No autorizado"});
        }
        await Proyecto.findOneAndRemove({_id: request.params.id});
        response.json({msg: "Proyecto eliminado"});

    } catch (error) {
        console.log(error);
        response.status(500).send("Error en el servidor");
    }
}
