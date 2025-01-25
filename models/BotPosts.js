const mongoose=require('mongoose');

const postSchema=new mongoose.Schema({
  featuredImage: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true
  },
  metaDesc: {
    type: String,
    required: true,
  },
  keywords: {
    type: [String],
    required: true,
  },
  imdbRating: {
    type: String,
    default: "NA/10",
  },
  releaseYear: {
    type: String,
    required: true,
  },
  genres: {
    type: String,
    required: true,
  },
  quality: {
    type: String,
    required: true,
  },
  fileSize: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  starCast: {
    type: String,  // Array to store multiple actors
    required: true,
  },
  synopsis: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  postViews: {
    type: Number,
    default: () => Math.floor(Math.random()*(10000-100+1))+100,
  },
  uid: {
    type: Number,
    unique: true,
  },
  downloadLinks: Array,
  categories: {
    type: Array,
    default: []
  }
});


// Pre-save hook to increment the uid
postSchema.pre('save', async function (next) {
  if (this.isNew) {
    const lastPost=await this.constructor.findOne().sort({ uid: -1 });
    this.uid=lastPost? lastPost.uid+1:1; // Start at 1 if no post exists
  }
  next();
});

const Posts=mongoose.model('Post', postSchema);

// schema for the pages completed scarrping to save data and use it later
const pageSchema=new mongoose.Schema({
  pageUrl: {
    type: String,
    required: true,
  },
});

const Pages=mongoose.model('Page', pageSchema);



module.exports={
  Posts,
  Pages
};
