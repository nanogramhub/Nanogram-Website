import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../../../components/ui/Input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/Popover";
import { ChevronLeft, Ellipsis, Laugh, SendHorizontal } from "lucide-react";
import Button from "../../../components/ui/Button";
import {
  useCreateMessage,
  useDeleteMessage,
  useGetCurrentUser,
  useGetMessages,
  useGetUserById,
} from "../../../lib/react_query/queriesAndMutations";
import { ParseText } from "../../../components/shared/ParseText";
import { messageFormSchema } from "../../../lib/validation";
import { useToast } from "../../../components/ui/Toast";
import { useInView } from "react-intersection-observer";
import SpinLoader from "../../../components/shared/SpinLoader";

function ChatHeader({ contact }) {
  return (
    <div className="flex gap-3 w-full p-2">
      <Link to="/messages" className="flex gap-3 cursor-pointer items-center">
        <ChevronLeft />
      </Link>
      <Link
        to={`/profile/${contact?.$id}`}
        className="flex gap-3 cursor-pointer items-center"
      >
        <img
          src={contact?.imageUrl || "/assets/icons/user.svg"}
          alt="user"
          className="rounded-full md:size-10 size-8"
          loading="lazy"
        />

        <div className="flex justify-start flex-col">
          <p className="text-md font-semibold">{contact?.name}</p>
          <p className="text-xs font-light">@{contact?.username}</p>
        </div>
      </Link>
    </div>
  );
}

function ChatBody({ messages, currentUser, onDelete, hasNextPage, inViewRef }) {
  let lastMesssageSender = null;
  return (
    <div className="flex h-[50vh] flex-col-reverse justify-start flex-1 pt-5 overflow-y-scroll custom-scrollbar">
      {messages?.map((message) => {
        const receivedByCurrentUser =
          message?.receiver.$id === currentUser?.$id;
        const differentSender = lastMesssageSender !== message?.sender.$id;
        lastMesssageSender = message?.sender.$id;
        return (
          <div
            key={message.$id}
            className={`w-full group ${
              differentSender ? "pb-5" : "pb-1"
            } px-2 gap-2 flex items-end ${
              receivedByCurrentUser ? "flex-row" : "flex-row-reverse"
            }`}
          >
            {differentSender ? (
              <img
                src={message?.sender.imageUrl || "/assets/icons/user.svg"}
                alt="user"
                className={"rounded-full md:size-10 size-8"}
              />
            ) : (
              <div className="size-8 md:size-10"></div>
            )}
            <div
              className={`flex max-w-[69%] ${
                receivedByCurrentUser
                  ? "justify-start items-start"
                  : "justify-end items-end"
              }`}
            >
              <div className="flex flex-col gap-1">
                <p className="w-fit bg-primary text-neutral-white px-5 py-2 rounded-3xl">
                  {ParseText(message?.content)}
                </p>
              </div>
            </div>
            <div className="h-full flex-center">
              {currentUser?.$id === message?.sender.$id && (
                <Popover>
                  <PopoverTrigger>
                    <Ellipsis className="group-hover:block hidden" />
                  </PopoverTrigger>
                  <PopoverContent>
                    <Button
                      variant="ghost"
                      className="text-red-600"
                      onClick={() => onDelete(message.$id)}
                    >
                      Delete
                    </Button>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        );
      })}
      {hasNextPage && (
        <div ref={inViewRef} className="flex-center w-full py-5">
          <SpinLoader />
        </div>
      )}
    </div>
  );
}

function EmojiPicker() {
  return (
    <Popover>
      <PopoverTrigger>
        <Laugh />
      </PopoverTrigger>
      <PopoverContent>Place content for the popover here.</PopoverContent>
    </Popover>
  );
}

const Chats = () => {
  const { id } = useParams();
  const { ref, inView } = useInView();
  const { data: contact } = useGetUserById(id || "");
  const { data: currentUser } = useGetCurrentUser();
  const {
    data: messages,
    fetchNextPage,
    hasNextPage,
  } = useGetMessages({
    senderId: currentUser?.$id,
    receiverId: contact?.$id,
  });
  const { mutateAsync: sendMessage } = useCreateMessage();
  const { mutateAsync: deleteMessage } = useDeleteMessage();

  const toast = useToast();

  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    if (inView) fetchNextPage();
  }, [inView]);

  useEffect(() => {
    if (messages?.pages) {
      const allMessages = messages.pages.flatMap((page) => page.documents);
      setMessageList(allMessages);
    }
  }, [messages]);

  // Form State
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      comment: "",
    },
  });

  const message = watch("message");

  const handleDelete = async (messageId) => {
    setMessageList((prev) =>
      prev.filter((message) => message.$id !== messageId)
    );
    const status = await deleteMessage(messageId);
    if (!status) {
      toast({
        title: "Delete Failed!",
        description:
          "There was an error in deleting your message. Please try again.",
      });
    }
  };

  const onSubmit = async (data) => {
    setValue("message", "");
    const optimisticMessage = {
      $id: Math.random().toString(36),
      content: data.message,
      sender: currentUser,
      receiver: contact,
    };
    setMessageList((prev) => [optimisticMessage, ...prev]);
    const newMessage = await sendMessage({
      senderId: currentUser?.$id,
      receiverId: contact?.$id,
      content: data.message,
    });
    if (!newMessage) {
      toast({
        title: "Message Failed!",
        description:
          "There was an error in sending your message. Please try again.",
      });
    }
  };

  return (
    <div className="flex w-full h-full flex-col">
      <ChatHeader contact={contact} />
      <hr className="w-full" />
      <ChatBody
        messages={messageList}
        currentUser={currentUser}
        onDelete={handleDelete}
        hasNextPage={hasNextPage}
        inViewRef={ref}
      />
      <form className="relative" onSubmit={handleSubmit(onSubmit)}>
        <Input
          icon={<EmojiPicker />}
          type="text"
          id="message"
          placeholder="Write a message..."
          className="pr-14"
          autoComplete="off"
          {...register("message")}
        />
        <Button
          variant="link"
          type="submit"
          className="absolute right-0 top-1"
          disabled={!message?.trim()}
        >
          <SendHorizontal />
        </Button>
      </form>
    </div>
  );
};

export default Chats;
