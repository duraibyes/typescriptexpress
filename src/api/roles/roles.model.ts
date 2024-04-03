import mongoose, { Schema, Document, Types } from 'mongoose';

export interface Permission extends Document {
    add?: boolean,
    edit?: boolean,
    view: boolean,
    delete?: boolean,
    export?: boolean
}

export interface PermissionModules extends Document {
    module_name: string,
    permission: Permission
}

export interface Role extends Document {
    user_id: Types.ObjectId;
    name: string;
    icon?: string;
    description?: string;
    permission_roles?: PermissionModules[];
    is_active?: string;
    deleted_at?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}

const permissionSchema = new Schema<Permission>({
    add: { type: Boolean },
    edit: { type: Boolean },
    view: { type: Boolean, required: true },
    delete: { type: Boolean },
    export: { type: Boolean }
});

const permissionModuleSchema = new Schema<PermissionModules>({
    module_name: { type: String, required: true },
    permission: permissionSchema
});

const roleSchema = new Schema<Role>({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    name:{
        type: String,
        required: [true, "Role name is required"]
        // unique: [true, "Name already taken"],
    },
    description: String,
    icon: String, 
    permission_roles: [permissionModuleSchema],
    is_active: {
        type: String,
        enum: ["yes", "no"],
        default: "yes", // Optional, sets default value to "active"
        validate: {
            validator: function(value: String) {
                return value === 'yes' || value === 'no';
            },
            message: "Is Active field should be either yes or no"
        },
    },
    deleted_at: {
        type: Date,
        default: null // Assuming initially it's not deleted
    }
},{
    timestamps: true,
    validateBeforeSave: true
})


export default mongoose.model<Role>("Role", roleSchema);