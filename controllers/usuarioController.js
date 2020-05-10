const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.crearUsuario = async (request, response) => {
  const errores = validationResult(request);
  if (!errores.isEmpty()) {
    return response.status(400).json({ errores: errores.array() });
  }

  const { email, password } = request.body;
  try {
    let usuario = await Usuario.findOne({ email });
    if (usuario) {
      return response.status(400).json({ msg: "El usuario ya existe" });
    }

    usuario = new Usuario(request.body);

    const salt = await bcryptjs.genSalt(10);

    usuario.password = await bcryptjs.hash(password, salt);

    await usuario.save();

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
    response.status(400).send("Hubo un error");
  }
};
