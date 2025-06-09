const db = require('../models/db');
const { generateUniqueCode } = require('../utils/codeGenerator');
const { sendEmailWithCode } = require('../utils/emailSender');

const vendedorController = {
    // Registro de vendedor
    registrarVendedor: async (req, res) => {
        try {
            const { nombre_local, correoElectronico, categoriaLocal } = req.body;

            // Verificar si ya existe el nombre de la tienda
            const tiendaExistente = await db.query(
                'SELECT * FROM vendedores WHERE nombre_tienda = $1',
                [nombre_local]
            );

            if (tiendaExistente.rows.length > 0) {
                return res.status(400).json({ 
                    error: 'Ya existe una tienda con ese nombre' 
                });
            }

            // Verificar si ya existe el correo
            const correoExistente = await db.query(
                'SELECT * FROM vendedores WHERE correo = $1',
                [correoElectronico]
            );

            if (correoExistente.rows.length > 0) {
                return res.status(400).json({ 
                    error: 'Este correo ya está registrado' 
                });
            }

            // Generar código único
            const codigo_acceso = generateUniqueCode();

            // Insertar nuevo vendedor
            const result = await db.query(
                `INSERT INTO vendedores (
                    nombre_tienda, 
                    correo, 
                    tipo_negocio, 
                    codigo_acceso
                ) VALUES ($1, $2, $3, $4) RETURNING *`,
                [nombre_local, correoElectronico, categoriaLocal, codigo_acceso]
            );

            // Enviar correo con el código
            await sendEmailWithCode(correoElectronico, codigo_acceso);

            res.status(201).json({
                message: 'Vendedor registrado exitosamente. Se ha enviado el código de acceso a su correo.',
                vendedor: result.rows[0]
            });
        } catch (error) {
            console.error('Error al registrar vendedor:', error);
            res.status(500).json({ 
                error: 'Error al registrar el vendedor' 
            });
        }
    },

    // Validar código de acceso
    validarCodigo: async (req, res) => {
        try {
            const { codigo } = req.body;

            const result = await db.query(
                'SELECT * FROM vendedores WHERE codigo_acceso = $1',
                [codigo]
            );

            if (result.rows.length === 0) {
                return res.status(401).json({ 
                    error: 'Código inválido' 
                });
            }

            res.json({ 
                valid: true, 
                vendedor: result.rows[0] 
            });
        } catch (error) {
            console.error('Error al validar código:', error);
            res.status(500).json({ 
                error: 'Error al validar el código' 
            });
        }
    },

    // Actualizar perfil de vendedor
    actualizarPerfilVendedor: async (req, res) => {
        try {
            const { id } = req.params;
            const {
                cupo_personas,
                horario,
                ubicacion,
                menu,
                fotos,
                redes_sociales
            } = req.body;

            console.log('Received payload in actualizarPerfilVendedor:', req.body);
            console.log('Received fotos value:', fotos);

            const result = await db.query(
                `UPDATE vendedores 
                SET cupo_personas = $1,
                    horario = $2,
                    ubicacion = $3,
                    menu = $4,
                    fotos = $5::TEXT,
                    redes_sociales = $6,
                    actualizado_en = CURRENT_TIMESTAMP
                WHERE id = $7
                RETURNING *`,
                [cupo_personas, horario, ubicacion, menu, fotos, redes_sociales, id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ 
                    error: 'Vendedor no encontrado' 
                });
            }

            res.json(result.rows[0]);
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            res.status(500).json({ 
                error: 'Error al actualizar el perfil' 
            });
        }
    },

    // Obtener todos los vendedores
    obtenerTodosLosVendedores: async (req, res) => {
        try {
            const result = await db.query('SELECT * FROM vendedores ORDER BY creado_en DESC');
            res.json(result.rows);
        } catch (error) {
            console.error('Error al obtener vendedores:', error);
            res.status(500).json({ 
                error: 'Error al obtener los vendedores' 
            });
        }
    },

    // Obtener un vendedor específico
    obtenerVendedor: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await db.query('SELECT * FROM vendedores WHERE id = $1', [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ 
                    error: 'Vendedor no encontrado' 
                });
            }

            res.json(result.rows[0]);
        } catch (error) {
            console.error('Error al obtener vendedor:', error);
            res.status(500).json({ 
                error: 'Error al obtener el vendedor' 
            });
        }
    },

    // Recuperar código de acceso
    recuperarCodigo: async (req, res) => {
        try {
            const { email } = req.body;
            const result = await db.query(
                'SELECT codigo_acceso FROM vendedores WHERE correo = $1',
                [email]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ 
                    error: 'No se encontró ningún vendedor con ese correo' 
                });
            }

            // Enviar correo con el código
            await sendEmailWithCode(email, result.rows[0].codigo_acceso);

            res.json({ 
                message: 'Se ha enviado el código de acceso a su correo' 
            });
        } catch (error) {
            console.error('Error al recuperar código:', error);
            res.status(500).json({ 
                error: 'Error al recuperar el código' 
            });
        }
    },

    // Eliminar vendedor
    eliminarVendedor: async (req, res) => {
        try {
            const { id } = req.params;
            
            const result = await db.query('DELETE FROM vendedores WHERE id = $1 RETURNING *', [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({
                    error: 'Vendedor no encontrado'
                });
            }

            res.json({
                message: 'Vendedor eliminado exitosamente'
            });
        } catch (error) {
            console.error('Error al eliminar vendedor:', error);
            res.status(500).json({
                error: 'Error al eliminar el vendedor'
            });
        }
    }
};

module.exports = vendedorController;
