// Rutas del recurso /boletines
const express = require('express');
const multer = require('multer');
const { subirArchivo } = require('../services/s3Service');
const { enviarMensaje } = require('../services/sqsService');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /boletines
// Recibe: archivo (multipart), contenido (texto), correo (email)
// Sube el archivo a S3 y encola el boletín en SQS
router.post('/', upload.single('archivo'), async (req, res) => {
  try {
    const { contenido, correo } = req.body;
    const archivo = req.file;

    if (!archivo || !contenido || !correo) {
      return res.status(400).json({
        error: 'Se requieren los campos: archivo, contenido y correo',
      });
    }

    // 1. Subir archivo a S3
    const imagen = await subirArchivo(archivo);

    // 2. Enviar mensaje a SQS
    await enviarMensaje({ contenido, correo, imagen });

    return res.status(200).json({
      message: 'Boletín encolado exitosamente',
      imagen,
      correo,
      contenido,
    });

  } catch (err) {
    console.error('Error procesando boletín:', err);
    return res.status(500).json({ error: 'Error interno del servidor', detalle: err.message });
  }
});

module.exports = router;
