import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { transactionsHistoryActions } from "../../actions";
import Loader from "../Shared/Loader";
import { Mail80GSchema } from "./../Validations";
import * as moment from "moment";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import ReactHtmlParser from "react-html-parser";
import { ProcessHelper } from "./../../helpers";
import { Accordion } from "react-bootstrap";
import ConfirmationDialog from "../Shared/ConfirmationDialog";
import { payrollSettingActions } from "../../actions/payrollSetting.actions";
import {
  paymentConstants,
  paginationConstants,
  viewPortalConstants,
  payrollConstants,
  donationPreferenceConstants,
  userConstants
} from "../../constants";
import Pagination from "./../Shared/Pagination";
import { Tooltip } from "antd";
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";

let charityProgramsOption = [];
let accordionData;
const paymentStatusOption = [
  { label: "All", value: "All" },
  { label: "Processed", value: "True" },
  { label: "Not Processed", value: "False" }
  // { label: "Failed", value: paymentConstants.PAYMENT_FAILURE }
];
let pageSize = paginationConstants?.PAGE_SIZE;
const initialValues = {
  email: "",
  transactionId: ""
};
const { afterToday } = DateRangePicker;
// const date = new Date();
const DirectPayment = (props) => {
  const [selected, setSelected] = useState();
  // const [searchValue, setSearchValue] = useState("");
  const [records, setRecords] = useState([]);
  const [allRecords, setAllRecords] = useState(records);

  const transactions = useSelector((state) => state.transactionsHistory);
  const charityPrograms = useSelector((state) => state.charityPrograms);
  const currentPortal = useSelector((state) => state.currentView);
  const selectedCorporate = useSelector((state) => state.selectedCorporate);
  const user = useSelector((state) => state?.employee?.user);
  // const selectedOrganization = useSelector(
  //   (state) => state?.selectedOrganization?.organization
  // );
  const employee = useSelector((state) => state.employee);
  const dispatch = useDispatch();
  const employeeId = props?.match?.params?.employeeId;
  // const loggedInUserType = useSelector(
  //   (state) => state?.user?.loggedinUserType
  // );
  const [currentView, setCurrentView] = useState(payrollConstants?.LIST_VIEW);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isFilter, setIsFilter] = useState(false);
  const [searchByEmployeeName, setSearchByEmployeeName] = useState("");
  const [searchByCorporateName, setSearchByCorporateName] = useState("");
  const [searchByProgramName, setSearchByProgramName] = useState("");
  const [searchByAmount, setSearchByAmount] = useState("");
  // const [val, setVal] = useState(0);
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  // const [isDateRangeFilter, setIsDateRangeFilter] = useState(false);
  const [openAccountDetail, setOpenAccountDetail] = useState(false);
  const [selectedPreference, setSelectedPreference] = useState();
  const [selectedAccount, setSelectedAccount] = useState();
  const [selectedRange, setSelectedRange] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("False");
  const [actionType, setActionType] = useState("");
  const [actionTitle, setActionTitle] = useState("");
  const [actionContent, setActionContent] = useState("");
  const [batchType, setBatchType] = useState("");
  const [generateMonthYear, setGenerateMonthYear] = useState(new Date());
  // const [totalEmployeeInBatch, setTotalEmployeeInBatch] = useState([]);
  // const [totalProgramInBatch, setTotalProgramInBatch] = useState([]);
  const [checkedPreference, setCheckedPreference] = useState({
    preferenceId: []
  });
  // const [allItems, setAllItems] = useState();
  const [checked, setChecked] = useState(false);
  const [value, setValue] = useState([
    new Date(moment().add(-30, "days").format("YYYY-MM-DD")),
    new Date(moment().format("YYYY-MM-DD"))
  ]);
  const isOrganizationView =
    currentPortal?.currentView ===
    viewPortalConstants.SOCIAL_ORGANIZATION_PORTAL;
  const isCorporatePortal = user?.user_type === userConstants.CORPORATE;
  const isEmployeePortal = user?.user_type === userConstants.EMPLOYEE;
  const isBluePencilPortal =
    currentPortal?.currentView ===
    viewPortalConstants.BLUE_PENCEIL_ADMIN_PORTAL;

  useEffect(() => {
    setCurrentPage(1);
    charityPrograms?.items?.sponsored?.forEach((e) => {
      charityProgramsOption.push({ label: e.soicalName, value: e.soicalId });
    });
    charityPrograms?.items?.other?.forEach((e) => {
      charityProgramsOption.push({ label: e.soicalName, value: e.soicalId });
    });
  }, [props, charityPrograms?.items?.sponsored, charityPrograms?.items?.other]);

  useEffect(() => {
    setRecords(transactions?.directPayments);
    // filter("status", "False");
  }, [transactions?.directPayments]);
  useEffect(() => {
    setTotalCount(transactions?.totalCount);
  }, [transactions?.totalCount]);

  useEffect(() => {
    setAllRecords(records);
  }, [records]);

  const filter = (type, value) => {
    // setAllRecords();
    setSelectedStatus(value);
    setIsFilter(true);
    // fetchResults("");
    // if (value && value !== "all") {
    //   setRecords(
    //     transactions?.directPayments?.filter(
    //       (record) => record?.directBatchPaymentStatus?.toString() === value
    //     )
    //   );
    // } else {
    //   setRecords(transactions?.directPayments);
    // }
  };

  const resultAccordionData = (key) => {
    return Object.values(
      key.reduce(
        (
          c,
          {
            batchId,
            employeeName,
            amount,
            batchDate,
            charityName,
            corporateName,
            socialOrg
          }
        ) => {
          const temp = {
            batchId,
            employeeName: "",
            amount: 0,
            batchDate: "",
            charityName: "",
            corporateName: "",
            socialOrg: ""
          };
          c[batchId] = c[batchId] || temp;
          c[batchId].employeeName += employeeName;
          c[batchId].amount += amount;
          c[batchId].batchDate = batchDate;
          c[batchId].corporateName = corporateName;
          c[batchId].charityName = charityName;
          c[batchId].socialOrg = socialOrg;
          return c;
        },
        {}
      )
    );
  };
  const onSearchChange = (value, selected) => {
    if (selected === "programName") {
      setSearchByProgramName(value);
    } else if (selected === "employeeName") {
      setSearchByEmployeeName(value);
    } else if (selected === "corporateName") {
      setSearchByCorporateName(value);
    } else if (selected === "amount") {
      setSearchByAmount(value);
    } else {
      return null;
    }
  };
  const onHandleChange = (e) => {
    setSearchByProgramName("");
    setSearchByEmployeeName("");
    setSearchByCorporateName("");
    setSearchByAmount("");
    setSelected(e.target.value);
  };

  const downlad = (transactionId) => {
    dispatch(
      transactionsHistoryActions.download80G({
        transactionId: transactionId
      })
    );
  };
  const setPage = (page) => {
    setCurrentPage(page);
  };
  const confirm = (values) => {
    handleClose();

    dispatch(transactionsHistoryActions.send80GEmail(values));
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseDetail = () => {
    setOpenAccountDetail(false);
  };
  const setEmailSend = (transactionId) => {
    setOpen(true);
    initialValues.email = isCorporatePortal
      ? selectedCorporate?.corporate?.email
      : employee?.user?.email;
    initialValues.transactionId = transactionId;
  };

  const fetchResults = (dateRange) => {
    dispatch(
      transactionsHistoryActions.getDirectPayment({
        pageSize: pageSize,
        offset: currentPage >= 2 ? currentPage * pageSize - pageSize : 0,
        searchByEmployeeName: searchByEmployeeName,
        searchByProgramName: searchByProgramName,
        searchByCorporateName: searchByCorporateName,
        searchByAmount: searchByAmount,
        selectedStatus: selectedStatus,
        startDate: dateRange
          ? moment(dateRange[0]).format("YYYY-MM-DD")
          : moment().add(-30, "days").format("YYYY-MM-DD"),
        endDate: dateRange
          ? moment(dateRange[1]).add(1, "days").format("YYYY-MM-DD")
          : moment().add(1, "days").format("YYYY-MM-DD")
      })
    );
  };
  useEffect(() => {
    fetchResults(null);
  }, [
    searchByProgramName,
    searchByEmployeeName,
    searchByCorporateName,
    searchByAmount,
    selectedStatus,
    currentPage
  ]);

  // const selectionRange = {
  //   startDate: new Date(),
  //   endDate: new Date(),
  //   key: "selection"
  // };
  const fetchData = (ranges) => {
    setSelectedRange(ranges);
    fetchResults(ranges);
  };
  const showAccountDetail = (item) => {
    setOpenAccountDetail(true);
    setSelectedAccount(item);
  };
  const groupBy = (key) => {
    return allRecords?.reduce(function (acc, item) {
      (acc[item[key]] = acc[item[key]] || []).push(item);
      return acc;
    }, {});
  };
  const handleCheck = (e, items) => {
    const { name, checked } = e.target;
    const { preferenceId } = checkedPreference;
    setChecked(checked);
    if (name === "allSelect" && checked) {
      let prefenreceID = allRecords?.map((val) => val?.Id);
      const singleSocialPreferenceId = new Set(prefenreceID);
      prefenreceID = [...singleSocialPreferenceId];
      setCheckedPreference({
        preferenceId: allRecords?.map((val) => val.Id)
      });
    } else if (name === "allSelect" && !checked) {
      setCheckedPreference({
        preferenceId: []
      });
    } else if (checked) {
      setCheckedPreference({
        preferenceId: [...preferenceId, items?.Id]
      });
    } else {
      setCheckedPreference({
        preferenceId: preferenceId?.filter((val) => val !== items?.Id)
      });
    }
    // For all Check & Uncheck
    if (name === "allSelect") {
      let tempreference = allRecords?.map((item) => {
        return { ...item, isChecked: checked };
      });
      setAllRecords(tempreference);
    } else {
      let tempreference = allRecords?.map((item) =>
        item.Id.toString() === name ? { ...item, isChecked: checked } : item
      );
      setAllRecords(tempreference);
    }
  };
  if (isBluePencilPortal) {
    if (currentView === payrollConstants.ORGANIZATION_VIEW) {
      accordionData = groupBy("socialOrg");
    } else {
      accordionData = groupBy("charityName");
    }
  }
  const handleOpenDialog = (action, item, type) => {
    setOpenDialog(true);
    setActionType(action);
    setBatchType(type);
    setActionTitle(`${action} Confirmation`);
    setSelectedPreference(item);
    setActionContent(`Are you sure to crate this process batch?`);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPreference(null);
  };

  const createBatch = () => {
    if (isBluePencilPortal) {
      dispatch(
        payrollSettingActions.processBatch({
          batchType: batchType,
          batchProcessType: "directPaymentBatch",
          ids: checkedPreference?.preferenceId,
          corporateId: "",
          totalAmount: allRecords
            ?.filter((item) =>
              checkedPreference?.preferenceId?.includes(item?.Id) ? item : null
            )
            .reduce(
              (total, currentValue) => (total = total + currentValue?.amount),
              0
            )
        })
      );
      const data = allRecords?.filter(
        (item) => !checkedPreference?.preferenceId?.includes(item?.Id)
      );
      setRecords(data);
      setCheckedPreference({ preferenceId: [] });
    }

    handleCloseDialog();
    // getData();
  };

  return (
    <div className="customContainer">
      <div className="row mt-3">
        <div className="col-md-4">
          <h1 className="ant-typography customHeading">Direct Payment</h1>
        </div>
        <div className="col-md-4 text-center">
          <DateRangePicker
            appearance="default"
            value={value}
            onChange={setValue}
            onOk={(value) => fetchData(value)}
            placeholder={`${moment()
              .add(-30, "days")
              .format("DD/MM/YYYY")} - ${moment().format("DD/MM/YYYY")}`}
            format={"dd/MM/yyyy"}
            cleanable={true}
            disabledDate={afterToday()}
          />
        </div>
        <div className="col-md-4 text-right">
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
                defaultValue={"False"}
                onChange={(e) => filter("status", e.target.value)}
              >
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
      <div className="row mt-3">
        <div className="col-md-12 text-right">
          {isBluePencilPortal && (
            <Link
              to="/direct-payment"
              className="fs-6 text-decoration-underline mr-3"
              onClick={() => setCurrentView(payrollConstants.LIST_VIEW)}
            >
              <button
                type="button"
                className={`${
                  currentView === payrollConstants.LIST_VIEW ? "active" : ""
                } btn btn-sm btn-outline-primary btn-outline-custom`}
              >
                List View
              </button>
            </Link>
          )}
          {isBluePencilPortal && (
            <Link
              to="/direct-payment"
              className="fs-6 text-decoration-underline mr-3"
              onClick={() => setCurrentView(payrollConstants.ORGANIZATION_VIEW)}
            >
              <button
                type="button"
                className={`${
                  currentView === payrollConstants.ORGANIZATION_VIEW
                    ? "active"
                    : ""
                } btn btn-sm btn-outline-primary btn-outline-custom`}
              >
                Organization View
              </button>
            </Link>
          )}
          {isBluePencilPortal && (
            <Link
              to="/direct-payment"
              className="fs-6 text-decoration-underline mr-3"
              onClick={() => setCurrentView(payrollConstants.PROGRAM_VIEW)}
            >
              <button
                type="button"
                className={`${
                  currentView === payrollConstants.PROGRAM_VIEW ? "active" : ""
                } btn btn-sm btn-outline-primary btn-outline-custom`}
              >
                Program View
              </button>
            </Link>
          )}
        </div>
      </div>
      <div className="ant-row searchContainer mt-3 py-4 align-center">
        <div className="col-md d-flex pl-0">
          <div className="col-md-8 d-flex ">
            <div className="col-md-6 pl-0">
              <div>
                <select
                  className="form-select"
                  value={selected}
                  defaultValue={""}
                  onChange={(e) => onHandleChange(e)}
                >
                  <option value={""} key={"default"} disabled>
                    Search by
                  </option>
                  <option value="programName">Program Name</option>
                  {!isEmployeePortal && !isCorporatePortal && (
                    <option value="corporateName">Corporate</option>
                  )}

                  {!isEmployeePortal && (
                    <option value="employeeName">Donor</option>
                  )}
                  <option value="amount">Amount</option>
                </select>
              </div>
            </div>
            {selected === "programName" && (
              <div className="col-md-6">
                <div>
                  <div className="ant-input-affix-wrapper inputFilterInput">
                    <span className="ant-input-prefix">
                      <i className="bi bi-search"></i>
                      <input
                        type="text"
                        className="ant-input-search"
                        placeholder="Search by Program Name"
                        onChange={(e) =>
                          onSearchChange(e.target.value, "programName")
                        }
                      />
                    </span>
                  </div>
                </div>
              </div>
            )}
            {selected === "corporateName" && (
              <div className="col-md-6">
                <div>
                  <div className="ant-input-affix-wrapper inputFilterInput">
                    <span className="ant-input-prefix">
                      <i className="bi bi-search"></i>
                      <input
                        type="text"
                        // className="form-control"
                        className="ant-input-search"
                        placeholder="Search by Corporate Name"
                        onChange={(e) =>
                          onSearchChange(e.target.value, "corporateName")
                        }
                      />
                    </span>
                  </div>
                </div>
              </div>
            )}
            {selected === "employeeName" && (
              <div className="col-md-6">
                <div>
                  <div className="ant-input-affix-wrapper inputFilterInput">
                    <span className="ant-input-prefix">
                      <i className="bi bi-search"></i>
                      <input
                        type="text"
                        // className="form-control"
                        className="ant-input-search"
                        placeholder="Search by donor name or email"
                        onChange={(e) =>
                          onSearchChange(e.target.value, "employeeName")
                        }
                      />
                    </span>
                  </div>
                </div>
              </div>
            )}
            {selected === "amount" && (
              <div className="col-md-6">
                <div>
                  <div className="ant-input-affix-wrapper inputFilterInput">
                    <span className="ant-input-prefix">
                      <i className="bi bi-search"></i>
                      <input
                        type="text"
                        className="ant-input-search"
                        placeholder="Search by Amount"
                        onChange={(e) =>
                          onSearchChange(e.target.value, "amount")
                        }
                      />
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="col-md-4 text-right">
            {selectedStatus !== "True" &&
              currentView === payrollConstants.LIST_VIEW &&
              allRecords?.length > 0 && (
                <button
                  className="btn btn-custom"
                  onClick={() =>
                    handleOpenDialog("Process batch", "", "Direct")
                  }
                  disabled={
                    checkedPreference?.preferenceId?.length === 0 ||
                    moment(generateMonthYear).isAfter(moment())
                  }
                >
                  Process Batch
                </button>
              )}
          </div>
        </div>
      </div>
      {transactions.loading && <Loader />}
      {currentView === payrollConstants.LIST_VIEW ? (
        <div className="ant-row">
          <div className="ant-col ant-col-24 mt-2">
            <div className="ant-table-wrapper">
              <div className="ant-table">
                <table>
                  <thead className="ant-table-thead">
                    <tr>
                      <th>
                        <div className="form-check me-2">
                          {selectedStatus !== "True" &&
                            allRecords?.length > 0 && (
                              <input
                                type="checkbox"
                                name="allSelect"
                                checked={
                                  allRecords?.length > 0 &&
                                  allRecords?.filter(
                                    (item) => item?.isChecked !== true
                                  ).length < 1
                                }
                                className="form-check-input"
                                onChange={(e) => handleCheck(e, allRecords)}
                              />
                            )}
                        </div>
                      </th>
                      {/* <th>Batch ID</th> */}
                      {!isEmployeePortal && (
                        <th className="ant-table-cell">Donor</th>
                      )}
                      <th className="ant-table-cell">Program</th>
                      {!isOrganizationView && (
                        <th className="ant-table-cell">Organization</th>
                      )}
                      {/* {!employeeId && !isCorporatePortal && (
                        <th className="ant-table-cell">Corporate</th>
                      )} */}
                      <th className="ant-table-cell">Transaction ID</th>
                      <th className="ant-table-cell">Donation</th>
                      <th className="ant-table-cell">Payment Date</th>
                      {(employeeId || isCorporatePortal) && (
                        <th className="ant-table-cell">80G</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="ant-table-tbody">
                    {allRecords?.length > 0 ? (
                      allRecords?.map((transaction, index) => (
                        <tr
                          key={index + 1}
                          className="ant-table-row ant-table-row-level-0"
                        >
                          {/* <td className="ant-table-cell">
                          {currentPage >= 2
                            ? currentPage * pageSize - pageSize + index + 1
                            : index + 1}
                        </td> */}
                          <td>
                            {!transaction?.directBatchPaymentId && (
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  name={transaction?.Id}
                                  checked={transaction?.isChecked || false}
                                  onChange={(e) => handleCheck(e, transaction)}
                                />
                              </div>
                            )}
                          </td>
                          {/* <td>{transaction?.directBatchPaymentId}</td> */}
                          {!isEmployeePortal && (
                            <td className="ant-table-cell">
                              <span className="ant-typography font-weight-bold">
                                <Tooltip title="Show detail">
                                  <Link
                                    to="/direct-payment"
                                    onClick={() =>
                                      showAccountDetail(transaction)
                                    }
                                  >
                                    <span className="custom-color">
                                      {transaction?.employeeName
                                        ? transaction?.employeeName
                                        : transaction?.corporateName}
                                    </span>
                                  </Link>
                                </Tooltip>
                              </span>
                            </td>
                          )}
                          <td className="ant-table-cell">
                            <span className="ant-typography font-weight-bold">
                              <Tooltip title={transaction?.charityName}>
                                <Link
                                  to="/direct-payment"
                                  onClick={() => showAccountDetail(transaction)}
                                >
                                  <span className="custom-color">
                                    {transaction?.charityName?.length > 30
                                      ? transaction?.charityName?.substring(
                                          0,
                                          27
                                        ) + "..."
                                      : transaction?.charityName}
                                  </span>
                                </Link>
                              </Tooltip>
                            </span>
                          </td>
                          {!isOrganizationView && (
                            <td className="ant-table-cell">
                              <span className="ant-typography font-weight-bold">
                                <Tooltip title="Show detail">
                                  <Link
                                    to="/direct-payment"
                                    onClick={() =>
                                      showAccountDetail(transaction)
                                    }
                                  >
                                    <span className="custom-color">
                                      {transaction?.socialOrg}
                                    </span>
                                  </Link>
                                </Tooltip>
                              </span>
                            </td>
                          )}
                          {/* {!employeeId && !isCorporatePortal && (
                            <td className="ant-table-cell">
                              <Tooltip title="Show detail">
                                <Link
                                  onClick={() => showAccountDetail(transaction)}
                                >
                                  <span className="custom-color">
                                    {transaction?.corporateName}
                                  </span>
                                </Link>
                              </Tooltip>
                            </td>
                          )} */}
                          <td className="ant-table-cell">
                            {transaction?.transactionId}
                          </td>
                          <td className="ant-table-cell">
                            {transaction?.amount?.toLocaleString()}
                          </td>
                          {/* <td className="ant-table-cell">
                          {transaction?.donationType}
                        </td> */}
                          {/* <td className="ant-table-cell">
                          {transaction?.paymentMethod &&
                            transaction?.paymentMethod.replace(/_/g, " ")}
                        </td> */}
                          {/* <td className="ant-table-cell text-uppercase">
                          {transaction?.paymentStatus ===
                            paymentConstants.PAYMENT_SUCCESS && (
                            <span className="text-success">Success</span>
                          )}
                          {transaction?.paymentStatus ===
                            paymentConstants.PAYMENT_FAILURE && (
                            <span className="text-danger">Failed</span>
                          )}
                          {transaction?.paymentStatus ===
                            paymentConstants.PAYMENT_PENDING && (
                            <span className="text-warning">Pending</span>
                          )}
                        </td> */}
                          <td className="ant-table-cell">
                            {transaction?.paymentDate &&
                              transaction?.paymentDate !== "None" &&
                              moment(transaction?.paymentDate).format(
                                "DD/MM/YY, h:mm A"
                              )}
                          </td>
                          {(employeeId || isCorporatePortal) && (
                            <td className="ant-table-cell">
                              {transaction?.paymentStatus ===
                                paymentConstants.PAYMENT_SUCCESS && (
                                <div className="d-flex">
                                  <Tooltip title="Download">
                                    <Link
                                      className="text-decoration-underline"
                                      onClick={() =>
                                        downlad(transaction?.transactionId)
                                      }
                                    >
                                      <i className="bi bi-download fs-5 mr-3"></i>
                                    </Link>
                                  </Tooltip>
                                  <Tooltip title="Email">
                                    <Link
                                      className="text-decoration-underline"
                                      onClick={() =>
                                        setEmailSend(transaction?.transactionId)
                                      }
                                    >
                                      <i className="bi bi-envelope fs-5"></i>
                                    </Link>
                                  </Tooltip>
                                </div>
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
      ) : (
        accordionData &&
        Object.keys(accordionData).map((type, index) => (
          <div className="row mt-4" key={index}>
            {ProcessHelper(accordionData[type], " ")?.length > 0 ? (
              <Accordion defaultActiveKey={index} className="Payroll">
                <Accordion.Item eventKey={0}>
                  <Accordion.Header>
                    {type} &nbsp;&#45;&nbsp;
                    {ReactHtmlParser(donationPreferenceConstants?.CURRENCY)}
                    {accordionData[type]
                      ? ProcessHelper(accordionData[type], " ")
                          ?.reduce(
                            (total, currentValue) =>
                              (total = total + currentValue.amount),
                            0
                          )
                          .toLocaleString()
                      : 0}
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="ant-row">
                      <div className="ant-col ant-col-24 mt-2">
                        <div className="ant-table-wrapper">
                          <div className="ant-table">
                            <table>
                              <thead className="ant-table-thead">
                                <tr>
                                  {/* <th className="ant-table-cell">Sr No.</th> */}
                                  {/* <th className="ant-table-cell">Batch id</th> */}
                                  {/* <th className="ant-table-cell">Donor</th> */}
                                  {/* <th className="ant-table-cell">Batch ID</th> */}
                                  {currentView !==
                                    payrollConstants.ORGANIZATION_VIEW && (
                                    <th className="ant-table-cell">
                                      Organization
                                    </th>
                                  )}
                                  <th className="ant-table-cell">Program</th>
                                  {/* <th className="ant-table-cell">Corporate</th> */}
                                  <th className="ant-table-cell">Month</th>
                                  <th className="ant-table-cell">
                                    Amount (
                                    {ReactHtmlParser(
                                      donationPreferenceConstants?.CURRENCY
                                    )}
                                    )
                                  </th>
                                  {/* <th className="ant-table-cell">TransactionId ID</th> */}
                                  {/* <th className="ant-table-cell text-center">
                                      Actions
                                    </th> */}
                                </tr>
                              </thead>
                              <tbody className="ant-table-tbody">
                                {resultAccordionData(accordionData[type])?.map(
                                  (item, index) => (
                                    <tr
                                      key={index + 1}
                                      className="ant-table-row ant-table-row-level-0"
                                    >
                                      {/* <td className="ant-table-cell">
                                        <Link 
                                          onClick={() =>
                                            props?.showBatchDetail(
                                              batch?.batchId
                                            )
                                          }
                                        >
                                          {batch?.batchId}
                                        </Link>
                                      </td> */}
                                      {/* <td className="ant-table-cell">
                                        {item?.employeeName}
                                      </td> */}
                                      {/* <td className="ant-table-cell">
                                          {item?.directBatchPaymentId}
                                        </td> */}
                                      {currentView !==
                                        payrollConstants.ORGANIZATION_VIEW && (
                                        <td className="ant-table-cell">
                                          {item?.socialOrg}
                                        </td>
                                      )}
                                      <td className="ant-table-cell">
                                        {item?.charityName}
                                      </td>
                                      {/* <td className="ant-table-cell">
                                        {item?.corporateName}
                                      </td> */}
                                      <td className="ant-table-cell">
                                        {moment(item?.createdDate).format(
                                          "MMM, YYYY"
                                        )}
                                      </td>
                                      <td className="ant-table-cell">
                                        {item?.amount?.toLocaleString()}
                                      </td>
                                      {/* <td className="ant-table-cell">
                                        
                                          {batch?.referenceId}
                                      </td> */}
                                      {/* <td className="ant-table-cell text-center">
                                      </td> */}
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            ) : null}
          </div>
        ))
      )}
      {allRecords?.length > 0 && (
        <div className="row mt-4">
          <div className="col-md-12 text-right">
            <h5>
              Total : &nbsp;
              <span className="fs-5">
                {ReactHtmlParser(donationPreferenceConstants?.CURRENCY)}
                {allRecords
                  ?.reduce(
                    (total, currentValue) =>
                      (total = total + currentValue.amount),
                    0
                  )
                  .toLocaleString()}
              </span>
            </h5>
          </div>
        </div>
      )}
      <Pagination
        className="pagination-bar mt-4"
        currentPage={currentPage}
        totalCount={totalCount ? totalCount : 0}
        pageSize={pageSize}
        onPageChange={(page) => setPage(page)}
      />
      {open && (
        <Modal show={open} onHide={handleClose} backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>Send Mail</Modal.Title>
          </Modal.Header>
          <Formik
            initialValues={initialValues}
            validationSchema={Mail80GSchema}
            onSubmit={(values) => {
              confirm(values);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting
            }) => (
              <Form>
                <Modal.Body style={{ fontSize: "18" }}>
                  <div className="row">
                    <div className="col-md-12">
                      <label className="mt-1">
                        Email<span className="text-danger">*</span>
                      </label>
                      <Field
                        name="email"
                        type="text"
                        className={
                          "form-control" +
                          (errors.email && touched.email ? " is-invalid" : "")
                        }
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <button
                    className="btn btn-custom"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Submit
                  </button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal>
      )}
      {openAccountDetail && (
        <Modal
          show={openAccountDetail}
          onHide={handleCloseDetail}
          backdrop="static"
        >
          <Modal.Header closeButton className="fs-5">
            <Modal.Title>Account Detail</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ fontSize: "18" }}>
            {selectedAccount?.batchId && (
              <div className="row mb-2">
                <div className="col-md-4">
                  <strong>Batch ID:</strong>
                </div>
                <div className="col-md-8">{selectedAccount?.batchId}</div>
              </div>
            )}
            {!isEmployeePortal && selectedAccount?.employeeName && (
              <div className="row mb-2">
                <div className="col-md-4">
                  <strong>Donor:</strong>
                </div>
                <div className="col-md-8">{selectedAccount?.employeeName}</div>
              </div>
            )}
            <div className="row mb-2">
              <div className="col-md-4">
                <strong>Corporate:</strong>
              </div>
              <div className="col-md-8">{selectedAccount?.corporateName}</div>
            </div>
            <div className="row mb-2">
              <div className="col-md-4">
                <strong>Organization:</strong>
              </div>
              <div className="col-md-8">{selectedAccount?.socialOrg}</div>
            </div>
            <div className="row mb-2">
              <div className="col-md-4">
                <strong>Program:</strong>
              </div>
              <div className="col-md-8">{selectedAccount?.charityName}</div>
            </div>
            <div className="row mb-2">
              <div className="col-md-4">
                <strong>Donation Type:</strong>
              </div>
              <div className="col-md-8">{selectedAccount?.donationType}</div>
            </div>
            <div className="row mb-2">
              <div className="col-md-4">
                <strong>Payment Date:</strong>
              </div>
              <div className="col-md-8">
                {moment(selectedAccount?.paymentDate).format(
                  "DD/MM/YY, h:mm A"
                )}
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-md-4">
                <strong>Status:</strong>
              </div>
              <div className="col-md-8">
                {selectedAccount?.paymentStatus ===
                  paymentConstants.PAYMENT_SUCCESS && (
                  <span className="text-success">Success</span>
                )}
                {selectedAccount?.paymentStatus ===
                  paymentConstants.PAYMENT_FAILURE && (
                  <span className="text-danger">Failed</span>
                )}
                {selectedAccount?.paymentStatus ===
                  paymentConstants.PAYMENT_PENDING && (
                  <span className="text-warning">Pending</span>
                )}
              </div>
            </div>
          </Modal.Body>
          {/* <Modal.Footer>
            <button className="btn btn-custom" onClick={handleClose}>
              Cancel
            </button>
          </Modal.Footer> */}
        </Modal>
      )}
      {openDialog && (
        <ConfirmationDialog
          open={true}
          actionType={actionType}
          title={actionTitle}
          content={actionContent}
          totalEmployee={
            [
              ...new Set(
                allRecords?.filter((item) =>
                  checkedPreference?.preferenceId?.includes(item?.Id)
                    ? item?.employeeName
                    : null
                )
              )
            ].length
          }
          totalProgram={
            [
              ...new Set(
                allRecords?.filter((item) =>
                  checkedPreference?.preferenceId?.includes(item?.Id)
                    ? item?.charityName
                    : null
                )
              )
            ].length
          }
          totalAmount={
            allRecords
              ? allRecords
                  ?.filter((item) =>
                    checkedPreference?.preferenceId?.includes(item?.Id)
                      ? item
                      : null
                  )
                  .reduce(
                    (total, currentValue) =>
                      (total = total + currentValue?.amount),
                    0
                  )
                  .toLocaleString()
              : 0
          }
          handleConfirm={() => {
            createBatch();
          }}
          handleCancel={() => {
            handleCloseDialog();
          }}
        />
      )}
    </div>
  );
};
export default DirectPayment;
