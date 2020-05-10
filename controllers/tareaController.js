const Tarea = require("../models/Tarea");
const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");

exports.crearTarea = async (request, response) => {
  const errores = validationResult(request);
  if (!errores.isEmpty()) {
    return response.status(400).json({ errores: errores.array() });
  }
  const { proyecto } = request.body;

  try {
    const proyectoBuscado = await Proyecto.findById(proyecto);
    if (!proyectoBuscado) {
      return response.status(404).json({ msg: "Proyecto no encontrado" });
    }

    if (proyectoBuscado.creador.toString() !== request.usuario.id) {
      return response.status(401).json({ msg: "No autorizado" });
    }
    console.log(request.body);
    const tarea = new Tarea(request.body);
    tarea.save();
    response.json({ tarea });
  } catch (error) {
    console.log(error);
    response.status(500).send("Error en el servidor");
  }
};

exports.obtenerTareas = async (request, response) => {
  try {
    const { proyecto } = request.query;
    const existeProyecto = await Proyecto.findById(proyecto);

    if (!existeProyecto) {
      return response.status(404).json({ msg: "Proyecto no existe" });
    }

    if (existeProyecto.creador.toString() !== request.usuario.id) {
      return response(401).json({ msg: "No autorizado" });
    }

    const tareas = await Tarea.find({ proyecto });
    response.json({ tareas });
  } catch (error) {
    console.log(error);
    response.status(500).send("Error de servidor");
  }
};

exports.actualizarTarea = async (request, response) => {
  try {
    const { proyecto, nombre, estado } = request.body;

    const existeProyecto = await Proyecto.findById(proyecto);
    if (!existeProyecto) {
      return response.status(404).json({ msg: "Proyecto no existe" });
    }

    if (existeProyecto.creador.toString() !== request.usuario.id) {
      return response.status(401).json({ msg: "No autorizacion" });
    }

    let tareaExiste = await Tarea.findById(request.params.id);
    if (!tareaExiste) {
      return response.status(404).json({ msg: "Tarea no existe" });
    }

    const nuevaTarea = {};
    if (nombre) {
      nuevaTarea.nombre = nombre;
    }
    if (estado !== undefined) {
      nuevaTarea.estado = estado;
    }

    let tarea = await Tarea.findByIdAndUpdate(
      { _id: request.params.id },
      nuevaTarea,
      { new: true }
    );
    response.json({tarea});
  } catch (error) {
    console.log(error);
    response.status(500).send("Error de servidor");
  }
};

exports.eliminarTarea =async(request,response)=>{
    try {
        const {proyecto} = request.query;
        const tarea = request.params.id;
        let existeTarea = await Tarea.findById(tarea);
        if(!existeTarea){
            return response.status(404).json({msg:"No existe tarea"});
        }

        let existeProyecto = await Proyecto.findById(proyecto);
        if(existeProyecto.creador.toString() !== request.usuario.id){
            return response.status(401).json({msg:"No autorizado"});

        }

        await Tarea.findByIdAndRemove({_id:request.params.id});
        response.json({msg:"Tarea eliminada"})

    } catch (error) {
        console.log(error);
        response.status(500).send("Error de servidor");
    }
}
