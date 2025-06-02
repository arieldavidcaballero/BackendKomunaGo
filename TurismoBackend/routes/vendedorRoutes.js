const express = require('express');
const router = express.Router();
const vendedorController = require('../controllers/vendedorController');

// Rutas públicas
router.post('/registro', vendedorController.registrarVendedor);
router.post('/validar-codigo', vendedorController.validarCodigo);
router.post('/recuperar-codigo', vendedorController.recuperarCodigo);
router.get('/', vendedorController.obtenerTodosLosVendedores);
router.get('/:id', vendedorController.obtenerVendedor);

// Rutas que requieren código de acceso
router.put('/:id', vendedorController.actualizarPerfilVendedor);

module.exports = router;


