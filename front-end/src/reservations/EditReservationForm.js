import { useState } from "react";
import { useHistory } from "react-router-dom";
import { updateReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function EditReservationForm({
  reservation: {
    first_name = "",
    last_name = "",
    mobile_number = "",
    reservation_date = "",
    reservation_time = "",
    people = 0,
  },
  reservation_id,
}) {
  const history = useHistory();

  const initialFormState = {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  };
  const [formData, setFormData] = useState({ ...initialFormState });
  const [formErrors, setFormErrors] = useState([]);

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    setFormErrors([]);
    const reservationDate = new Date(
      `${formData.reservation_date}T${formData.reservation_time}:00`
    );

    const [hours, minutes] = formData.reservation_time.split(":");

    const errors = [];

    if (Date.now() > Date.parse(reservationDate)) {
      errors.push({
        message: `Reservation must be for a future date or time.`,
      });
    }

    if (reservationDate.getDay() === 2) {
      errors.push({
        message: `Periodic Tables is closed on Tuesdays. Sorry!`,
      });
    }

    if ((hours <= 10 && minutes < 30) || hours <= 9) {
      errors.push({
        message: `Periodic Tables opens at 10:30 AM.`,
      });
    }

    if ((hours >= 21 && minutes > 30) || hours >= 22) {
      errors.push({
        message: `Periodic Tables stops accepting reservations at 9:30 PM.`,
      });
    }

    formData.people = Number(formData.people);

    setFormErrors(errors);

    updateReservation(formData, reservation_id, abortController.signal)
      .then((_) => {
        history.push(`/dashboard?date=${formData.reservation_date}`);
      })
      .catch((e) => console.log(e));

    return () => abortController.abort();
  };

  let displayErrors = formErrors.map((error) => (
    <ErrorAlert key={error} error={error} />
  ));

  return (
    <>
      {formErrors.length ? displayErrors : null}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="first_name">
            First Name:
          </label>
          <input
            required
            type="text"
            onChange={handleChange}
            value={formData.first_name}
            className="form-control"
            name="first_name"
          ></input>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="last_name">
            Last Name:
          </label>
          <input
            required
            type="text"
            onChange={handleChange}
            value={formData.last_name}
            className="form-control"
            name="last_name"
          ></input>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="mobile_number">
            Mobile Number:
          </label>
          <input
            required
            type="tel"
            onChange={handleChange}
            value={formData.mobile_number}
            className="form-control"
            name="mobile_number"
          ></input>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="reservation_date">
            Reservation Date:
          </label>
          <input
            required
            type="date"
            onChange={handleChange}
            value={formData.reservation_date}
            className="form-control"
            name="reservation_date"
          ></input>
        </div>{" "}
        <div className="mb-3">
          <label className="form-label" htmlFor="reservation_time">
            Reservation Time:
          </label>
          <input
            required
            type="time"
            onChange={handleChange}
            value={formData.reservation_time}
            className="form-control"
            name="reservation_time"
          ></input>
        </div>{" "}
        <div className="mb-3">
          <label className="form-label" htmlFor="people">
            Number of People:
          </label>
          <input
            required
            type="text"
            onChange={handleChange}
            value={formData.people}
            className="form-control"
            name="people"
          ></input>
        </div>
        <button className="btn btn-primary mx-2" type="submit">
          Submit
        </button>
        <button
          data-reservation-id-cancel={formData.reservation_id}
          type="button"
          onClick={history.goBack}
          className="btn btn-secondary"
        >
          Cancel
        </button>
      </form>
    </>
  );
}

export default EditReservationForm;
