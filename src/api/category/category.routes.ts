import { Router } from "express";
import {
    createCategory,
    deleteCategory,
    getCategoryById,
    getCategoryList,
    updateCategory,
    uploadCategoryImage
} from "./category.handler";

const categoryRouter = Router();


categoryRouter
  .get('/', getCategoryList)
  .post('/', uploadCategoryImage, createCategory)
  .get('/:id', getCategoryById)
//   .put('/:id', updateCategory) //request body data not coming
  .post('/:id', updateCategory)
  .delete('/:id', deleteCategory);

export default categoryRouter;