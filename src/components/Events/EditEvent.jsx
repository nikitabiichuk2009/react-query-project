// The Focus React Query Approach with optimisting updating, i prefer it more

import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import { useParams } from "react-router-dom";
import { fetchEvent } from "../../util/http.js";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import { useMutation } from "@tanstack/react-query";
import { updateEvent } from "../../util/http.js";
import { queryClient } from "../../util/http.js";

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: event,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["events", id],
    queryFn: ({ signal }) => fetchEvent({ id, signal }),
  });
  const { mutate } = useMutation({
    mutationFn: updateEvent,
    onMutate: async (data) => {
      const newEvent = data.event;
      await queryClient.cancelQueries({ queryKey: ["events", id] });
      const previousEvent = queryClient.getQueryData(["events", id]);
      queryClient.setQueryData(["events", id], newEvent);
      return { previousEvent };
    },
    onError: (error, data, context) => {
      queryClient.setQueryData(["events", id], context.previousEvent);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["events", id]);
    },
  });

  function handleSubmit(formData) {
    mutate({ id, event: formData });
    navigate("../");
  }

  function handleClose() {
    navigate("../");
  }

  return (
    <Modal onClose={handleClose}>
      {isPending && <LoadingIndicator />}
      {isError && (
        <>
          <ErrorBlock
            title="An error occurred"
            message={
              error.info
                ? error.info.message
                : "Failed to load an event's data."
            }
          />
          <div className="form-actions">
            <button className="button" onClick={handleClose}>
              Okay
            </button>
          </div>
        </>
      )}
      {!isPending && !isError && (
        <EventForm inputData={event} onSubmit={handleSubmit}>
          <Link to="../" className="button-text">
            Cancel
          </Link>
          <button type="submit" className="button">
            Update
          </button>
        </EventForm>
      )}
    </Modal>
  );
}

// The React Router features combined with React Query Approach

// import {
//   Link,
//   redirect,
//   useNavigate,
//   useSubmit,
//   useNavigation,
// } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import Modal from "../UI/Modal.jsx";
// import EventForm from "./EventForm.jsx";
// import { useParams } from "react-router-dom";
// import { fetchEvent } from "../../util/http.js";
// import ErrorBlock from "../UI/ErrorBlock.jsx";
// import { updateEvent } from "../../util/http.js";
// import { queryClient } from "../../util/http.js";
// export default function EditEvent() {
//   const { state } = useNavigation();
//   const submit = useSubmit();
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const {
//     data: event,
//     isError,
//     error,
//   } = useQuery({
//     queryKey: ["events", id],
//     queryFn: ({ signal }) => fetchEvent({ id, signal }),
//     staleTime: 10000,
//   });

//   function handleSubmit(formData) {
//     submit(formData, { method: "PUT" });
//   }

//   function handleClose() {
//     navigate("../");
//   }

//   return (
//     <Modal onClose={handleClose}>
//       {isError && (
//         <>
//           <ErrorBlock
//             title="An error occurred"
//             message={
//               error.info
//                 ? error.info.message
//                 : "Failed to load an event's data."
//             }
//           />
//           <div className="form-actions">
//             <button className="button" onClick={handleClose}>
//               Okay
//             </button>
//           </div>
//         </>
//       )}
//       {!isError && (
//         <EventForm inputData={event} onSubmit={handleSubmit}>
//           {state === "submitting" ? (
//             <p>Submitting...</p>
//           ) : (
//             <>
//               <Link to="../" className="button-text">
//                 Cancel
//               </Link>
//               <button type="submit" className="button">
//                 Update
//               </button>
//             </>
//           )}
//         </EventForm>
//       )}
//     </Modal>
//   );
// }

// export function loader({ request, params }) {
//   const id = params.id;
//   return queryClient.fetchQuery({
//     queryKey: ["events", id],
//     queryFn: ({ signal }) => fetchEvent({ id, signal }),
//   });
// }

// export async function action({ request, params }) {
//   const formData = await request.formData();
//   const updatedEvents = Object.fromEntries(formData);
//   await updateEvent({ id: params.id, event: updatedEvents });
//   await queryClient.invalidateQueries(["events"]);
//   return redirect("../");
// }
