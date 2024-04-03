import mongoose, { Schema, Document, Types } from 'mongoose';

export interface Category extends Document {
    user_id: Types.ObjectId;
    name: string;
    category_image?: string;
    description?: string;
    is_active?: string;
    deleted_at?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}

const categorySchema = new Schema<Category>({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    name:{
        type: String,
        required: [true, "Category name is required"]
        // unique: [true, "Name already taken"],
    },
    description: String,
    category_image: String, 
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

// Custom error handler to remove field name from error message
categorySchema.post('validate', function (error: any, doc: Category, next: (err?: Error) => void) {
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

export default mongoose.model<Category>("Category", categorySchema);