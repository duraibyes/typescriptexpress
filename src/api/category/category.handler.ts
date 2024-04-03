import { NextFunction, Request, Response } from "express";
import categoryModel, { Category } from "./category.model";
import AuthenticatedRequest from "../../interfaces/AuthenticationRequest";
import multer from "multer";
import fs from "fs";

const getCategoryList = async (req: AuthenticatedRequest, res: Response) => {

    const categories = await categoryModel.find({user_id: req.user.id});
    res.status(200).json({message:'Data fetched successfully', status: 0, categories});

}

const getCategoryById = async (req: AuthenticatedRequest, res: Response) => {
    const categoryId = req.params.id;
    const category = await categoryModel.findById(categoryId);
    res.status(200).json({message:'Data fetched successfully', status: 0, category});
}

const createCategory = async (req: AuthenticatedRequest, res: Response) => {
    const { name, description, is_active } = req.body;
    console.log('params ', req.params);
    console.log( ' body ', req.body);
    try {

        const categoryAvailable: Category | null = await categoryModel.findOne({ name, user_id: req.user.id });
        if (categoryAvailable) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(200).json({ status: 1, message: 'Category already exists', category: '' });
        }
        const categoryData: any = {
            name,
            description,
            is_active,
            user_id: req.user.id,
        };

        if (req.file?.path) {
            categoryData.category_image = req.file?.path;
        }

        const category: Category = await categoryModel.create(categoryData);
        return res.status(200).json({ status: 0,message: 'Category added success', category });
    }
    catch (error: any) {
        return res.status(400).json({ status: 1,message: error.message, category: '' })
    }
}

const updateCategory = async (req: AuthenticatedRequest, res: Response) => {
    console.log('params ', req.params);
    console.log( ' body ', req.body);
    const categoryId = req.params.id; // Assuming category ID is passed in the request params
    const { name, description, is_active } = req.body;
    
    try {
        const category = await categoryModel.findById(categoryId);
        if (!category) {
            return res.status(404).json({ status: 1, message: 'Category not found', category: '' });
        }

        // Check if the updated name already exists for a different category
        const existingCategory = await categoryModel.findOne({ name, _id: { $ne: categoryId } });
        if (existingCategory) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({ status: 1, message: 'Category name already exists', category: '' });
        }

        // Update category fields
        const categoryData = {};
        category.name = name;
        category.description = description;
        category.is_active = is_active;

        // Update category image if provided
        if (req.file?.path) {
            category.category_image = req.file.path;
        }

        // Save updated category
        await category.save();
        // console.log(first)
        // const updatedContact = await categoryModel.findByIdAndUpdate(
        //     req.params.id,
        //     category,
        //     { new: true, runValidators: true }
        // );

        return res.status(200).json({ status: 0, message: 'Category updated successfully', category });
    }
    catch (error: any) {
        return res.status(400).json({ status: 1, message: error.message, category: '' });
    }
}


const deleteCategory = async (req: Request, res: Response) => {
    const deletedCategory = await categoryModel.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
        // Category with the provided ID was not found
        return res.status(404).json({ status: 1, message: "Category not found" });
    }
    // Successfully deleted the contact
    return res.status(200).json({ status: 0, message: "Category deleted successfully" });
}

const uploadCategoryImage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        // Upload file logic
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, "./uploads/category");
            },
            filename: function (req, file, cb) {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, uniqueSuffix + file.originalname);
            }
        });

        const uploadCategoryImg = multer({ storage: storage }).single("category_image");
        uploadCategoryImg(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json({ status: 1, message: 'Error uploading file', category: '' });
            } else if (err) {
                return res.status(500).json({ status: 1, message: err.message, category: '' });
            }
            next();
        });
    }
    catch (error: any) {
        return res.status(500).json({ status: 1, message: error.message, category: '' });
    }
}

export { getCategoryList, getCategoryById, createCategory, updateCategory, deleteCategory, uploadCategoryImage };