const Blog = require("../model/Blog");
const containerClient = require("../config/azureBlob");
const { v1: uuidv1 } = require("uuid");

const getAllBlogs = async (req, res) => {
  const blogs = await Blog.find();
  if (!blogs) return res.status(204).json({ message: "No users found" });
  res.json(blogs);
};

// handle adding new blog
const addBlog = async (req, res) => {
  const { title, blog } = req.body;
  const { image } = req.files;

  if (!title || !blog) {
    // console.log(req.files);
    return res.status(400).json({ message: "title and bolg required" });
  }

  try {
    let url = "";
    if (image) {
      const mimetype = image.mimetype;
      const spl = mimetype.split("/");
      const imageName = uuidv1() + `.${spl[1]}`;
      console.log(imageName, "image name will be hre!!!");
      const blockBlobClient = containerClient.getBlockBlobClient(imageName);
      url = blockBlobClient.url;
      const data = image.data;
      const uploadBlobResponse = await blockBlobClient.upload(
        data,
        data.length
      );

      console.log(
        `Blob was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`
      );
    } else {
    }

    // console.log(image, "file from form");
    const result = await Blog.create({
      title: title,
      description: blog,
      createdAt: Date.now(),
      image: url,
    });

    console.log(result);
    res
      .status(201)
      .json({ messaeg: `new Blog with title of ${result.title} created!` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

//  get single blog
const getBlog = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Blog ID required" });
  const blog = await Blog.findOne({ _id: req.params.id }).exec();
  if (!blog) {
    return res
      .status(204)
      .json({ message: `Blog ID ${req.params.id} not found` });
  }
  res.json(blog);
};

// update blog
const updateBlog = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Blog ID required" });
  const blog = await Blog.findOne({ _id: req.params.id }).exec();

  if (!blog) {
    return res
      .status(204)
      .json({ message: `Blog ID ${req.params.id} not found` });
  }

  if (req.body?.title) blog.title = req.body.title;
  if (req.body?.description) blog.description = req.body.description;
  const result = blog.save();
  res.json(result);
};

const deleteBlog = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Blog ID required" });

  const blog = await Blog.findOne({ _id: req.params.id }).exec();
  if (!blog) {
    return res
      .status(204)
      .json({ message: `Blog ID ${req.params.id} not found` });
  }

  const result = await blog.deleteOne();
  res.json(result);
};

module.exports = { getAllBlogs, addBlog, getBlog, updateBlog, deleteBlog };
