const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    // Clasificación según el catálogo: "Home Spray", "Difusor de Auto", "Difusor de Ambiente", "Perfume"
    category: { 
        type: String, 
        required: true,
        enum: ['Home Spray', 'Difusor de Auto', 'Difusor de Ambiente', 'Perfume Personal'] 
    },
    // Subcategoría para los perfumes (Hombre/Mujer) o tipos de difusores
    subCategory: { 
        type: String 
    },
    description: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    // Array de aromas. Ej: ["Peras y flores", "Manzana"] o ["Sándalo"]
    scents: [{ 
        type: String 
    }], 
    image: { 
        type: String, 
        required: true 
    },
    // Para la lógica de "New Arrivals" y el Slider
    featured: { 
        type: Boolean, 
        default: false 
    },
    stock: { 
        type: Number, 
        default: 0 
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

//A revision por los tamaños de los frascos, es decir 100ml, 200ml, 300ml, 500ml, 1000ml