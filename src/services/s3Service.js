// Servicio para interactuar con S3
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const { REGION, BUCKET_NAME } = require('../config');

const s3 = new S3Client({ region: REGION });

// Sube un archivo al bucket S3 y devuelve la URL pública
async function subirArchivo(archivo) {
  const fileKey = `boletines/${uuidv4()}-${archivo.originalname}`;

  await s3.send(new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
    Body: archivo.buffer,
    ContentType: archivo.mimetype,
  }));

  const url = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${fileKey}`;
  return url;
}

module.exports = { subirArchivo };
