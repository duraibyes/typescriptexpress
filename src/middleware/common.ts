const mongoose = require('mongoose');


function isValidObjectId(id : string) {
    return mongoose.Types.ObjectId.isValid(id);
}

export {  isValidObjectId };