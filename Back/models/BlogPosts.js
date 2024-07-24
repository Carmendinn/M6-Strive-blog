import mongoose from "mongoose";


const commentSchema = new mongoose.Schema(
    {
        name: { type: String, required: true},
        email: { type: String, required: true},
        content: { type: String, required: true}
    },
    {
        timeStamps : true,
        _id: true // id del commento univoco
    }
)



const blogPostsSchema = new mongoose.Schema({
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
        value: { type: Number, required: true },
        unit: { type: String, required: true }
    },
    author: { type: String, required: true }, 
    content: { type: String, required: true },
    comments:[commentSchema],
}, {
    timestamps: true,
    collection: "blogPosts"
});


export default mongoose.model("BlogPosts", blogPostsSchema);