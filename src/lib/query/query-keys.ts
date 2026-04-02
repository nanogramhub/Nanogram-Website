export const queryKeys = {
  auth: {
    checkUsernameAvailability: ["auth", "username"],
    resetPassword: ["auth", "reset-password"],
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
  posts: {
    getRecentPosts: ["posts", "recent"],
    getPostById: ["posts", "id"],
    searchPosts: ["posts", "search"],
  },
};
