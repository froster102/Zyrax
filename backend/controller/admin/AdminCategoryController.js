import { Category } from "../../model/category.js"

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({}).populate('parent').populate('children')
        return res.status(200).json(categories)
    } catch (error) {
        console.log(error)
    }
}

const addCategory = async (req, res) => {
    try {
        const { name, description, categoryType, parentCategory } = req.body
        if (categoryType.toLowerCase() === 'child') {
            const newCategory = await Category.create({
                name: name,
                description: description,
                parent: parentCategory,
            })
            const responce = await Category.findByIdAndUpdate(parentCategory, {
                $push: { children: newCategory._id }
            })
            console.log(responce, parentCategory)
            return res.status(201).json({ message: 'Category added sucessfully' })
        }
        await Category.create({
            name: name,
            description: description,
            parent: null
        })
        return res.status(201).json({ message: 'Category created sucessfully' })
    } catch (error) {
        console.log(error)
        if (error?.errorResponse?.code === 11000) {
            return res.status(409).json({ message: 'Category already exists' })
        }
    }
}

const editCategory = async (req, res) => {
    const { id } = req.params
    try {
        const { name, description, categoryType, parentCategory } = req.body
        if (categoryType.toLowerCase() === 'child') {
            await Category.findByIdAndUpdate(id, {
                name: name,
                description: name,
                parent: parentCategory
            })
            return res.status(200).json({ message: 'Category edited sucessfully' })
        }
        await Category.findByIdAndUpdate(id, {
            name: name,
            description: description,
            parent: null,
        })
        return res.status(200).json({ message: 'Category edited sucessfully' })
    } catch (error) {
        console.log(error)
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
        console.log(error)
    }
}

const deleteCategory = async (req, res) => {
    const { id } = req.params
    try {
        const responce = await Category.deleteOne({ _id: id })
        if (responce) res.status(200).json({ message: 'Category deleted sucessfully' })
    } catch (error) {
        console.log(error)
    }
}

export {
    getCategories,
    addCategory,
    editCategory,
    blockCategory,
    deleteCategory,
}