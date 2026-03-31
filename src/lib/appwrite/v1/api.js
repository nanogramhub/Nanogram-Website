import { ID, Query } from "appwrite";
import { account, appwriteConfig, avatars, database, storage } from "./config";
import { getUserKarma } from "../utils";
import { get } from "react-hook-form";

// ==================
// Auth Functions
// ==================

// Check if username is available
export async function checkUsernameAvailability(username) {
  try {
    const sanitizedUsername = username.trim();

    const userDocuments = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("username", sanitizedUsername)]
    );

    return userDocuments.total === 0;
  } catch (error) {
    console.error("Error checking username availability:", error);
    return false;
  }
}
// Create a new user account
export async function createUserAccount(user) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}
// Save user to database
export async function saveUserToDB(user) {
  try {
    const newUser = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );
    return newUser;
  } catch (error) {
    console.log(error);
  }
}
// Sign in to user account
export async function signInAccount(user) {
  try {
    let email = user.email;

    if (user.username) {
      const userDocuments = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal("username", user.username)]
      );

      if (!userDocuments || userDocuments.total === 0) {
        throw new Error("Username not found");
      }

      email = userDocuments.documents[0].email;
    }

    const session = await account.createEmailPasswordSession(
      email,
      user.password
    );
    console.log("Session created:", session);

    return session;
  } catch (error) {
    console.log("Error signing in:", error);
  }
}
// Get account details
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error("Account not found");

    return currentAccount;
  } catch (error) {
    if (error?.message === "User (role: guests) missing scope (account)") {
      console.log("No user session found. Proceeding as unauthenticated.");
      return null;
    }
  }
}
// Get current user details
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw new Error("No account found");

    const currentUser = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser.documents.length)
      throw new Error("User not found in database");

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    throw Error;
  }
}
// Sign out of account
export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.log(error);
  }
}

// ==================
// Post Functions
// ==================

// Create a new post
export async function createPost(post) {
  try {
    // Upload file to appwrite storage
    const uploadedFile = await uploadFile(post.image);

    if (!uploadedFile) throw Error;

    // Get file url
    const fileUrl = storage.getFileDownload(
      appwriteConfig.storageId,
      uploadedFile.$id
    );
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    // Convert tags into array
    const tags = post.tags
      ? post.tags.replace(/ /g, "").split(",")
      : null || [];

    // Create post in database
    const newPost = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}
// Upload file to storage
export async function uploadFile(file) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}
// Delete File
export async function deleteFile(fileId) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}
// Download File
export async function downloadFile(fileId, fileName) {
  try {
    const fileURL = storage.getFileDownload(appwriteConfig.storageId, fileId);

    const response = await fetch(fileURL);
    const blob = await response.blob();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;

    link.click();

    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error("Error downloading file:", error);
  }
}

// Update post
export async function updatePost(post) {
  const hasFileTOUpdate = post.image instanceof File;
  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileTOUpdate) {
      // Upload file to appwrite storage
      const uploadedFile = await uploadFile(post.image);
      if (!uploadedFile) throw Error;

      // Get file url
      const fileUrl = storage.getFileDownload(
        appwriteConfig.storageId,
        uploadedFile.$id
      );
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Update post to database
    const updatedPost = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        tags: tags,
      }
    );

    if (!updatedPost) {
      await deleteFile(post.imageId);
      throw Error;
    }

    // Safely delete old file after successful update
    if (post.imageId && hasFileTOUpdate) {
      await deleteFile(post.imageId);
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}
// Delete post
export async function deletePost(postId, imageId) {
  if (!postId || !imageId) throw new Error("Missing postId or imageId");
  try {
    // Delete the post from the database
    await database.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    );

    // Delete the image associated with the post
    await deleteFile(imageId);

    return { status: "ok" };
  } catch (error) {
    console.error("Error deleting post or related saves:", error);
  }
}
// Get recent posts
export async function getRecentPosts() {
  try {
    const posts = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );

    if (!posts || posts.total === 0) {
      throw new Error("No posts found.");
    }

    return posts;
  } catch (error) {
    console.log(error);
    return [];
  }
}
// Like a post
export async function likePost(postId, likesArray) {
  try {
    const updatedPost = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );
    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}
// Save a post
export async function savePost(postId, userId) {
  try {
    const updatedPost = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}
// Unsave a post
export async function unSavePost(savedRecordId) {
  try {
    const statusCode = await database.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );

    if (!statusCode) throw Error;

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}
// Get post by ID
export async function getPostById(postId) {
  try {
    const post = await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}
// Get Infinite Posts
export async function getInfinitePosts(pageParam) {
  const queries = [Query.orderDesc("$updatedAt"), Query.limit(10)];

  if (pageParam && typeof pageParam === "string") {
    queries.push(Query.cursorAfter(pageParam));
  }

  try {
    const posts = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      queries
    );

    if (!posts) throw new Error("Failed to fetch posts");

    return posts;
  } catch (error) {
    console.error("Error in getInfinitePosts:", error);
  }
}
// Search posts
export async function searchPosts(searchTerm) {
  try {
    // Determine the query field based on input
    const queries = [];
    if (searchTerm.startsWith("#")) {
      // Search in 'tags' field
      const tagTerm = searchTerm.slice(1); // Remove '#' from the search term
      queries.push(Query.search("tags", tagTerm));
    } else {
      // Search in 'caption' field
      queries.push(Query.search("caption", searchTerm));
    }

    // Fetch posts based on the generated query
    const posts = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      queries
    );

    if (!posts) throw new Error("No posts found");

    return posts;
  } catch (error) {
    console.error("Error in searchPosts:", error);
  }
}
// Related posts
export async function relatedPosts(post) {
  try {
    const words = post?.caption.split(" ").filter((word) => word.trim() !== "");
    const tagQueries = post?.tags.map((tag) => Query.search("tags", tag));

    // Create an array of promises for caption search queries
    const captionQueries = words.map((word) => Query.search("caption", word));

    // Run all queries concurrently for both captions and tags using Promise.all
    const results = await Promise.all([
      ...captionQueries.map((query) =>
        database.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.postsCollectionId,
          [query]
        )
      ),
      ...tagQueries.map((query) =>
        database.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.postsCollectionId,
          [query]
        )
      ),
    ]);

    // Use a Set to keep track of unique post IDs
    const uniquePostIds = new Set();
    const relatedPosts = [];

    // Process the results
    results.forEach((res) => {
      if (res?.documents) {
        res.documents.forEach((relatedPost) => {
          if (
            relatedPost.$id !== post.$id &&
            !uniquePostIds.has(relatedPost.$id)
          ) {
            relatedPosts.push(relatedPost);
            uniquePostIds.add(relatedPost.$id);
          }
        });
      }
    });

    return relatedPosts;
  } catch (error) {
    console.error("Error searching posts:", error);
  }
}
// Get saved posts
export async function getSavedPosts(currentUser) {
  if (!currentUser?.save?.length) {
    return [];
  }
  try {
    const savedPosts = await Promise.all(
      currentUser.save.map((save) => getPostById(save.post.$id))
    );
    if (!savedPosts) throw Error;
    return savedPosts.reverse();
  } catch (error) {
    console.error("Error fetching saved posts:", error);
  }
}
// Get user posts
export async function getUserPosts(userId) {
  if (!userId) return;

  try {
    const post = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}
// Get user top posts
export async function getUserTopPosts(userId) {
  if (!userId) return;

  try {
    const post = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    if (!post) throw Error;

    post.documents.sort(
      (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
    );

    return post;
  } catch (error) {
    console.log(error);
  }
}

// ==================
// News Functions
// ==================
// Create a new news
export async function createNews(news) {
  if (!news) return;

  try {
    const uploadedFile = await uploadFile(news.file);

    if (!uploadedFile) throw Error;

    const fileUrl = storage.getFileDownload(
      appwriteConfig.storageId,
      uploadedFile.$id
    );
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    const newNews = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.newsCollectionId,
      ID.unique(),
      {
        title: news.title,
        fileId: uploadedFile.$id,
        fileUrl: fileUrl,
      }
    );

    if (!newNews) {
      await deleteFile(uploadedFile.$id);
    }

    return newNews;
  } catch (error) {
    console.log(error);
  }
}
// Get news
export async function getNews() {
  try {
    const news = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.newsCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );

    if (!news) throw Error;

    return news;
  } catch (error) {
    console.log(error);
  }
}
// Get news by id
export async function getNewsById(newsId) {
  if (!newsId) return;
  try {
    const news = await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.newsCollectionId,
      newsId
    );

    if (!news) throw Error;

    return news;
  } catch (error) {
    console.log(error);
  }
}
// Update news
export async function updateNews(news) {
  try {
    const hasFileToUpdate = news.file instanceof File;
    let file = {
      fileUrl: news.fileUrl,
      fileId: news.fileId,
    };

    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(news.file);
      if (!uploadedFile) throw Error;

      const fileUrl = storage.getFileDownload(
        appwriteConfig.storageId,
        uploadedFile.$id
      );
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      file = { ...file, fileUrl: fileUrl, fileId: uploadedFile.$id };
    }

    const updatedNews = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.newsCollectionId,
      news.id,
      {
        title: news.title,
        fileUrl: file.fileUrl,
        fileId: file.fileId,
      }
    );

    if (!updatedNews) {
      await deleteFile(file.fileId);
      throw Error;
    }

    if (news.fileId && hasFileToUpdate) {
      await deleteFile(news.fileId);
    }

    return updatedNews;
  } catch (error) {
    console.log(error);
  }
}
// Delete news
export async function deleteNews(newsId, fileId) {
  if (!newsId) return;
  try {
    await database.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.newsCollectionId,
      newsId
    );

    await deleteFile(fileId);

    return { status: "ok", newsId: newsId };
  } catch (error) {
    console.log(error);
  }
}

// ==================
// Comment Functions
// ==================
// Create a new comment
export async function createComment(comment) {
  try {
    const newComment = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      ID.unique(),
      {
        post: comment.postId,
        commentor: comment.userId,
        content: comment.content,
        likes: [],
      }
    );

    if (!newComment) throw Error;

    return newComment;
  } catch (error) {
    console.log(error);
  }
}
// Like a comment
export async function likeComment(commentId, likesArray) {
  try {
    const updatedComment = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      commentId,
      {
        likes: likesArray,
      }
    );
    if (!updatedComment) throw Error;

    return updatedComment;
  } catch (error) {
    console.log(error);
  }
}
// Delete a comment
export async function deleteComment(commentId) {
  try {
    await database.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      commentId
    );

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

// ==================
// Message Functions
// ==================
// Create a new message
export async function createMessage(message) {
  try {
    const newMessage = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      ID.unique(),
      {
        sender: message.senderId,
        receiver: message.receiverId,
        content: message.content,
      }
    );

    if (!newMessage) throw Error;

    return newMessage;
  } catch (error) {
    console.log(error);
  }
}
// Get messages
export async function getMessages(pageParam, senderId, receiverId) {
  const queries = [
    Query.or([
      Query.and([
        Query.equal("sender", senderId),
        Query.equal("receiver", receiverId),
      ]),
      Query.and([
        Query.equal("sender", receiverId),
        Query.equal("receiver", senderId),
      ]),
    ]),
    Query.orderDesc("$createdAt"),
    Query.limit(20),
  ];

  if (pageParam && typeof pageParam === "string") {
    queries.push(Query.cursorAfter(pageParam));
  }

  try {
    const messages = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      queries
    );

    if (!messages) throw Error;

    return messages;
  } catch (error) {
    console.log(error);
  }
}
// Update a message
export async function updateMessage(message) {
  try {
    const updatedMessage = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      message.id,
      {
        content: message.content,
        reactions: message.reactions.slice(
          0,
          Math.min(2, message.reactions.length)
        ),
      }
    );

    if (!updatedMessage) throw Error;

    return updatedMessage;
  } catch (error) {
    console.log(error);
  }
}
// Delete a message
export async function deleteMessage(messageId) {
  try {
    await database.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      messageId
    );

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

// ==================
// User Functions
// ==================
// Get users
export async function getUsers(limit) {
  const queries = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  try {
    const users = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}
// Search users
export async function searchUsers(searchTerm) {
  try {
    // Determine the query field based on input
    const queries = [];
    if (searchTerm.startsWith("@")) {
      // Search in 'username' field
      const usernameTerm = searchTerm.slice(1); // Remove '@' from the search term
      queries.push(Query.search("username", usernameTerm));
    } else {
      // Search in 'name' field
      queries.push(Query.search("name", searchTerm));
    }

    // Fetch posts based on the generated query
    const users = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    );

    if (!users) throw new Error("No users found");

    return users;
  } catch (error) {
    console.error("Error in searchPosts:", error);
  }
}
// Get user by ID
export async function getUserById(userId) {
  try {
    const user = await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    if (!user) throw Error;

    return user;
  } catch (error) {
    console.log(error);
  }
}
// Follow user
export async function followUser(followerId, followedId) {
  try {
    if (!followerId || !followedId) {
      throw new Error("One or both user IDs do not exist");
    }
    const updatedUser = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      ID.unique(),
      {
        follower: followerId,
        followed: followedId,
      }
    );

    if (!updatedUser) throw Error;

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}
// Unfollow user
export async function unFollowUser(followedRecordId) {
  try {
    const statusCode = await database.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      followedRecordId
    );

    if (!statusCode) throw Error;

    return { status: "ok", followedId: followedRecordId };
  } catch (error) {
    console.log(error);
  }
}
// Update user profile
export async function updateUser(user) {
  const hasFileToUpdate = user.avatar instanceof File;
  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(user.avatar);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = storage.getFileDownload(
        appwriteConfig.storageId,
        uploadedFile.$id
      );
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    //  Update user
    const updatedUser = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      {
        name: user.name,
        email: user.email,
        bio: user.bio,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
      }
    );

    // Failed to update
    if (!updatedUser) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}
// Update user karma
export async function updateUserKarma(user) {
  try {
    const updatedUser = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.$id,
      {
        karma: getUserKarma(user),
      }
    );

    if (!updatedUser) throw Error;

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}
// Get top users by karma
export async function getTopUsers(limit) {
  try {
    const users = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.orderDesc("karma"), Query.limit(limit)]
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}

// ==================
// Nanogram Functions
// ==================
// Get testimonial
export async function getTestimonials() {
  try {
    const response = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.nanogramCollectionId,
      [Query.orderAsc("$createdAt"), Query.limit(20)]
    );

    if (!response || !response.documents || response.documents.length === 0) {
      throw new Error("No testimonials found.");
    }

    return response.documents
      .filter((doc) => doc.content) // Filter out documents without content
      .map((doc) => ({
        id: doc.$id,
        name: doc.name || "Anonymous",
        role: doc.role || "N/A",
        content: doc.content,
        avatarUrl: doc.avatarUrl || "/assets/images/placeholder.png", // Default placeholder
      }));
  } catch (error) {
    console.error("Error in getTestimonials:", error);
    return [];
  }
}
// Get all nanogram
export async function getAllNanograms() {
  try {
    const response = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.nanogramCollectionId,
      [Query.orderAsc("priority"), Query.limit(30)]
    );
    if (!response) {
      throw new Error("No nanograms found.");
    }
    return response;
  } catch (error) {
    console.error("Error in getAllNanograms:", error);
  }
}
// Get core team members
export async function getCoreMembers() {
  try {
    const core = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.nanogramCollectionId,
      [Query.orderAsc("priority"), Query.limit(30)]
    );

    if (!core || core.total === 0) {
      throw new Error("No member found.");
    }

    return core.documents.filter((doc) => doc.core);
  } catch (error) {
    console.error("Error in getCoreMembers:", error);
    return [];
  }
}
// Get alumini members
export async function getAluminiMembers() {
  try {
    const alumini = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.nanogramCollectionId,
      [Query.orderAsc("priority"), Query.limit(20)]
    );

    if (!alumini || alumini.total === 0) {
      throw new Error("No alumini found.");
    }

    return alumini.documents.filter((doc) => doc.alumini);
  } catch (error) {
    console.error("Error in getAluminiMembers:", error);
    return [];
  }
}
// Create a new nanogram
export async function createNanogram(data) {
  try {
    const uploadedFile = await uploadFile(data.file);

    if (!uploadedFile) throw Error;

    const fileUrl = storage.getFileDownload(
      appwriteConfig.storageId,
      uploadedFile.$id
    );
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }
    const nanogram = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.nanogramCollectionId,
      ID.unique(),
      {
        name: data.name,
        role: data.role,
        content: data.content.length !== 0 ? data.content : null,
        avatarUrl: fileUrl,
        avatarId: uploadedFile.$id,
        linkedin: data.linkedin.length !== 0 ? data.linkedin : null,
        instagram: data.instagram.length !== 0 ? data.instagram : null,
        github: data.github.length !== 0 ? data.github : null,
        alumini: data.alumini,
        core: data.core,
        priority: data.priority,
      }
    );
    if (!nanogram) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }
    return nanogram;
  } catch (error) {
    console.error("Error in createNanogram:", error);
  }
}
// Update a nanogram
export async function updateNanogram(data) {
  try {
    const hasFileToUpdate = data.file instanceof File;
    let file = {
      avatarUrl: data.avatarUrl,
      avatarId: data.avatarId,
    };

    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(data.file);
      if (!uploadedFile) throw Error;

      const fileUrl = storage.getFileDownload(
        appwriteConfig.storageId,
        uploadedFile.$id
      );
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      file = { ...file, avatarUrl: fileUrl, avatarId: uploadedFile.$id };
    }
    const nanogram = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.nanogramCollectionId,
      data.id,
      {
        name: data.name,
        role: data.role,
        content: data.content,
        avatarUrl: file.avatarUrl,
        avatarId: file.avatarId,
        linkedin: data.linkedin ? data.linkedin : null,
        instagram: data.instagram ? data.instagram : null,
        github: data.github ? data.github : null,
        alumini: data.alumini ? data.alumini : null,
        core: data.core ? data.core : null,
        priority: data.priority,
      }
    );
    if (!nanogram) {
      await deleteFile(file.avatarId);
      throw Error;
    }
    if (data.avatarId && hasFileToUpdate) {
      await deleteFile(data.avatarId);
    }
    return nanogram;
  } catch (error) {
    console.error("Error in updateNanogram:", error);
  }
}
// Delete a nanogram
export async function deleteNanogram(nanogramId, avatarId) {
  try {
    await database.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.nanogramCollectionId,
      nanogramId
    );
    await deleteFile(avatarId);
    return { status: "ok", nanogramId: nanogramId };
  } catch (error) {
    console.error("Error in deleteNanogram:", error);
  }
}

// ==================
// Event Functions
// ==================
// Get events
export async function getEvents() {
  try {
    const events = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.eventsCollectionId,
      [Query.orderDesc("date"), Query.limit(20), Query.equal("completed", true)]
    );

    if (!events) throw Error;

    return events;
  } catch (error) {
    console.log(error);
  }
}
// Get Next Event
export async function getNextEvent() {
  try {
    const events = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.eventsCollectionId,
      [Query.orderAsc("date"), Query.limit(1), Query.equal("completed", false)]
    );

    if (!events) throw Error;

    return events.documents[0];
  } catch (error) {
    console.log(error);
  }
}
// Get Last Event
export async function getLastEvent() {
  try {
    const events = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.eventsCollectionId,
      [Query.orderDesc("date"), Query.limit(1), Query.equal("completed", true)]
    );

    if (!events) throw Error;

    return events.documents[0];
  } catch (error) {
    console.log(error);
  }
}
// Get Scheduled Events
export async function getUpcomingEvents() {
  try {
    const events = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.eventsCollectionId,
      [Query.orderAsc("date"), Query.limit(20), Query.equal("completed", false)]
    );

    if (!events) throw Error;

    return events;
  } catch (error) {
    console.log(error);
  }
}
// Create a new event
export async function createEvent(event) {
  try {
    const uploadedFile = await uploadFile(event.image);

    if (!uploadedFile) throw Error;

    const fileUrl = storage.getFileDownload(
      appwriteConfig.storageId,
      uploadedFile.$id
    );
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    const newEvent = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.eventsCollectionId,
      ID.unique(),
      {
        title: event.title,
        subtitle: event.subtitle,
        description: event.description,
        content: event.content,
        completed: event.completed,
        registration:
          event.registration.length !== 0 ? event.registration : null,
        date: event.date,
        location: event.location,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
      }
    );

    if (!newEvent) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newEvent;
  } catch (error) {
    console.log(error);
  }
}
// Get All Events
export async function getAllEvents() {
  try {
    const events = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.eventsCollectionId,
      [Query.orderDesc("date")]
    );

    if (!events) throw Error;

    return events;
  } catch (error) {
    console.log(error);
  }
}
// Update Event
export async function updateEvent(event) {
  const hasFileToUpdate = event.image instanceof File;
  try {
    let image = {
      imageUrl: event.imageUrl,
      imageId: event.imageId,
    };

    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(event.image);
      if (!uploadedFile) throw Error;

      const fileUrl = storage.getFileDownload(
        appwriteConfig.storageId,
        uploadedFile.$id
      );
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    const updatedEvent = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.eventsCollectionId,
      event.id,
      {
        title: event.title,
        subtitle: event.subtitle,
        description: event.description,
        content: event.content,
        completed: event.completed,
        registration:
          event.registration.length !== 0 ? event.registration : null,
        date: event.date,
        location: event.location,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
      }
    );

    if (!updatedEvent) {
      await deleteFile(image.imageId);
      throw Error;
    }

    if (event.imageId && hasFileToUpdate) {
      await deleteFile(event.imageId);
    }

    return updatedEvent;
  } catch (error) {
    console.log(error);
  }
}
// Delete Event
export async function deleteEvent(eventId, imageId) {
  try {
    await database.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.eventsCollectionId,
      eventId
    );

    await deleteFile(imageId);

    return { status: "ok", eventId: eventId };
  } catch (error) {
    console.log(error);
  }
}
