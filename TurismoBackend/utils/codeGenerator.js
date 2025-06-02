const crypto = require('crypto');

const generateUniqueCode = () => {
    // Genera un código de 6 caracteres alfanuméricos
    return crypto.randomBytes(3).toString('hex').toUpperCase();
};

module.exports = {
    generateUniqueCode
}; 