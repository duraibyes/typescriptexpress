import mongoose, { Schema, Document, Types } from 'mongoose';

export interface User extends Document {
    username: string;
    first_name: string;
    last_name?: string;
    email?: string;
    mobile_no: string;
    password?: string;
    dob?: Date;
    image?: string;
    gender?: string;
    created_id?: Types.ObjectId;
    role_id?: Types.ObjectId;
    is_active?: string;
    is_approved?: number;
    is_super_admin: boolean;
    deleted_at?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<User>({
    username: {
        type: String,
        required: [true, "Please add the user name"]
    },
    first_name: String,
    last_name: String,
    email: {
        type: String,
        required: false,
        validate: {
            validator: function (value: string | null) {
                if (value !== null) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                }
                return true;
            },
            message: "Invalid email address"
        },
        default: null
    },
    mobile_no: {
        type: String,
        required: true,
        unique: true, // Change this line
        validate: {
            validator: function (value: string) {
                return /^\d{10}$/.test(value);
            },
            message: "Mobile no must be 10 digits long and contain only numbers"
        }
    },
    password: String,
    dob: Date,
    image: String,
    gender: String,
    created_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    role_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
    },
    is_active: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    is_super_admin: {
        type: Boolean,
        default: false
    },
    is_approved: {
        type: Number,
        validate: {
            validator: function (value: number) {
                return value === 0 || value === 1;
            },
            message: "is_approved field should be either 0 or 1"
        },
        default: 1
    },
    deleted_at: { type: Date, default: null }
}, {
    timestamps: true,
    validateBeforeSave: true
});

// Custom error handler to remove field name from error message
userSchema.post('validate', function (error: any, doc: User, next: (err?: Error) => void) {
    if (error) {
        for (let field in error.errors) {
            if (error.errors.hasOwnProperty(field)) {
                error.message = error.errors[field].message;
                break;
            }
        }
    }
    next(error);
});

export default mongoose.model<User>("User", userSchema);
