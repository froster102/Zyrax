import { Category } from "../../model/category.js"

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({}).populate({
            path: 'children',
            select: 'name',
            match: { status: 'active' }
        })
        return res.status(200).json(categories)
    } catch (error) {
        return res.status(500).json({ message: 'Failed to get categories' })
    }
}

export {
    getAllCategories
}