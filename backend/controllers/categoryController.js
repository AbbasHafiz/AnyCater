const Category = require('../models/category'); // Import the Category model

const categoryController = {
    // Function to create a new category
    createCategory: async (req, res) => {
        try {
            // Extract category details from the request body
            const { name, description } = req.body;

            // Create a new category
            const newCategory = new Category({ name, description });
            await newCategory.save();

            res.status(201).json({ message: 'Category created successfully', category: newCategory });
        } catch (error) {
            res.status(500).json({ message: 'Failed to create category' });
        }
    },

    // Function to add an item to a category
    addItemToCategory: async (req, res) => {
        try {
            // Extract item details from the request body
            const { itemId } = req.body;
            const categoryId = req.params.id; // Retrieve category ID from the URL params

            // Find the category by ID
            const category = await Category.findById(categoryId);

            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }

            // Add the item to the category
            category.items.push(itemId);
            await category.save();

            res.status(200).json({ message: 'Item added to the category', category });
        } catch (error) {
            res.status(500).json({ message: 'Failed to add item to the category' });
        }
    },

    // You can add more functions for category-related actions as needed
};

module.exports = categoryController;
