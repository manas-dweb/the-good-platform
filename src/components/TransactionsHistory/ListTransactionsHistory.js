import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { transactionsHistoryActions } from "../../actions";
import Loader from "../Shared/Loader";
import * as moment from "moment";
import { paymentConstants } from "../../constants";
import { history } from "./../../helpers";

const actionInitialValues = {
  userId: "",
  requestType: "",
};
let charityProgramsOption = [];
const paymentStatusOption = [
  { label: "All", value: 0 },
  { label: "Success", value: paymentConstants.PAYMENT_SUCCESS },
  { label: "Failed", value: paymentConstants.PAYMENT_FAILURE },
];
const ListTransactionsHistory = (props) => {
  // let history = useHistory();
  const [records, setRecords] = useState([]);
  const transactions = useSelector((state) => state.transactionsHistory);
  const charityPrograms = useSelector((state) => state.charityPrograms);
  const user = useSelector((state) => state.employee.user);
  const [open, setOpen] = useState(false);
  const [actionTitle, setActionTitle] = useState("");
  const [actionContent, setActionContent] = useState("");
  const [actionType, setActionType] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(Object);
  const [currentPath, setCurrentPath] = useState(history.location.pathname);
  const dispatch = useDispatch();
  const employeeId = props?.match?.params?.employeeId;
  useEffect(() => {
    dispatch(
      transactionsHistoryActions.getTransactionsHistory({
        employeeId: employeeId ? employeeId : null,
      })
    );
    charityPrograms?.items?.sponser?.forEach((e) => {
      charityProgramsOption.push({ label: e.soicalName, value: e.soicalId });
    });
    charityPrograms?.items?.other?.forEach((e) => {
      charityProgramsOption.push({ label: e.soicalName, value: e.soicalId });
    });
  }, [props]);
  useEffect(() => {
    setRecords(transactions?.items);
  }, [transactions?.items]);
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
  const filter = (type, value) => {
    if (value && value !== "0") {
      setRecords(
        transactions?.items?.filter(
          (record) => record?.paymentStatus?.toString() === value
        )
      );
    } else {
      setRecords(transactions?.items);
    }
  };
  const downlad = (transactionId) => {
    dispatch(
      transactionsHistoryActions.download80G({
        transactionId: transactionId,
      })
    );
  };
  return (
    <div className="customContainer">
      <div className="row mt-3">
        <div className="col-md-6">
          <h1 className="ant-typography customHeading">Transactions History</h1>
        </div>
        <div className="col-md-6 text-right">
          <div className="row mb-4">
            <div className="col-md-6">
              <h6 className="mt-2">Filter By</h6>
            </div>
            {/* <div className="col-md-4">
              <select className="form-select" aria-label="Select Duration">
                <option selected>Organization</option>
                {charityProgramsOption.map((duration, index) => (
                  <option value={duration.value} key={index}>
                    {duration.label}
                  </option>
                ))}
              </select>
            </div> */}
            <div className="col-md-6">
              <select
                className="form-select"
                defaultValue={""}
                onChange={(e) => filter("status", e.target.value)}
              >
                <option value={""} key={"default"} disabled>
                  Payment Status
                </option>
                {paymentStatusOption.map((status, index) => (
                  <option value={status.value} key={index}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="ant-row searchContainer mt-3 py-4 px-4 align-center">
        <div className="ant-col ant-col-24  searchContainer">
          <div className="ant-col ant-col-8">
            <div className="ant-input-affix-wrapper inputFilterInput">
              <span className="ant-input-prefix">
                <i className="bi bi-search"></i>
                <input
                  placeholder="Search by Program"
                  class="ant-input-search"
                  type="text"
                  value=""
                />
              </span>
            </div>
          </div>
        </div>
      </div>
      {transactions.loading && <Loader />}
      <div className="ant-row">
        <div className="ant-col ant-col-24 mt-2">
          <div className="ant-table-wrapper">
            <div className="ant-table">
              <table>
                <thead className="ant-table-thead">
                  <tr>
                    <th className="ant-table-cell">SR No.</th>
                    {!employeeId && <th className="ant-table-cell">Name</th>}
                    <th className="ant-table-cell">Program</th>
                    <th className="ant-table-cell">Organization</th>
                    {!employeeId && (
                      <th className="ant-table-cell">Corporate</th>
                    )}
                    <th className="ant-table-cell">Transaction ID</th>
                    <th className="ant-table-cell">Donation</th>
                    <th className="ant-table-cell">Payment Mode</th>
                    <th className="ant-table-cell">Payment Status</th>
                    <th className="ant-table-cell">Payment Date</th>
                    {employeeId && <th className="ant-table-cell">Action</th>}
                  </tr>
                </thead>
                <tbody className="ant-table-tbody">
                  {records?.length > 0 ? (
                    records?.map((transaction, index) => (
                      <tr
                        key={index + 1}
                        className="ant-table-row ant-table-row-level-0"
                      >
                        <td className="ant-table-cell">{index + 1}</td>
                        {!employeeId && (
                          <td className="ant-table-cell">
                            <span className="ant-typography font-weight-bold">{transaction?.employeeName}</span>
                          </td>
                        )}
                        <td className="ant-table-cell">
                        <span className="ant-typography font-weight-bold">{transaction?.charityName}</span>
                        </td>
                        <td className="ant-table-cell">
                        <span className="ant-typography font-weight-bold">{transaction?.socialOrg}</span>
                        </td>
                        {!employeeId && (
                          <td className="ant-table-cell">
                            {transaction?.corporateName}
                          </td>
                        )}
                        <td className="ant-table-cell">
                          {transaction?.transactionId}
                        </td>
                        <td className="ant-table-cell">
                          {transaction?.amount}
                        </td>
                        <td className="ant-table-cell">
                          {transaction?.paymentMethod &&
                            transaction?.paymentMethod.replace(/_/g, " ")}
                        </td>
                        <td className="ant-table-cell text-uppercase">
                          {transaction?.paymentStatus ===
                          paymentConstants.PAYMENT_SUCCESS ? (
                            <span className="text-success">Success</span>
                          ) : (
                            <span className="text-danger">Failed</span>
                          )}
                        </td>
                        <td className="ant-table-cell">
                          {transaction?.paymentDate &&
                            transaction?.paymentDate !== "None" &&
                            moment(transaction?.paymentDate).format(
                              "DD/MM/YY, h:mm A"
                            )}
                        </td>
                        {employeeId && (
                          <td className="ant-table-cell">
                            {transaction?.paymentStatus ===
                              paymentConstants.PAYMENT_SUCCESS && (
                              <Link
                                className="text-decoration-underline"
                                onClick={() =>
                                  downlad(transaction?.transactionId)
                                }
                              >
                                Download 80G
                              </Link>
                            )}
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center">
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="row mb-4">
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
      </div> */}
    </div>
  );
};
export default ListTransactionsHistory;
