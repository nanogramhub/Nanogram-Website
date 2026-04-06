export const queryKeys = {
  auth: {
    checkUsernameAvailability: ["auth", "username"],
    resetPassword: ["auth", "reset-password"],
    sendResetLink: ["auth", "send-reset-link"],
    getAllIdentities: ["auth", "identities"],
    getAllSessions: ["auth", "sessions"],
    deleteSession: ["auth", "delete-session"],
  },
  nanogram: {
    getTestimonials: ["nanogram", "testimonial"],
    getCoreMembers: ["nanogram", "core"],
    getAluminiMembers: ["nanogram", "alumini"],
  },
  events: {
    getEvents: ["events"],
    getNextEvent: ["events", "next"],
    getLatestCompletedEvent: ["events", "latest-completed"],
    getUpcomingEvents: ["events", "upcoming"],
  },
  users: {
    getUsers: ["users"],
    getUserByUsername: ["users", "username"],
    getUserByAccountId: ["users", "account-id"],
  },
  posts: {
    getRecentPosts: ["posts", "recent"],
    getPostById: ["posts", "id"],
    getPostsByUserId: ["posts", "user-id"],
    getLikedPosts: ["users", "liked-posts"],
    createPost: ["posts", "create"],
    updatePost: ["posts", "update"],
    updateLikes: ["posts", "likes"],
    deletePost: ["posts", "delete"],
  },
  comments: {
    getCommentsByPostId: ["comments", "post-id"],
    updateLikes: ["comments", "likes"],
    createComment: ["comments", "create"],
    deleteComment: ["comments", "delete"],
  },
  saves: {
    getSavedPosts: ["saves", "saved-posts"],
    savePost: ["saves", "save"],
    unsavePost: ["saves", "unsave"],
  },
  follows: {
    getFollowers: ["follows", "followers"],
    getFollowing: ["follows", "following"],
    followUser: ["follows", "follow"],
    unfollowUser: ["follows", "unfollow"],
  },
  newsletters: {
    getNewsletters: ["newsletters"],
  },
  messages: {
    getMessages: ["messages"],
    getContacts: ["messages", "contacts"],
    sendMessage: ["messages", "send"],
    updateMessage: ["messages", "update"],
    deleteMessage: ["messages", "delete"],
  },
};
