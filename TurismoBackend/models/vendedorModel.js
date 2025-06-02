const db = require('../models/db');

const crearVendedor = async ({ nombre_tienda, correo, tipo_negocio, codigo_acceso }) => {
  const query = `
    INSERT INTO vendedores (nombre_tienda, correo, tipo_negocio, codigo_acceso)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [nombre_tienda, correo, tipo_negocio, codigo_acceso];
  const result = await db.query(query, values);
  return result.rows[0];
};

const buscarVendedorPorCorreo = async (correo) => {
  const result = await db.query('SELECT * FROM vendedores WHERE correo = $1', [correo]);
  return result.rows[0];
};

const actualizarVendedor = async (id, datos) => {
  const campos = [];
  const valores = [];
  let index = 1;

  for (const clave in datos) {
    campos.push(`${clave} = $${index}`);
    valores.push(datos[clave]);
    index++;
  }

  valores.push(id);

  const query = `
    UPDATE vendedores SET ${campos.join(', ')}, actualizado_en = CURRENT_TIMESTAMP
    WHERE id = $${index}
    RETURNING *;
  `;

  const result = await db.query(query, valores);
  return result.rows[0];
};

const listarVendedores = async () => {
  const result = await db.query('SELECT id, nombre_tienda, tipo_negocio, fotos, horario_atencion, cupo_maximo, ubicacion_latitud, ubicacion_longitud FROM vendedores');
  return result.rows;
};

const obtenerVendedorPorId = async (id) => {
  const result = await db.query('SELECT * FROM vendedores WHERE id = $1', [id]);
  return result.rows[0];
};

module.exports = {
  crearVendedor,
  buscarVendedorPorCorreo,
  actualizarVendedor,
  listarVendedores,
  obtenerVendedorPorId
};
