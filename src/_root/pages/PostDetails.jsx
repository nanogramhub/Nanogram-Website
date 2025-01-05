import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import PostStats from "../../components/shared/PostStats";
import SpinLoader from "../../components/shared/SpinLoader";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../../components/ui/AlertDialog";
import { useToast } from "../../components/ui/Toast";
import Loader from "../../components/shared/Loader";
import { Ellipsis, FilePenLine, Trash } from "lucide-react";
import { timeAgo } from "../../lib/utils";
import { useUserContext } from "../../context/AuthContext";
import {
  useDeletePost,
  useGetPostById,
  useRelatedPosts,
} from "../../lib/react_query/queriesAndMutations";
import GridPostList from "../../components/shared/GridPostList";
import { ParseText } from "../../components/shared/ParseText";
import CommentList from "../../components/shared/CommentList";
import { getCurrentUser } from "../../lib/appwrite/api";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/Popover";

const PostDetails = () => {
  useEffect(() => {
    // Add overflow hidden to html and body when component mounts
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // Clean up the styles when component unmounts
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  const toast = useToast();

  const navigate = useNavigate();
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || "");
  const { mutateAsync: deletePost, isPending: isDeleting } = useDeletePost();
  const { user } = useUserContext();
  const { data: relatedPosts, isFetching } = useRelatedPosts(post);
  const { data: currentUser } = getCurrentUser();

  const [commentList, setCommentList] = useState([]);
  useEffect(() => {
    if (post?.comments) {
      const sortedComments = [...post.comments].sort(
        (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
      );
      setCommentList(sortedComments);
    }
  }, [post?.comments]);
  const handleDeleteComment = (commentId) => {
    setCommentList((prev) =>
      prev.filter((comment) => comment.$id !== commentId)
    );
  };

  useEffect(() => {
    // Add overflow hidden to html and body when component mounts
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // Clean up the styles when component unmounts
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  const handleConfirmDelete = async () => {
    try {
      await deletePost({ postId: post?.$id, imageId: post?.imageId });
      navigate("/community");
    } catch (error) {
      toast({
        title: "Delete Failed!",
        description:
          "There was an error in deleting your post. Please try again.",
      });
    }
  };

  return (
    <div className="post_details-container">
      {isPending ? (
        <SpinLoader />
      ) : (
        <div>
          <div className="post_details-card  shadow-2xl">
            <img
              src={post?.imageUrl}
              alt="creator"
              className="post_details-img"
              loading="lazy"
            />
            <div className="post_details-info">
              <div className="flex-between flex-wrap w-full">
                <Link
                  to={`/profile/${post?.creator.$id}`}
                  className="flex items-center gap-3"
                >
                  <img
                    src={post?.creator?.imageUrl || "/assets/icons/user.svg"}
                    alt={post?.creator.name || "creator"}
                    className="rounded-full size-8 lg:size-12"
                    loading="lazy"
                  />
                  <div className="flex flex-col">
                    <p className="base-medium lg:body-bold text-neutral-black">
                      {post?.creator.name}
                    </p>
                    <div className="flex-center gap-2 text-neutral-black font-light">
                      <p className="subtle-semibold lg:small-regular">
                        {timeAgo(post?.$createdAt)}
                      </p>
                    </div>
                  </div>
                </Link>
                <div className="flex-center">
                  <Popover>
                    <PopoverTrigger>
                      <Ellipsis />
                    </PopoverTrigger>
                    <PopoverContent className="flex flex-col">
                      <Button
                        variant="ghost"
                        className={`w-full ${
                          user.id !== post?.creator.$id && "hidden"
                        } text-primary`}
                        onClick={() => navigate(`/update-post/${post?.$id}`)}
                      >
                        <FilePenLine />
                        <p>Edit Post</p>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger>
                          <div
                            className={`py-2 px-4 w-full rounded-md font-semibold gap-3 text-sm flex-center text-red-600 hover:bg-primary/10 ${
                              user.id !== post?.creator.$id && "hidden"
                            }`}
                          >
                            <Trash /> <p>Delete Post</p>
                          </div>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your post.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleConfirmDelete}>
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex max-h-56 flex-col w-full small-medium lg:base-medium overflow-y-scroll custom-scrollbar">
                <p>{ParseText(post?.caption)}</p>
                <ul className="flex gap-1 mt-2">
                  {post.tags.length === 0
                    ? null
                    : post.tags.map((tag) => (
                        <li key={tag} className="text-primary font-light">
                          #{tag}
                        </li>
                      ))}
                </ul>
              </div>
              <hr className="border w-full border-neutral-black/50" />
              <div className="w-full flex flex-1"></div>
              <div className="w-full">
                <PostStats post={post} userId={user.id} showComments={true} />
              </div>
            </div>
          </div>
          <div className="mt-10 w-full">
            <h1 className="h3-bold mb-8">More related content</h1>
            {isFetching || isPending ? (
              <div className="flex-center w-full mt-8">
                <Loader />
              </div>
            ) : relatedPosts?.length === 0 ? (
              <p className="flex-center w-full mt-8">No Related posts</p>
            ) : (
              <GridPostList posts={relatedPosts} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
