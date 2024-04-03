import { Request, Response } from "express";
import AuthenticatedRequest from "../../interfaces/AuthenticationRequest";
import rolesModel, { Role } from "./roles.model";
import { isValidObjectId } from "../../middleware/common";

const addRoles = async (req: AuthenticatedRequest, res: Response) => {
    const user_id = req.user.id;
    console.log( ' req.body ', req.body);
    const {name, description, is_active, permission_roles} = req.body
    try {
        const rolesAvailable: Role | null = await rolesModel.findOne({ name, user_id });
        if (rolesAvailable) {
            return res.status(200).json({ status: 1, message: 'Roles already exists', roles: '' });
        }

        const rolesData: any = {
            name,
            description,
            is_active,
            user_id,
            permission_roles
        };

        if (req.file?.path) {
            rolesData.icon = req.file?.path;
        }

        const roles: Role = await rolesModel.create(rolesData);
        return res.status(200).json({ status: 0,message: 'Roles added success', roles });
    } catch (error: any) {
        return res.status(400).json({ status: 1,message: error.message, roles: '' })
    }
}

const getAllRoles = async (req:AuthenticatedRequest, res: Response) => {
    const roles = await rolesModel.find({user_id: req.user.id});
    res.status(200).json({message:'Data fetched successfully', status: 0, roles});
}

const getRoleById = async (req:Request, res: Response) => {
    const roleId = req.params.id;
    const role = await rolesModel.findById(roleId);
    res.status(200).json({message:'Data fetched successfully', status: 0, role});
}

const updateRoles = async (req:AuthenticatedRequest, res: Response) => {
    const roleId = req.params.id;
    // Validate the roleId
    if (!isValidObjectId(roleId)) {
        return res.status(400).json({ message: 'Invalid Role ID' });
    }
    let role = await rolesModel.findById(roleId);
    
    if (!role) {
        return res.status(404).json({ message: 'Role not found' });
    }
    if (role.user_id.toString() !== req.user.id) {
        return res.status(403).json({ message: "User don't have permission to update other user roles" });
    }
    const updatedRole = await rolesModel.findByIdAndUpdate(
        roleId,
        req.body,
        { new: true, runValidators: true }
    );

    res.status(200).json({ status: 0,message: 'Roles updated success', updatedRole });
}

const deleteRole = async (req:Request, res: Response) => {
    const roleId = req.params.id;
    // Validate the roleId
    if (!isValidObjectId(roleId)) {
        return res.status(400).json({ message: 'Invalid Role ID' });
    }
    const roleCategory = await rolesModel.findByIdAndDelete(roleId);
    if (!roleCategory) {
        return res.status(404).json({ status: 1, message: "Role not found" });
    }
    return res.status(200).json({ status: 0, message: "Role deleted successfully" });

}

export { addRoles, getAllRoles, getRoleById, updateRoles, deleteRole };