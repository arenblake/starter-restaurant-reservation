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
    if (target.name === "mobile_number") addDashes(target);
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

    if (!event.target.checkValidity())
      event.target.classList.add("was-validated");

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

    if (formData.people < 1) {
      errors.push({
        message: `Bookings must include at least 1 guest`,
      });
    }

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

  function addDashes(f) {
    f.value = f.value.split("-").join("");
    f.value = f.value.replace(/[^0-9-]/g, "");
    f.value = f.value.replace(
      /(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)/,
      "$1$2$3-$4$5$6-$7$8$9$10"
    );
  }

  return (
    <>
      {formErrors.length ? displayErrors : null}
      <form noValidate={true} onSubmit={handleSubmit}>
        <div className="input-group">
          <div className="mb-3">
            <input
              required
              type="text"
              onChange={handleChange}
              value={formData.first_name}
              placeholder="First Name"
              className="form-control shadow-sm"
              name="first_name"
            ></input>
            <label className="form-label" htmlFor="first_name">
              First Name
            </label>
          </div>
          <div className="mb-3">
            <input
              required
              type="text"
              onChange={handleChange}
              value={formData.last_name}
              className="form-control shadow-sm"
              name="last_name"
            ></input>
            <label className="form-label" htmlFor="last_name">
              Last Name:
            </label>
          </div>
        </div>
        <div className="mb-3 form-floating">
          <input
            required
            type="tel"
            onChange={handleChange}
            value={formData.mobile_number}
            maxLength="12"
            className="form-control shadow-sm"
            name="mobile_number"
          ></input>
          <label className="form-label" htmlFor="mobile_number">
            Mobile Number:
          </label>
        </div>
        <div className="mb-3 form-floating">
          <input
            required
            type="date"
            onChange={handleChange}
            value={formData.reservation_date}
            placeholder="Reservation Date"
            className="form-control shadow-sm"
            name="reservation_date"
          ></input>
          <label className="form-label" htmlFor="reservation_date">
            Reservation Date:
          </label>
        </div>{" "}
        <div className="mb-3 form-floating">
          <input
            required
            type="time"
            onChange={handleChange}
            value={formData.reservation_time}
            placeholder="Reservation Time"
            className="form-control shadow-sm"
            name="reservation_time"
          ></input>
          <label className="form-label" htmlFor="reservation_time">
            Reservation Time:
          </label>
        </div>{" "}
        <div className="mb-3 form-floating">
          <input
            required
            type="number"
            min="1"
            onChange={handleChange}
            value={formData.people}
            className="form-control shadow-sm"
            name="people"
          ></input>
          <label className="form-label" htmlFor="people">
            Number of People:
          </label>
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
