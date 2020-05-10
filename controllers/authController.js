const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.autenticarUsuario = async (request, response) => {
  const errores = validationResult(request);
  if (!errores.isEmpty()) {
    return response.status(400).json({ errores: errores.array() });
  }

  const { email, password } = request.body;
  try {
    let usuario;

    usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return response.status(400).json({ msg: "Usuario no existe" });
    }

    let passCorrecto = await bcryptjs.compare(password, usuario.password);
    if (!passCorrecto) {
      return response.status(400).json({ msg: "Password Incorrecto" });
    }
    const payload = {
        usuario:{
            id: usuario.id
        }
    };

    jwt.sign(
      payload,
      process.env.SECRETA,
      {
        expiresIn: 3600,
      },
      (error, token) => {
        if (error) throw error;

        response.json({ token });
      }
    );
  } catch (error) {
    console.log(error);
  }
};
exports.usuarioAutenticado =async(request,response)=>{

  try {
    const usuario = await Usuario.findById(request.usuario.id).select("-password");
    response.json({usuario});
  } catch (error) {
    console.log(error);
    response.status(500).send("Error de servidor");
  }
}
