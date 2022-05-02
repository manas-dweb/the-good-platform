import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { transactionsHistoryActions } from "../../actions";
import Loader from "../Shared/Loader";
import transactions from "./../../config/transactions.json";
import * as moment from "moment";

const actionInitialValues = {
  userId: "",
  requestType: "",
};
const ListTransactionsHistory = (props) => {
  let history = useHistory();
  // const transactions = useSelector(state => state.transactionsHistory);
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
      `Are you sure to ${action.toLowerCase()} <strong>"${item.name}"</strong>?`
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
            <th>Employee Name</th>
            <th>Employee Email</th>
            <th>Transaction ID</th>
            <th>Order Amount</th>
            <th>Payment Status</th>
            <th>Payment Time</th>
          </tr>
        </thead>
        <tbody>
          {transactions?.length > 0 ? (
            transactions?.map((transaction, index) => (
              <tr key={index + 1}>
                <td>{index + 1}</td>
                <td>{transaction?.data?.customer_details?.customer_id}</td>
                <td>{transaction?.data?.customer_details?.customer_name}</td>
                <td>{transaction?.data?.order?.order_id}</td>
                <td>{transaction?.data?.order?.order_amount}</td>
                <td>{transaction?.data?.payment?.payment_status}</td>
                <td>
                  {moment(transaction?.data?.payment?.payment_time).format(
                    "DD/MM/YY, h:mm A"
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No transactions found
              </td>
            </tr>
          )}
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
    </div>
  );
};
export default ListTransactionsHistory;
