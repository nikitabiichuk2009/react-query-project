// import { useQuery } from "@tanstack/react-query";
// import LoadingIndicator from "../UI/LoadingIndicator.jsx";
// import ErrorBlock from "../UI/ErrorBlock.jsx";
// import EventItem from "./EventItem.jsx";
// import { fetchEvents } from "../../util/http.js";
// export default function NewEventsSection() {
//   const { data, isPending, isError, error } = useQuery({
//     queryKey: ["events", { max: 3 }],
//     queryFn: ({ signal, queryKey }) => fetchEvents({ signal, ...queryKey[1] }),
//     // staleTime: 5000, default staleTime is 0
//     // `staleTime` is the duration in milliseconds for which cached data is considered fresh and can be used, even after its expiration.
//     // By default, `staleTime` is set to 0, meaning the cache will not consider data fresh after its expiration.

//     // gcTime: 3000000 defaults value is 5 min
//     // `gcTime` is the duration in milliseconds after which stale cache entries are removed automatically.
//     // By default, `gcTime` is set to 5 minutes (300000 milliseconds).
//   });
//   let content;

//   if (isPending) {
//     content = <LoadingIndicator />;
//   }

//   if (isError) {
//     content = (
//       <ErrorBlock
//         title="An error occurred"
//         message={
//           error.info ? error.info.message : "Failed to load recent events!"
//         }
//       />
//     );
//   }

//   if (data) {
//     content = (
//       <ul className="events-list">
//         {data.map((event) => (
//           <li key={event.id}>
//             <EventItem event={event} />
//           </li>
//         ))}
//       </ul>
//     );
//   }

//   return (
//     <section className="content-section" id="new-events-section">
//       <header>
//         <h2>Recently added events</h2>
//       </header>
//       {content}
//     </section>
//   );
// }

// RECENTLY ADDED EVENTS FOCUS

import { useQuery } from "@tanstack/react-query";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import EventItem from "./EventItem.jsx";
import { fetchEvents } from "../../util/http.js";
export default function NewEventsSection() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
    // staleTime: 5000, default staleTime is 0
    // `staleTime` is the duration in milliseconds for which cached data is considered fresh and can be used, even after its expiration.
    // By default, `staleTime` is set to 0, meaning the cache will not consider data fresh after its expiration.

    // gcTime: 3000000 defaults value is 5 min
    // `gcTime` is the duration in milliseconds after which stale cache entries are removed automatically.
    // By default, `gcTime` is set to 5 minutes (300000 milliseconds).
  });
  let content;

  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock
        title="An error occurred"
        message={
          error.info ? error.info.message : "Failed to load recent events!"
        }
      />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="new-events-section">
      <header>
        <h2>All added events</h2>
      </header>
      {content}
    </section>
  );
}

// ALL ADDED EVENTS FOCUS
