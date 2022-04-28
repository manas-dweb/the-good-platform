import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { transactionsHistoryActions } from "../../actions";
import ConfirmationDialog from "../Shared/ConfirmationDialog";
import Loader from "../Shared/Loader";
// import employees from "./../../config/employees.json";
const actionInitialValues = {
  userId: "",
  requestType: "",
};
const ListTransactionsHistory = (props) => {
  let history = useHistory();
  const transactions = useSelector(state => state.transactionsHistory);
  // const user = useSelector((state) => state.employee.user);
  const [open, setOpen] = useState(false);
  const [actionTitle, setActionTitle] = useState("");
  const [actionContent, setActionContent] = useState("");
  const [actionType, setActionType] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(Object);
  const dispatch = useDispatch();
  useEffect(() => {
      dispatch(transactionsHistoryActions.getTransactionsHistory());
  }, []);
  const handleOpen = (action, item) => {
    setOpen(true);
    setActionType(action);
    setSelectedEmployee(item);
    setActionTitle(`${action} Confirmation`);
    setActionContent(
      `Are you sure to ${action.toLowerCase()} <strong>"${
        item.name
      }"</strong>?`
    );
  };
  const confirm = () => {
    handleClose();
    actionInitialValues.userId = selectedEmployee.id;
    actionInitialValues.requestType = actionType;
    // dispatch(employeeActions.employeeAccountRequest(actionInitialValues));
  };
  const handleClose = () => setOpen(false);
  return (
    <div>
      <div className="row mb-4">
        <div className="col-md-6">
          <h4>Transactions History</h4>
        </div>
      </div>
      {transactions.loading && <Loader />}
      <table className="table table-striped">
        <thead>
          <tr className="table-active">
            <th>Sl#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            transactions?.items?.length > 0
            ?
            transactions?.items.map((employee, index) => (
              <tr key={index + 1}>
                <td>{index + 1}</td>
                <td>{employee?.name}</td>
                <td>{employee?.email}</td>
                <td>
                  {employee?.contact_number}
                </td>
                <td className="text-center">
                  <a className="icon" href="#" data-bs-toggle="dropdown">
                    <span className="bi-three-dots"></span>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow actions">
                      {!employee?.isApprove ? (
                        <li
                          className="dropdown-header text-start"
                          onClick={() => handleOpen("Approve", employee)}
                        >
                          <span className="bi-check-circle"> Approve</span>
                        </li>
                      ) : null}
                      {employee?.isApprove || employee?.isApprove === null ? (
                        <li
                          className="dropdown-header text-start"
                          onClick={() => handleOpen("Reject", employee)}
                        >
                          <span className="bi-x-circle"> Reject</span>
                        </li>
                      ) : null}                      
                    </ul>
                </td>
              </tr>
            ))
            :
            <tr>
              <td colSpan="6" className='text-center'>No employees found</td>
            </tr>
          }
        </tbody>
      </table>
      <div className="row mb-4">
        <div className="col-md-6">
          <p>Showing 1 to 10 of 20 records</p>
        </div>
        <div className="col-md-6" style={{ textAlign: "right" }}>
          <nav aria-label="Page navigation example" className="d-inline-block">
            <ul className="pagination">
              <li className="page-item">
                <a className="page-link" href="#">
                  Previous
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  1
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  2
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  3
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  Next
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      {open && (
        <ConfirmationDialog
          open={true}
          title={actionTitle}
          content={actionContent}
          handleConfirm={() => {
            confirm();
          }}
          handleCancel={() => {
            handleClose();
          }}
        />
      )}
    </div>
  );
};
export default ListTransactionsHistory;