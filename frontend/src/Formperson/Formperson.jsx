import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import "./formperson.css";

const Formperson = () => {
  const [formpersons, setFormpersons] = useState([]);
  const [newFormperson, setNewFormperson] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Phone: "",
  });
  const [selectedFormperson, setSelectedFormperson] = useState(null);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(false);
  const [addButtonClicked, setAddButtonClicked] = useState(false);

  //GET
  const fetchFormpersons = async () => {
    try {
      const response = await axios.get(config.apiUrl);
      setFormpersons(response.data);
      console.log("Fetched Formpersons:", response.data);
    } catch (error) {
      console.error("Error fetching formpersons:", error);
    }
  };

  //ADD
  const addFormperson = async () => {
    try {
      if (
        !newFormperson.FirstName ||
        !newFormperson.LastName ||
        !newFormperson.Email ||
        !newFormperson.Phone
      ) {
        setError("Please fill in all required fields.");
        setValidationError(true);
        return;
      }

      await axios.post(config.apiUrl, newFormperson, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      window.alert("Add Successfully");
      setError(null);
      fetchFormpersons();

      setNewFormperson({
        FirstName: "",
        LastName: "",
        Email: "",
        Phone: "",
      });
      setValidationError(false);
      setAddButtonClicked(false);
    } catch (error) {
      console.error("Error adding formperson:", error);
      setError("Error adding formperson. Please try again.");
    }
  };

  //UPDATE
  const updateFormperson = async () => {
    if (!selectedFormperson) return;

    // Validation check for at least one filled field
    if (
      !selectedFormperson.FirstName &&
      !selectedFormperson.LastName &&
      !selectedFormperson.Email &&
      !selectedFormperson.Phone
    ) {
      setError("Please fill in at least one field.");
      setValidationError(true);
      return;
    }

    try {
      await axios.put(config.apiUrl, selectedFormperson);
      fetchFormpersons();
      window.alert("Update Successfully");
      window.location.reload();
      setSelectedFormperson(null);
    } catch (error) {
      console.error("Error updating formperson:", error);
    }
  };

  //DELETE
  const deleteFormperson = async (formpersonId) => {
    try {
      await axios.delete(`${config.apiUrl}/${formpersonId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      window.alert("Delete Successfully");
      fetchFormpersons();
    } catch (error) {
      console.error("Error deleting formperson:", error);
    }
  };

  useEffect(() => {
    fetchFormpersons();
  }, []);

  return (
    <div>
      <button
        type="button"
        className="btn btn-primary m-2 float-end"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        onClick={() =>
          setNewFormperson({
            FirstName: "",
            LastName: "",
            Email: "",
            Phone: "",
            Profilepic: "",
          })
        }
      >
        Add
      </button>

      <table className="table table-striped">
        <thead>
          <tr class="pure-table-odd">
            <th style={{ borderBottom: "1px solid #000" }}>First Name</th>
            <th style={{ borderBottom: "1px solid #000" }}>Last Name</th>
            <th style={{ borderBottom: "1px solid #000" }}>Email</th>
            <th style={{ borderBottom: "1px solid #000" }}>Phone</th>
            <th style={{ borderBottom: "1px solid #000" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {formpersons.map((formperson) => (
            <tr key={formperson.formpersonId}>
              <td style={{ borderBottom: "1px solid #000" }}>
                {formperson.firstName}
              </td>
              <td
                style={{
                  borderBottom: "1px solid #000",
                  borderTop: "1px solid #000",
                }}
              >
                {formperson.lastName}
              </td>
              <td
                style={{
                  borderBottom: "1px solid #000",
                  borderTop: "1px solid #000",
                }}
              >
                {formperson.email}
              </td>
              <td
                style={{
                  borderBottom: "1px solid #000",
                  borderTop: "1px solid #000",
                }}
              >
                {formperson.phone}
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-light mr-1"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  onClick={() => setSelectedFormperson(formperson)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteFormperson(formperson.formpersonId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              {error && (
                <div className="alert alert-danger mt-3" role="alert">
                  {error}
                </div>
              )}
              <h5 className="modal-title">
                {selectedFormperson ? "Edit Details" : "Add Person"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  setSelectedFormperson(null);
                  window.location.reload();
                }}
              ></button>
            </div>

            <div className="modal-body">
              <div className="mb-3 row">
                <div className="col-md-8 mx-auto">
                  <input
                    type="text"
                    placeholder={`First Name${
                      validationError && !newFormperson.FirstName
                        ? " is required!"
                        : ""
                    }`}
                    className={`form-control ${
                      validationError && !newFormperson.FirstName
                        ? "is-invalid"
                        : ""
                    }`}
                    id="firstName"
                    value={
                      selectedFormperson
                        ? selectedFormperson.FirstName
                        : newFormperson.FirstName
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      if (selectedFormperson) {
                        setSelectedFormperson((prev) => ({
                          ...prev,
                          FirstName: value,
                        }));
                      } else {
                        setNewFormperson((prev) => ({
                          ...prev,
                          FirstName: value,
                        }));
                      }
                    }}
                  />
                </div>
              </div>

              <div className="mb-3 row">
                <div className="col-md-8 mx-auto">
                  <input
                    type="text"
                    className={`form-control ${
                      validationError && !newFormperson.LastName
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder={`Last Name${
                      validationError && !newFormperson.LastName
                        ? " is required!"
                        : ""
                    }`}
                    id="lastName"
                    value={
                      selectedFormperson
                        ? selectedFormperson.LastName
                        : newFormperson.LastName
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      if (selectedFormperson) {
                        setSelectedFormperson((prev) => ({
                          ...prev,
                          LastName: value,
                        }));
                      } else {
                        setNewFormperson((prev) => ({
                          ...prev,
                          LastName: value,
                        }));
                      }
                    }}
                  />
                </div>
              </div>

              <div className="mb-3 row">
                <div className="col-md-8 mx-auto">
                  <input
                    type="email"
                    className={`form-control ${
                      validationError && !newFormperson.Email
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder={`Email${
                      validationError && !newFormperson.Email
                        ? " is required!"
                        : ""
                    }`}
                    id="email"
                    value={
                      selectedFormperson
                        ? selectedFormperson.Email
                        : newFormperson.Email
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      if (selectedFormperson) {
                        setSelectedFormperson((prev) => ({
                          ...prev,
                          Email: value,
                        }));
                      } else {
                        setNewFormperson((prev) => ({ ...prev, Email: value }));
                      }
                    }}
                  />
                </div>
              </div>

              <div className="mb-3 row">
                <div className="col-md-8 mx-auto">
                  <input
                    type="tel"
                    className={`form-control ${
                      validationError && !newFormperson.Phone
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder={`Phone${
                      validationError && !newFormperson.Phone
                        ? " is required!"
                        : ""
                    }`}
                    id="phone"
                    value={
                      selectedFormperson
                        ? selectedFormperson.Phone
                        : newFormperson.Phone
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      if (selectedFormperson) {
                        setSelectedFormperson((prev) => ({
                          ...prev,
                          Phone: value,
                        }));
                      } else {
                        setNewFormperson((prev) => ({ ...prev, Phone: value }));
                      }
                    }}
                  />
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => {
                  setError(null);
                  selectedFormperson ? updateFormperson() : addFormperson();
                }}
              >
                {selectedFormperson ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Formperson;