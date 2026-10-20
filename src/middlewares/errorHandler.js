// Manejador de errores: 4 parámetros. Responde siempre en JSON.
const errorHandler = (err, req, res, next) => {
  // TODO Paso 3:
  //  a) Si el body trae JSON mal formado (err.type === "entity.parse.failed") responde 400.
 if(err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "JSON mal formado" });
  }
  //  b) Si status es 500, responde "Error interno del servidor" y agrega err.stack
  //     solo cuando process.env.NODE_ENV !== "Producion".
  const status = err.status || 500;

  if (status === 500) { 
    const body = { error: "Error interno del servidor" };
    if (process.env.NODE_ENV !== "production") {
      body.stack = err.stack;
    }
  res.status(status).json(body);
  }
  return res.status(status).json({ 
    error: err.message 
  });
};

module.exports = errorHandler;
