const axios = require('axios');
const FormData = require('form-data');

const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dhsmwjc0q/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'KomunaGO';

class CloudinaryService {
    /**
     * Uploads an image to Cloudinary.
     * @param {string} base64String - The image file as a Base64 string.
     * @param {string} fileName - The original name of the file (e.g., '6.jpg').
     * @returns {Promise<string>} - The URL of the uploaded image.
     */
    static async uploadImage(base64String, fileName) {
        try {
            const form = new FormData();
            // Extract content type from base64 string (e.g., data:image/jpeg;base64,...)
            const parts = base64String.split(';base64,');
            const contentType = parts[0].split(':')[1];
            const base64Data = parts[1];

            form.append('file', base64String); // Cloudinary accepts base64 string directly
            form.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
            form.append('public_id', fileName.split('.')[0]); // Use original filename as public_id (without extension)

            const response = await axios.post(CLOUDINARY_UPLOAD_URL, form, {
                headers: form.getHeaders()
            });

            if (response.status === 200 && response.data && response.data.url) {
                return { url: response.data.url };
            } else {
                throw new Error('Ocurrio un error al cargar la imagen a Cloudinary.');
            }
        } catch (error) {
            console.error('Error uploading image to Cloudinary:', error.response ? error.response.data : error.message);
            throw new Error('Error al cargar la imagen a Cloudinary.');
        }
    }

    /**
     * Handles the URL returned by Cloudinary (e.g., saves it to a database).
     * This is a placeholder and should be implemented based on your specific needs.
     * @param {string} imageUrl - The URL of the uploaded image from Cloudinary.
     * @returns {Promise<void>}
     */
    static async handleImageUrl(imageUrl) {
        console.log('Image URL received from Cloudinary:', imageUrl);
        // TODO: Implement logic to save the imageUrl to your database or perform other actions.
        // Example: await ImageModel.create({ url: imageUrl, uploadedAt: new Date() });
    }
}

module.exports = CloudinaryService; 