import { Category } from "../../model/category.js"

const getCategories = async (req, res) => {
    const { page = 1, limit = 0 } = req.query
    const skip = (page - 1) * limit
    try {
        const totalCount = await Category.countDocuments()
        const categories = await Category.find({}).populate('parent').populate('children').skip(skip).limit(limit)
        return res.status(200).json({ categories, totalCount })
    } catch (error) {
        return res.status({ message: 'Failed to get categories' })
    }
}

const addCategory = async (req, res) => {
    try {
        const { name, description, categoryType, parentCategory, offer } = req.body
        if (categoryType.toLowerCase() === 'child') {
            const newCategory = await Category.create({
                name: name,
                description: description,
                parent: parentCategory,
                status: 'active',
                offer: offer
            })
            const responce = await Category.findByIdAndUpdate(parentCategory, {
                $push: { children: newCategory._id }
            })
            return res.status(201).json({ message: 'Category added sucessfully' })
        }
        await Category.create({
            name: name,
            description: description,
            parent: null,
            status: 'active'
        })
        return res.status(201).json({ message: 'Category created sucessfully' })
    } catch (error) {
        if (error?.errorResponse?.code === 11000) {
            return res.status(409).json({ message: 'Category already exists' })
        }
    }
}

const editCategory = async (req, res) => {
    const { id } = req.params
    try {
        const { name, description, categoryType, parentCategory, offer } = req.body
        if (categoryType.toLowerCase() === 'child') {
            await Category.findByIdAndUpdate(id, {
                name: name,
                description: name,
                parent: parentCategory,
                offer
            })
            return res.status(200).json({ message: 'Category edited sucessfully' })
        }
        await Category.findByIdAndUpdate(id, {
            name: name,
            description: description,
            parent: null
        })
        return res.status(200).json({ message: 'Category edited sucessfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Failed to edit category' })
    }
}

const blockCategory = async (req, res) => {
    try {
        const { id } = req.params
        const category = await Category.findOne({ _id: id })
        if (category.status === 'active') {
            const blockedCategory = await Category.findByIdAndUpdate(id, { status: 'blocked' }, { new: true })
            if (blockedCategory) return res.status(200).json({ message: 'Category blocked sucessfully' })
        } else if (category.status === 'blocked') {
            const blockedCategory = await Category.findByIdAndUpdate(id, { status: 'active' }, { new: true })
            if (blockedCategory) return res.status(200).json({ message: 'Category unblocked sucessfully' })
        }
    } catch (error) {
        return res.status(500).json({ message: 'Failed to block category' })
    }
}

const deleteCategory = async (req, res) => {
    const { id } = req.params
    try {
        const responce = await Category.deleteOne({ _id: id })
        if (responce) return res.status(200).json({ message: 'Category deleted sucessfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Failed to delete category' })
    }
}

export {
    getCategories,
    addCategory,
    editCategory,
    blockCategory,
    deleteCategory,
}