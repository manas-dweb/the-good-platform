import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form } from "formik";
import {
  donationPreferenceConstants,
  payrollConstants,
  paginationConstants,
} from "../../constants";
import { payrollBatchActions } from "../../actions/payrollBatch.actions";
import Loader from "./../Shared/Loader";
import { Link } from "react-router-dom";
import * as moment from "moment";
import ReactHtmlParser from "react-html-parser";
// import payrollBatch from "./../../config/payrollBatch.json";
import { Modal, Button } from "react-bootstrap";
import "./../../assets/css/payroll.scss";
import Pagination from "./../Shared/Pagination";
import { Progress } from "antd";
import { ProcessHelper, history } from "./../../helpers";
import { Accordion } from "react-bootstrap";
import PayrollBatchDetail from "./PayrollBatchDetail";

const confirmInitialValues = {
  batchId: "",
  requestType: "",
};
let pageSize = paginationConstants?.PAGE_SIZE;
let accordionData;
const PayrollBatchAccordion = (props) => {
  // let history = useHistory();
  const payrollBatches = useSelector((state) => state.payrollBatch);
  const batchId = props?.batchId;
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [referenceNote, setReferenceNote] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [checked, setChecked] = useState(false);
  const [isBatchDetail, setIsBatchDetail] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState(false);
  const [selectedPreference, setSelectedPreference] = useState();
  const [selectedBatch, setSelectedBatch] = useState();
  const [actionType, setActionType] = useState("");
  const [actionTitle, setActionTitle] = useState("");
  const [actionContent, setActionContent] = useState("");
  const currentView = props?.viewType;
  // const [currentView, setCurrentView] = useState(props?.viewType);

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
  const showReferenceNote = (referenceNote) => {
    setShow(true);
    setReferenceNote(referenceNote);
  };

  const handleOpen = (action, item) => {
    setOpen(true);
    setActionType(action);
    setSelectedBatch(item);
    setActionTitle(`${action}`);
    setActionContent(
      `Are you sure to ${
        action == "Confirm Batch" ? "confirm" : "unconfirm"
      } this batch <strong>"${item?.batchId}"</strong>?`
    );
    confirmInitialValues.batchId = item?.batchId;
    if (action === "Confirm Batch") {
      confirmInitialValues.requestType = payrollConstants.CONFIRM;
    } else {
      confirmInitialValues.requestType = payrollConstants.UNCONFIRM;
    }
  };
  const handleCancel = () => {
    setShow(false);
  };
  const confirm = (values) => {
    handleClose();
    dispatch(payrollBatchActions.updateBatchStatus(values));
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedBatch(null);
    setActionType(null);
  };
  // const showBatchDetail = (batchId) => {
  //   // props?.isBatchDetail = true
  //   setIsBatchDetail(true);
  //   setSelectedBatchId(batchId);
  // };
  // const hideBatchDetail = (status) => {
  //   setIsBatchDetail(status);
  //   setSelectedBatchId(null);
  // };
  const groupBy = (key) => {
    return payrollBatches?.items?.reduce(function (acc, item) {
      (acc[item[key]] = acc[item[key]] || []).push(item);
      return acc;
    }, {});
  };
  if (props?.viewType === payrollConstants.ORGANIZATION_VIEW) {
    accordionData = groupBy("socialOrganizationName");
  } else {
    accordionData = groupBy("corporateName");
  }
  return (
    <>
      {accordionData && !isBatchDetail && (
        <>
          {Object.keys(accordionData).map((type, index) => (
            <div className="row mt-4">
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
                                    <th className="ant-table-cell">Sr No.</th>
                                    <th className="ant-table-cell">Batch id</th>
                                    {currentView ===
                                      payrollConstants.CORPORATE_VIEW && (
                                      <th className="ant-table-cell">
                                        Organization Id
                                      </th>
                                    )}
                                    {currentView ===
                                      payrollConstants.CORPORATE_VIEW && (
                                      <th className="ant-table-cell">
                                        Organization Name
                                      </th>
                                    )}
                                    {currentView ===
                                      payrollConstants.ORGANIZATION_VIEW && (
                                      <th className="ant-table-cell">
                                        Corporate ID
                                      </th>
                                    )}
                                    {currentView ===
                                      payrollConstants.ORGANIZATION_VIEW && (
                                      <th className="ant-table-cell">
                                        Corporate Name
                                      </th>
                                    )}
                                    <th className="ant-table-cell">
                                      Crated Date
                                    </th>
                                    <th className="ant-table-cell">
                                      Amount (
                                      {ReactHtmlParser(
                                        donationPreferenceConstants?.CURRENCY
                                      )}
                                      )
                                    </th>
                                    <th className="ant-table-cell">REF ID</th>
                                    <th className="ant-table-cell">Status</th>
                                    <th className="ant-table-cell text-center">
                                      Actions
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="ant-table-tbody">
                                  {accordionData[type]?.map((batch, index) => (
                                    <tr
                                      key={index + 1}
                                      className="ant-table-row ant-table-row-level-0"
                                    >
                                      <td className="ant-table-cell">
                                        {currentPage >= 2
                                          ? currentPage * pageSize -
                                            pageSize +
                                            index +
                                            1
                                          : index + 1}
                                      </td>
                                      <td className="ant-table-cell">
                                        <Link
                                          onClick={() =>
                                            props?.showBatchDetail(
                                              batch?.batchId
                                            )
                                          }
                                        >
                                          {batch?.batchId}
                                        </Link>
                                      </td>
                                      {currentView ===
                                        payrollConstants.CORPORATE_VIEW && (
                                        <td className="ant-table-cell">
                                          {batch?.socialOrganizationId}
                                        </td>
                                      )}
                                      {currentView ===
                                        payrollConstants.CORPORATE_VIEW && (
                                        <td className="ant-table-cell">
                                          {batch?.socialOrganizationName}
                                        </td>
                                      )}
                                      {currentView ===
                                        payrollConstants.ORGANIZATION_VIEW && (
                                        <td className="ant-table-cell">
                                          {batch?.corporateId}
                                        </td>
                                      )}
                                      {currentView ===
                                        payrollConstants.ORGANIZATION_VIEW && (
                                        <td className="ant-table-cell">
                                          {batch?.corporateName}
                                        </td>
                                      )}
                                      <td className="ant-table-cell">
                                        {moment(batch?.createdDate).format(
                                          "MMM, YYYY"
                                        )}
                                      </td>
                                      <td className="ant-table-cell">
                                        {batch?.amount?.toLocaleString()}
                                      </td>
                                      <td className="ant-table-cell">
                                        <Link
                                          onClick={() =>
                                            showReferenceNote(
                                              batch?.referenceNote
                                            )
                                          }
                                        >
                                          {batch?.referenceId}
                                        </Link>
                                      </td>
                                      <td className="ant-table-cell">
                                        {batch?.status ===
                                          payrollConstants.COMPLETED_STATUS && (
                                          <>
                                            <span>
                                              {/* {payrollConstants.CONFIRMED} */}
                                              25% (Batch created)
                                            </span>
                                            <Progress
                                              percent={25}
                                              showInfo={false}
                                            />
                                          </>
                                        )}
                                        {batch?.status ===
                                          payrollConstants.CONFIRMED_STATUS && (
                                          <>
                                            <span>
                                              {/* {payrollConstants.CONFIRMED} */}
                                              50% (Confirmed by Bluepencil)
                                            </span>
                                            <Progress
                                              percent={50}
                                              showInfo={false}
                                            />
                                          </>
                                        )}
                                        {batch?.status ===
                                          payrollConstants.PAID_STATUS && (
                                          <>
                                            <span>
                                              {/* {payrollConstants.CONFIRMED} */}
                                              75% (Paid to Social Organization)
                                            </span>
                                            <Progress
                                              percent={75}
                                              showInfo={false}
                                            />
                                          </>
                                        )}
                                        {batch?.status ===
                                          payrollConstants.RECEIVED_STATUS && (
                                          <>
                                            <span>
                                              {/* {payrollConstants.CONFIRMED} */}
                                              100% (Paid to Social Organization)
                                            </span>
                                            <Progress
                                              percent={100}
                                              showInfo={false}
                                            />
                                          </>
                                        )}
                                      </td>
                                      <td className="ant-table-cell text-center">
                                        {batch?.status ===
                                        payrollConstants.CONFIRMED_STATUS ? (
                                          <Link
                                            onClick={() =>
                                              handleOpen(
                                                "Unconfirm Batch",
                                                batch
                                              )
                                            }
                                          >
                                            <span
                                              className="bi-x-circle fs-5"
                                              title="Unconfirm"
                                            ></span>
                                          </Link>
                                        ) : (
                                          <Link
                                            onClick={() =>
                                              handleOpen("Confirm Batch", batch)
                                            }
                                          >
                                            <span
                                              className="bi-check-circle fs-5"
                                              title="Confirm"
                                            ></span>
                                          </Link>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              ) : (
                <div className="text-center m-4">No data found</div>
              )}
            </div>
          ))}
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
                <Modal.Title>{actionTitle}</Modal.Title>
              </Modal.Header>
              <Formik
                initialValues={confirmInitialValues}
                validationSchema={null}
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
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        className="btn btn-custom"
                        type="submit"
                        disabled={isSubmitting}
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
        </>
      )}
      {isBatchDetail && (
        <PayrollBatchDetail
          batchId={selectedBatchId}
          hideBatchDetail={() => props?.hideBatchDetail()}
        />
      )}
    </>
  );
};
export default PayrollBatchAccordion;
