import { unseatTable } from "../utils/api";
// import { useEffect, useRef } from "react";

function Table({ table, loadDashboard }) {
  // const ref = useRef(null);
  function clickHandler() {
    if (window.confirm("Is this table ready to seat new guests?")) {
      const abortController = new AbortController();
      unseatTable(table.table_id, abortController.signal)
        .then(loadDashboard)
        .catch((error) => console.log("error", error));
      return () => abortController.abort();
    }
  }

  // useEffect(() => {
  //   const el2 = ref.current;
  //   if (table.reservation_id) {
  //     el2.classList.add("text-bg-secondary");
  //     el2.classList.add("opacity-50");
  //   }
  // }, [table.reservation_id]);

  return (
    <div
      // ref={ref}
      className="card mb-3 shadow-sm"
      // style={{ height: "18rem" }}
    >
      <h5 className="card-header">Table Name: {table.table_name}</h5>
      <div className="card-body">
        <h5 className="card-title">Capacity: {table.capacity}</h5>
        {table.reservation_id ? (
          <>
            <button
              onClick={clickHandler}
              className="btn btn-primary"
              type="button"
              data-table-id-finish={table.table_id}
            >
              Finish
              {table.table_id}
            </button>
            <p data-table-id-status={table.table_id}>Occupied</p>
          </>
        ) : (
          <p data-table-id-status={table.table_id}>Free</p>
        )}
      </div>
    </div>
  );
}

export default Table;
