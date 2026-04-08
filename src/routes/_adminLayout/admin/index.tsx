import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_adminLayout/admin/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="px-10 flex">
      <div className="flex flex-col gap-2 mr-10">
        <Button
          render={(props) => (
            <Link to="/admin/about-us" {...props}>
              Control About Us
            </Link>
          )}
        />
        <Button
          render={(props) => (
            <Link to="/admin/events" {...props}>
              Control Events
            </Link>
          )}
        />
        <Button
          render={(props) => (
            <Link to="/admin/newsletter" {...props}>
              Control Newsletter
            </Link>
          )}
        />
      </div>
      <pre className="whitespace-pre">
        {`/
├── /about-us
├── /events
├── /gallery
│
├── /login
├── /signup
├── /forgot-password
├── /reset-password
│
├── /admin
│   ├── /admin
│   ├── /admin/about-us
│   ├── /admin/events
│   └── /admin/newsletter
│
├── /all-users
├── /community
├── /create-post
├── /edit-post/:postId
├── /explore
├── /liked-posts
├── /saved-posts
│
├── /posts/:postId
│
├── /messages
│   ├── /messages
│   └── /messages/:userId
│
├── /newsletter
│   ├── /newsletter
│   └── /newsletter/:newsId
│
└── /u/:userId`}
      </pre>
    </div>
  );
}
