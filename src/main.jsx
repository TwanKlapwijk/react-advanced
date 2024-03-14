import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { Root } from "./components/Root";
import { Loader as createEventLoader, NewEventPage } from "./pages/CreateEventPage";
import { EventPage, Loader as eventLoader } from "./pages/EventPage";
import { EventsPage } from "./pages/EventsPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <EventsPage />,
      },
      {
        path: "/event/:eventId",
        element: <EventPage />,
        loader: eventLoader,
      },
      {
        path: "/event/create",
        element: <NewEventPage />,
        loader: createEventLoader,
      },
    ],
  },
]);
// @ts-ignore
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
