import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import { CompleteBatchSchema } from "./../Validations";
import {
  donationPreferenceConstants,
  payrollConstants,
  paginationConstants,
  viewPortalConstants,
} from "../../constants";
import { payrollBatchActions } from "../../actions/payrollBatch.actions";
import Loader from "./../Shared/Loader";
import { Link } from "react-router-dom";
import * as moment from "moment";
import ReactHtmlParser from "react-html-parser";
import { Modal, Button } from "react-bootstrap";
import { Tabs, Progress, Tooltip } from "antd";
import "./../../assets/css/payroll.scss";
import Pagination from "./../Shared/Pagination";
import PayrollBatchDetail from "./PayrollBatchDetail";
import PayrollBatchAccordion from "./PayrollBatchAccordion";
import { AuditOutlined, RedoOutlined } from "@ant-design/icons";
import { TotalHelper } from "../../helpers";
const TabPane = Tabs.TabPane;

const completeInitialValues = {
  batchId: "",
  requestType: "",
  referenceId: "",
  referenceNote: "",
};
const confirmInitialValues = {
  batchId: "",
  requestType: "",
  socialId: "",
};
const paidInitialValues = {
  batchId: "",
  requestType: "",
  referenceId: "",
  referenceNote: "",
};
const TableData = ({
  corporateId,
  organizationId,
  groupByBatchData,
  isBatchDetail,
  index,
}) => {
  // let history = useHistory();
  const payrollBatches = useSelector((state) => state.payrollBatch);
  const employee = useSelector((state) => state.employee.user);
  const currentPortal = useSelector((state) => state.currentView);
  const isOrganizationPortal =
    currentPortal?.currentView ===
    viewPortalConstants.SOCIAL_ORGANIZATION_PORTAL;
  const isBluePencilPortal =
    currentPortal?.currentView ===
    viewPortalConstants.BLUE_PENCEIL_ADMIN_PORTAL;
  const isCorporatePortal =
    currentPortal?.currentView === viewPortalConstants.CORPORATE_PORTAL;
  const selectedOrganization = useSelector(
    (state) => state?.selectedOrganization?.organization
  );
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [referenceNote, setReferenceNote] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [checked, setChecked] = useState(false);
  const [batchDetail, setBatchDetail] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState(false);
  const [selectedPreference, setSelectedPreference] = useState();
  const [selectedBatch, setSelectedBatch] = useState();
  const [updateType, setUpdateType] = useState("");
  const [updatedValue, setUpdatedValue] = useState();
  const [actionType, setActionType] = useState("");
  const [actionTitle, setActionTitle] = useState("");
  const [actionContent, setActionContent] = useState("");
  const [records, setRecords] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [allRecords, setAllRecords] = useState(records);
  const [selected, setSelected] = useState();

  const [openPaidSimulator, setOpenPaidSimulator] = useState(false);
  const [currentView, setCurrentView] = useState(
    isBluePencilPortal
      ? payrollConstants?.LIST_VIEW
      : payrollConstants?.CORPORATE_VIEW
  );

  // Pagination
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const setPage = (page) => {
    setCurrentPage(page);
  };
  const handleOpenDialog = (action, item) => {
    setOpenDialog(true);
    setActionType(action);
    setSelectedPreference(item);
    setActionTitle(`${action} Confirmation`);
    setActionContent(
      `Are you sure to ${action.toLowerCase()} <strong>"${
        item?.charityProgram
      }"</strong>?`
    );
  };

  if (payrollBatches.loading) {
    document.getElementById("root").classList.add("loading");
  } else {
    document.getElementById("root").classList.remove("loading");
  }
  const showReferenceNote = (referenceNote) => {
    setShow(true);
    setReferenceNote(referenceNote);
  };
  const statusOption = [
    { label: "All", value: 0 },
    { label: "Pending", value: payrollConstants.PENDING_STATUS },
    { label: "Processed", value: "10" },
  ];
  const openPaidConfirmation = (item) => {
    paidInitialValues.referenceNote = `Processed payroll batch for the month of ${moment().format(
      "MMMM"
    )} - ${item?.corporateName}`;
    setOpenPaidSimulator(true);
    setSelectedBatch(item);
  };
  const hidePaidSimulator = () => {
    setOpenPaidSimulator(false);
  };
  const confirmPaid = (values) => {
    dispatch(
      payrollBatchActions.updateBatchStatus({
        batchId: selectedBatch?.batchId,
        requestType: payrollConstants.PAID,
        referenceId: values?.referenceId,
        referenceNote: values?.referenceNote,
      })
    );
    hidePaidSimulator();
  };
  const handleOpen = (action, item) => {
    setOpen(true);
    setActionType(action);
    setSelectedBatch(item);
    if (isOrganizationPortal) {
      setActionTitle("Confirm Payment Receipt");
      setActionContent(`Are you sure want to receive this batch payments?`);
    } else {
      setActionTitle(
        `${!(isBluePencilPortal && action === "Confirm Batch") ? action : ""} ${
          corporateId
            ? "Confirmation"
            : isBluePencilPortal && action === "Confirm Batch"
            ? "Confirm Payment Receipt"
            : ""
        }`
      );
      completeInitialValues.referenceNote = `Processed payroll batch for the month of ${moment().format(
        "MMMM"
      )} - ${item?.corporateName}`;
      setActionContent(
        `Are you sure want to ${
          corporateId
            ? "complete"
            : action == "Confirm Batch"
            ? "confirm payment receipt"
            : "unconfirm"
        } for this batch?`
      );
    }
    if (action === "Complete Batch") {
      completeInitialValues.referenceNote = `Process batch for the month of ${moment().format(
        "MMMM"
      )} - ${item?.corporateName}`;
      completeInitialValues.batchId = item?.batchId;
      completeInitialValues.requestType = payrollConstants.COMPLETE;
    } else if (action === "Receive Batch") {
      confirmInitialValues.batchId = item?.batchId;
      confirmInitialValues.requestType = payrollConstants.RECEIVE;
      confirmInitialValues.socialId = isOrganizationPortal
        ? selectedOrganization?.id
        : null;
    } else {
      confirmInitialValues.batchId = item?.batchId;
      if (action === "Confirm Batch") {
        confirmInitialValues.requestType = payrollConstants.CONFIRM;
      } else {
        confirmInitialValues.requestType = payrollConstants.UNCONFIRM;
      }
    }
  };
  const handleCancel = () => {
    setShow(false);
  };
  const confirm = (values) => {
    handleClose();
    // if (values) {
    //   values.batchId = selectedBatch?.batchId;
    //   values.action = actionType === "Complete Batch" ? "Complete" : "Confirm";
    // }
    dispatch(payrollBatchActions.updateBatchStatus(values));
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedBatch(null);
    setActionType(null);
  };
  const showBatchDetail = (batchId) => {
    isBatchDetail(batchId);
    setBatchDetail(true);
    // setIsBatchDetail(true);
    //setSelectedBatchId(batchId);
  };
  const hideBatchDetail = (status) => {
    // setIsBatchDetail(status);
    // setSelectedBatchId(null);
  };
  const filter = (value) => {
    if (value && value !== "0" && value !== "10") {
      setRecords(
        payrollBatches?.items?.filter(
          (record) => record?.status?.toString() === value
        )
      );
    } else if (value && value === "10") {
      setRecords(
        payrollBatches?.items?.filter(
          (record) => record?.status?.toString() !== value
        )
      );
    } else {
      setRecords(payrollBatches?.items);
    }
  };
  const onSearchChange = (e, selected) => {
    const keyword = e.target.value;
    if (keyword !== "") {
      const results = records.filter((rec) => {
        if (selected === "batchId") {
          return rec?.batchId.toLowerCase().startsWith(keyword.toLowerCase());
        } else if (selected === "corporateName") {
          return rec?.corporateName
            .toLowerCase()
            .startsWith(keyword.toLowerCase());
        } else {
          return rec?.referenceId
            .toLowerCase()
            .startsWith(keyword.toLowerCase());
        }
      });
      setAllRecords(results);
    } else {
      setAllRecords(records);
    }
    setSearchValue(keyword);
  };
  const onHandleChange = (e) => {
    setSelected(e.target.value);
  };
  const uniqueBy = (arr, prop) => {
    return arr?.reduce((a, d) => {
      if (!a.includes(d[prop])) {
        a.push(d[prop]);
      }
      return a;
    }, []);
  };
  return (
    <>
      {
        groupByBatchData && groupByBatchData?.length > 0 && (
          //   Object.keys(groupByBatchData)?.map((type, index) => (
          <tr className="ant-table-row ant-table-row-level-0">
            {/* <td className="ant-table-cell">
                                        {currentPage >= 2
                                          ? currentPage * pageSize -
                                            pageSize +
                                            index +
                                            1
                                          : index + 1}
                                      </td> */}
            <td className="ant-table-cell">
              <Link
                onClick={() => showBatchDetail(groupByBatchData[0]?.batchId)}
              >
                {groupByBatchData[0]?.batchId}
              </Link>
            </td>
            {/* {currentView ===
                                          payrollConstants.ORGANIZATION_VIEW && (
                                          <td className="ant-table-cell">
                                            {batch?.socialOrganizationId}
                                          </td>
                                        )} */}
            {currentView === payrollConstants.ORGANIZATION_VIEW && (
              <td className="ant-table-cell">
                {groupByBatchData[0].socialOrganizationName}
              </td>
            )}
            {/* {!corporateId && (
                                        <td className="ant-table-cell">
                                          {batch?.corporateId}
                                        </td>
                                      )} */}
            {!corporateId && (
              <td className="ant-table-cell">
                {groupByBatchData[0]?.corporateName}
              </td>
            )}
            <td className="ant-table-cell">
              {moment(groupByBatchData[0]?.createdDate).format("MMM, YYYY")}
            </td>
            <td className="ant-table-cell">
              {ReactHtmlParser(donationPreferenceConstants?.CURRENCY)}
              {groupByBatchData
                ? groupByBatchData
                    ?.reduce(
                      (total, currentValue) =>
                        (total = total + currentValue?.amount),
                      0
                    )
                    .toLocaleString()
                : 0}
            </td>
            <td className="ant-table-cell">
              <Link
                onClick={() =>
                  showReferenceNote(groupByBatchData[0]?.referenceNote)
                }
              >
                {groupByBatchData[0]?.referenceId}
              </Link>
            </td>
            <td className="ant-table-cell">
              {groupByBatchData[0]?.status ===
                payrollConstants.COMPLETED_STATUS && (
                <>
                  <span>
                    {/* {payrollConstants.CONFIRMED} */}
                    25% (Batch created)
                  </span>
                  <Progress percent={25} showInfo={false} />
                </>
              )}
              {groupByBatchData[0]?.status ===
                payrollConstants.CONFIRMED_STATUS && (
                <>
                  <span>
                    {/* {payrollConstants.CONFIRMED} */}
                    50% (Confirmed by Bluepencil)
                  </span>
                  <Progress percent={50} showInfo={false} />
                </>
              )}
              {groupByBatchData[0]?.status === payrollConstants.PAID_STATUS &&
                !groupByBatchData[0]?.receivedOrganizationIds && (
                  <>
                    <span>
                      {/* {payrollConstants.CONFIRMED} */}
                      75% (Paid to Social Organization)
                    </span>
                    <Progress percent={75} showInfo={false} />
                  </>
                )}
              {(groupByBatchData[0]?.status ===
                payrollConstants.RECEIVED_STATUS ||
                groupByBatchData[0]?.status === payrollConstants.PAID_STATUS) &&
                groupByBatchData[0]?.receivedOrganizationIds &&
                groupByBatchData[0]?.receivedOrganizationIds?.split(",")
                  ?.length !== groupByBatchData[0]?.totalOrganizationCount && (
                  <>
                    <span>
                      {/* {payrollConstants.CONFIRMED} */}
                      {TotalHelper(groupByBatchData[0]?.totalOrganizationCount)}
                      % (`$
                      {TotalHelper(
                        groupByBatchData[0]?.totalOrganizationCount
                      ) < 100
                        ? "Partially received by organizations"
                        : "Received by Social Organization"}
                      `)
                    </span>
                    <Progress
                      percent={
                        75 +
                        Math.round(
                          25 / groupByBatchData[0]?.totalOrganizationCount
                        )
                      }
                      showInfo={false}
                    />
                  </>
                )}
              {groupByBatchData[0]?.status ===
                payrollConstants.RECEIVED_STATUS &&
                groupByBatchData[0]?.receivedOrganizationIds?.split(",")
                  ?.length === groupByBatchData[0]?.totalOrganizationCount && (
                  <>
                    <span>
                      {/* {payrollConstants.CONFIRMED} */}
                      100% (Received by Social Organization)
                    </span>
                    <Progress percent={100} showInfo={false} />
                  </>
                )}
            </td>
            <td className="ant-table-cell text-center">
              {corporateId &&
                groupByBatchData[0]?.status ===
                  payrollConstants.PENDING_STATUS && (
                  <Tooltip title="Complete">
                    <Link
                      onClick={() =>
                        handleOpen("Complete Batch", groupByBatchData[0])
                      }
                    >
                      <span className="bi-check-circle fs-5"></span>
                    </Link>
                  </Tooltip>
                )}
              {!corporateId && !isOrganizationPortal && (
                <>
                  {groupByBatchData[0]?.status ===
                  payrollConstants.CONFIRMED_STATUS ? (
                    <>
                      <Tooltip title="Unconfirm">
                        <Link
                          onClick={() =>
                            handleOpen("Unconfirm Batch", groupByBatchData[0])
                          }
                        >
                          <span className="bi-arrow-counterclockwise fs-5"></span>
                        </Link>
                      </Tooltip>
                      <Tooltip title="Paid">
                        <Link
                          onClick={() =>
                            openPaidConfirmation(groupByBatchData[0])
                          }
                        >
                          <span className="bi-check-square fs-5 ml-2"></span>
                        </Link>
                      </Tooltip>
                    </>
                  ) : (
                    groupByBatchData[0]?.status ===
                      payrollConstants.COMPLETED_STATUS && (
                      <Tooltip title="Confirm">
                        <Link
                          onClick={() =>
                            handleOpen("Confirm Batch", groupByBatchData[0])
                          }
                        >
                          <span className="bi-check-circle fs-5"></span>
                        </Link>
                      </Tooltip>
                    )
                  )}
                </>
              )}
              {isOrganizationPortal &&
                groupByBatchData[0]?.status !==
                  payrollConstants.RECEIVED_STATUS && (
                  <Tooltip title="Confirm Payment Receipt">
                    <Link
                      onClick={() =>
                        handleOpen("Receive Batch", groupByBatchData[0])
                      }
                    >
                      <img
                        src="/assets/img/receive.svg"
                        alt="Receive"
                        height={20}
                        className="custom-color"
                      />
                    </Link>
                  </Tooltip>
                )}
              {isOrganizationPortal &&
                groupByBatchData[0]?.status ===
                  payrollConstants.RECEIVED_STATUS && (
                  <Tooltip title="Received">
                    <span className="bi-check-square-fill fs-5"></span>
                  </Tooltip>
                )}
            </td>
          </tr>
        )
        //   ))}
      }
      {open && (
        <Modal show={open} onHide={handleClose} backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>{actionTitle}</Modal.Title>
          </Modal.Header>
          <Formik
            initialValues={
              corporateId ? completeInitialValues : confirmInitialValues
            }
            validationSchema={corporateId ? CompleteBatchSchema : null}
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
              isSubmitting,
            }) => (
              <Form>
                <Modal.Body style={{ fontSize: "18" }}>
                  {ReactHtmlParser(actionContent)}
                  {actionType !== payrollConstants.COMPLETE_BATCH && (
                    <>
                      <div className="row mt-4 mb-2">
                        <div className="col-md-4">
                          <strong>Corporate Name:</strong>
                        </div>
                        <div className="col-md-8">
                          {selectedBatch?.corporateName}
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-md-4">
                          <strong>Batch ID:</strong>
                        </div>
                        <div className="col-md-8">{selectedBatch?.batchId}</div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-md-4">
                          <strong>Amount:</strong>
                        </div>
                        <div className="col-md-8">
                          {ReactHtmlParser(
                            donationPreferenceConstants?.CURRENCY
                          )}
                          {payrollBatches?.items
                            ?.reduce(
                              (total, currentValue) =>
                                (total = total + currentValue.amount),
                              0
                            )
                            .toLocaleString()}
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-md-4">
                          <strong>Payment Date:</strong>
                        </div>
                        <div className="col-md-8">
                          {moment(selectedBatch?.createdDate).format(
                            "MMM, YYYY"
                          )}
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-md-4">
                          <strong>Reference ID:</strong>
                        </div>
                        <div className="col-md-8">
                          {selectedBatch?.referenceId}
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-md-4">
                          <strong>Reference Note:</strong>
                        </div>
                        <div className="col-md-8">
                          {selectedBatch?.referenceNote}
                        </div>
                      </div>
                    </>
                  )}
                  {actionType === payrollConstants.COMPLETE_BATCH && (
                    <>
                      <div className="mt-3 mb-0">
                        <strong>Batch ID:</strong>&nbsp;
                        {selectedBatch?.batchId}
                      </div>
                      <div className="mt-3 mb-0">
                        <strong>Total Amount:</strong>&nbsp;
                        {ReactHtmlParser(donationPreferenceConstants?.CURRENCY)}
                        {payrollBatches?.items
                          ?.reduce(
                            (total, currentValue) =>
                              (total = total + currentValue.amount),
                            0
                          )
                          .toLocaleString()}
                      </div>
                      <div className="form-group mt-0">
                        <label>
                          <strong>Reference ID*</strong>
                        </label>
                        <input
                          type="text"
                          name="referenceId"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={50}
                          placeholder="Enter reference ID"
                          className="form-control"
                        />
                        <span className="error">
                          {errors.referenceId &&
                            touched.referenceId &&
                            errors.referenceId}
                        </span>
                      </div>
                      <div className="form-group">
                        <label>
                          <strong>Reference Note*</strong>
                        </label>
                        <textarea
                          rows="3"
                          name="referenceNote"
                          value={values?.referenceNote}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={500}
                          placeholder="Enter reference note"
                          className="form-control"
                        />
                        <span className="error">
                          {errors.referenceNote &&
                            touched.referenceNote &&
                            errors.referenceNote}
                        </span>
                      </div>
                    </>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    className="btn btn-custom"
                    type="submit"
                    disabled={
                      isSubmitting ||
                      (!values.referenceId && !values.referenceNote)
                    }
                  >
                    Yes
                  </Button>
                  <Button variant="danger" onClick={handleClose}>
                    No
                  </Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal>
      )}
      <Modal show={show} onHide={handleCancel} backdrop="static">
        <Modal.Header closeButton className="fs-5 p-2">
          <Modal.Title>Reference Note</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: "18" }}>{referenceNote}</Modal.Body>
      </Modal>
      {openPaidSimulator && (
        <Modal
          show={openPaidSimulator}
          onHide={hidePaidSimulator}
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>Paid Confirmation</Modal.Title>
          </Modal.Header>
          <Formik
            initialValues={paidInitialValues}
            validationSchema={null}
            // validationSchema={CompleteBatchSchema}
            onSubmit={(values) => {
              confirmPaid(values);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <Form>
                <Modal.Body style={{ fontSize: "18" }}>
                  <p>
                    This is a simulating service. Click on the respective button
                    to send the response.
                  </p>
                  {/* <div className="form-group mt-0">
                    <label>
                      <strong>Reference ID*</strong>
                    </label>
                    <input
                      type="text"
                      name="referenceId"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={50}
                      placeholder="Enter reference ID"
                      className="form-control"
                    />
                    <span className="error">
                      {errors.referenceId &&
                        touched.referenceId &&
                        errors.referenceId}
                    </span>
                  </div>
                  <div className="form-group">
                    <label>
                      <strong>Reference Note*</strong>
                    </label>
                    <textarea
                      rows="3"
                      name="referenceNote"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values?.referenceNote}
                      maxLength={500}
                      placeholder="Enter reference note"
                      className="form-control"
                    />
                    <span className="error">
                      {errors.referenceNote &&
                        touched.referenceNote &&
                        errors.referenceNote}
                    </span>
                  </div> */}
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    type="submit"
                    variant="success"
                    // disabled={!values?.referenceId || !values?.referenceNote}
                  >
                    Simulate Success
                  </Button>
                  <Button variant="danger" onClick={hidePaidSimulator}>
                    Simulate Failure
                  </Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal>
      )}
    </>
  );
};
export default TableData;
