const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    numberViews: {
        type: Number,
        default: 0
    },
    likes: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    dislikes: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    image: {
        type: String,
        default: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fblog.hubspot.com%2Fmarketing%2Fyoutube-thumbnail&psig=AOvVaw17HZTg7ABaNF_VqGLjoRg6&ust=1703561647750000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCIDwifDTqYMDFQAAAAAdAAAAABAJ',
    },
    author: {
        type: String,
        default: 'Admin'
    }
},{
    timestamps: true,
    // toJSON là định nghĩa các đối tượng không có trong model cũng sẽ được tạo ra khi chạy đối tượng model này
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);