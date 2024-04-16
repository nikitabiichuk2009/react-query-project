import { Link, Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";
import Header from "../Header.jsx";
import { useQuery } from "@tanstack/react-query";
import { fetchEvent } from "../../util/http.js";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import { queryClient } from "../../util/http.js";
import { useMutation } from "@tanstack/react-query";
import { deleteEvent } from "../../util/http.js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import Modal from "../UI/Modal.jsx";
export default function EventDetails() {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id);
  const {
    data: event,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["events", id],
    queryFn: ({ signal }) => fetchEvent({ id, signal }),
  });

  const {
    mutate,
    isPending: isPendingDelete,
    isError: isErorDelete,
    error: errorDelete,
  } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events"],
        refetchType: "none",
      });
      navigate("/events");
    },
  });

  function handleStartDelete() {
    setIsDeleting(true);
  }

  function handleCancelDelete() {
    setIsDeleting(false);
  }
  function handleDelete() {
    mutate({ id });
  }
  if (isPending) {
    return <LoadingIndicator />;
  }
  if (isError) {
    return (
      <>
        <Header>
          <Link to="/events" className="button">
            View all Events
          </Link>
        </Header>
        <div className="center">
          <ErrorBlock
            title="An error occurred!"
            message={
              error.info ? error.info.message : "Failed to load an event"
            }
          />
        </div>
      </>
    );
  }
  if (event) {
    const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return (
      <>
        {isDeleting && (
          <Modal onClose={handleCancelDelete}>
            <h2>Are you sure?</h2>
            <p style={{ fontSize: "1.2rem" }}>
              Are you sure you want to delete this event?
            </p>
            <div className="form-actions">
              {isPendingDelete && <LoadingIndicator />}
              {isErorDelete && (
                <ErrorBlock
                  title="An error occurred!"
                  message={
                    errorDelete.info
                      ? errorDelete.info.message
                      : "Failed to delete an event"
                  }
                />
              )}
              {!isPendingDelete && !isErorDelete && (
                <>
                  <button className="button-text" onClick={handleCancelDelete}>
                    Cancel
                  </button>
                  <button className="button" onClick={handleDelete}>
                    Delete
                  </button>
                </>
              )}
            </div>
          </Modal>
        )}

        <Outlet />
        <Header>
          <Link to="/events" className="button">
            View all Events
          </Link>
        </Header>

        <article id="event-details">
          <header>
            <h1>{event.title}</h1>
            <nav>
              <button className="delete" onClick={handleStartDelete}>
                Delete
              </button>
              <Link className="edit" to="edit">
                Edit
              </Link>
            </nav>
          </header>
          <div id="event-details-content">
            <img src={event.image} alt={event.title} />
            <div id="event-details-info">
              <div>
                <p id="event-details-location">EVENT LOCATION</p>
                <time dateTime={`Todo-DateT$Todo-Time`}>
                  {formattedDate} & {event.time}
                </time>
              </div>
              <p id="event-details-description">{event.description}</p>
            </div>
          </div>
        </article>
      </>
    );
  }
}
