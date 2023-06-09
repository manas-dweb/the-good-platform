import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { donationPreferenceActions } from "../../actions/donationPreference.actions";
import { useDispatch, useSelector } from "react-redux";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import {
  donationPreferenceConstants,
  paginationConstants,
  userConstants,
  viewPortalConstants
} from "../../constants";
import DonationConsent from "./../Shared/DonationConsent";
import Loader from "./../Shared/Loader";
import ConfirmationDialog from "../Shared/ConfirmationDialog";
import { Link } from "react-router-dom";
// import Pagination from "./../Shared/Pagination";
import * as moment from "moment";
import "./../../assets/css/donationPreference.scss";
import donationsConsent from "./../../config/donationsConsent.json";
import { Tooltip } from "antd";
import ReactHtmlParser from "react-html-parser";

const preferenceForm = {
  employeePreferenceId: "",
  type: "",
  donationAmount: "",
  frequency: "",
  isConsentCheck: "",
  donationConsent: ""
};
const actionInitialValues = {
  isDeleted: false,
  isSuspended: false,
  suspendDuration: "",
  requestType: "",
  preferenceId: ""
};
// let pageSize = paginationConstants?.PAGE_SIZE;
const ListDonationPreferences = ({ tabType, items, repeatCharity }) => {
  let history = useHistory();
  const preferences = useSelector((state) => state.donationPreferences);
  const employee = useSelector((state) => state.employee.user);
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [checked, setChecked] = useState(false);
  const [selectedPreference, setSelectedPreference] = useState();
  const [records, setAllRecords] = useState([]);
  const [updateType, setUpdateType] = useState("");
  const [updatedValue, setUpdatedValue] = useState("");
  const [actionType, setActionType] = useState("");
  const [actionTitle, setActionTitle] = useState("");
  const [actionContent, setActionContent] = useState("");
  // const [repeatCharity, setRepeatCharity] = useState();
  const selectedCorporate = useSelector((state) => state.selectedCorporate);
  const currentPortal = useSelector((state) => state.currentView);
  const isCorporatePortal = employee?.user_type === userConstants.CORPORATE;
  const isEmployeePortal = employee?.user_type === userConstants.EMPLOYEE;

  // Pagination
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(
  //     donationPreferenceActions.getDonationPreferences({
  //       corporateId: isCorporatePortal ? selectedCorporate?.corporate?.corporateId : employee?.emp_id,
  //       userType: isCorporatePortal ? "Corporate" : "Employee",
  //       requestType: "Preference",
  //       pageSize: pageSize,
  //       offset: currentPage >= 2 ? currentPage * pageSize - pageSize : 0,
  //     })
  //   );
  // }, [currentPage]);
  const handleOpenDialog = (action, item) => {
    setOpenDialog(true);
    setActionType(action);
    setSelectedPreference(item);
    actionInitialValues.suspendDuration = "";
    if (action === "Delete") {
      setActionTitle(`Remove Confirmation`);
      setActionContent(
        `Are you sure want to remove from your donation preferences?<p className="mt-4"><strong>Organization:</strong> ${
          item?.socialOrganization
        }</p><p><strong>Program:</strong> ${
          item?.charityProgram
        }</p><p><strong>Category:</strong> ${
          item?.category
        }</p><p><strong>Amount:</strong> ${ReactHtmlParser(
          donationPreferenceConstants?.CURRENCY
        )}${item?.donationAmount}</p><p><strong>Frequency:</strong> ${
          item?.frequency === donationPreferenceConstants.ONCE_FREQUENCY
            ? donationPreferenceConstants.ONCE
            : donationPreferenceConstants.MONTHLY
        }</p><p><strong>Added On:</strong> ${moment(item?.createdDate).format(
          "DD MMM, YYYY"
        )}</p>`
      );
    } else {
      setActionTitle(`${action} Confirmation`);
      setActionContent(
        `Are you sure to ${action.toLowerCase()} <strong>"${
          item?.charityProgram
        }"</strong>?`
      );
    }
  };
  // const openNav = (charity, type) => {
  //   document.getElementsByClassName("sidepanel").classList.add("is-open");
  //   setRepeatCharity(charity);
  // };
  const setRepeatCharity = (charity) => {
    repeatCharity(charity);
  };
  const setDuration = (value) => {
    if (actionType === donationPreferenceConstants.SUSPEND) {
      actionInitialValues.suspendDuration = moment(new Date()).add(
        value,
        "months"
      );
    }
  };
  const handleCloseDialog = () => setOpenDialog(false);
  const confirm = () => {
    if (actionType === donationPreferenceConstants.REPEAT) {
      // selectedPreference.corporateId = employee?.corporateId;
      selectedPreference.donationConsent = `${
        donationsConsent?.consent
      } [Frequency: ${
        selectedPreference?.frequency ===
        donationPreferenceConstants.ONCE?.ONCE_FREQUENCY
          ? donationPreferenceConstants.ONCE
          : donationPreferenceConstants.MONTHLY
      }]`;
      dispatch(
        donationPreferenceActions.repeatDonationPreference(selectedPreference)
      );
    } else {
      actionInitialValues.isDeleted =
        actionType === donationPreferenceConstants.DELETE;
      actionInitialValues.isSuspended =
        actionType === donationPreferenceConstants.SUSPEND;
      actionInitialValues.preferenceId =
        selectedPreference?.employeePreferenceId;
      actionInitialValues.requestType = actionType;
      dispatch(
        donationPreferenceActions.operateActionRequest(actionInitialValues)
      );
    }
    handleCloseDialog();
  };
  const handleCheck = () => {
    setChecked(true);
    setOpen(false);
    updateDonationPreference();
  };
  const closeCheck = (selectedPreference) => {
    setChecked(false);
    setOpen(false);
    setUpdatedValue();
    document
      .getElementById("amount" + selectedPreference?.employeePreferenceId)
      .reset();
    document
      .getElementById("frequency" + selectedPreference?.employeePreferenceId)
      .reset();
  };
  const showConsent = (preference, type) => {
    setOpen(true);
    setSelectedPreference(preference);
    setUpdateType(type);
  };
  const updateDonationPreference = () => {
    preferenceForm.employeePreferenceId =
      selectedPreference.employeePreferenceId;
    preferenceForm.type = updateType;
    if (updateType === donationPreferenceConstants.AMOUNT) {
      preferenceForm.donationAmount = updatedValue.replace(/,/g, "");
      preferenceForm.donationConsent = `${
        donationsConsent?.consent
      } [Frequency: ${
        selectedPreference?.frequency === 2
          ? donationPreferenceConstants.MONTHLY
          : donationPreferenceConstants.ONCE
      }]`;
    }
    if (updateType === donationPreferenceConstants.FREQUENCY) {
      preferenceForm.frequency =
        updatedValue === donationPreferenceConstants.MONTHLY
          ? donationPreferenceConstants.MONTHLY_FREQUENCY
          : donationPreferenceConstants.ONCE_FREQUENCY;
      preferenceForm.donationConsent = `${donationsConsent?.consent} [Frequency: ${updatedValue}]`;
    }
    preferenceForm.isConsentCheck = true;
    dispatch(
      donationPreferenceActions.updateDonationPreference(preferenceForm)
    );
  };
  if (preferences.loading) {
    document.getElementById("root").classList.add("loading");
  } else {
    document.getElementById("root").classList.remove("loading");
  }
  const setPage = (page) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    setTotalCount(preferences?.totalCount);
  }, [preferences?.totalCount]);
  const keyDownHandler = (event, preference) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (
        updatedValue &&
        updatedValue?.toString()?.replace(/,/g, "") !==
          preference?.donationAmount?.toString()?.replace(/,/g, "")
      ) {
        showConsent(preference, donationPreferenceConstants.AMOUNT);
      }
    }
  };
  return (
    <div className="customContainer  program-list">
      {preferences.loading && <Loader />}
      <div className="ant-row">
        <div className="ant-col ant-col-24 mt-2">
          <div className="ant-table-wrapper">
            <div className="ant-table">
              <table>
                <thead className="ant-table-thead">
                  <tr>
                    {/* <th className="ant-table-cell">SR No.</th> */}
                    {isCorporatePortal && (
                      <th className="ant-table-cell">Employee Name</th>
                    )}
                    {isCorporatePortal && (
                      <th className="ant-table-cell">Employee ID</th>
                    )}
                    <th className="ant-table-cell">Program</th>
                    <th className="ant-table-cell">Organization</th>
                    <th className="ant-table-cell">Category</th>
                    <th className="ant-table-cell">Amount</th>
                    <th className="ant-table-cell text-center">Frequency</th>
                    <th className="ant-table-cell text-center">Status</th>
                    {/* {tabType !== donationPreferenceConstants.COMPLETED && ( */}
                    <th className="ant-table-cell text-center">Actions</th>
                    {/* )} */}
                  </tr>
                </thead>
                <tbody className="ant-table-tbody">
                  {items?.length > 0 ? (
                    items
                      ?.filter?.((preference) => !preference?.isDeleted)
                      .map?.((preference, index) => (
                        <tr
                          key={index + 1}
                          className="ant-table-row ant-table-row-level-0"
                        >
                          {isCorporatePortal && (
                            <td className="ant-table-cell">
                              <span className="ant-typography font-weight-bold">
                                {preference?.employeeName}
                              </span>
                            </td>
                          )}
                          {isCorporatePortal && (
                            <td className="ant-table-cell">
                              {preference?.employeeUid}
                            </td>
                          )}
                          <td className="ant-table-cell">
                            <Tooltip title={preference?.charityProgram}>
                              <span className="ant-typography font-weight-bold">
                                {preference?.charityProgram?.length > 30
                                  ? preference?.charityProgram?.substring(
                                      0,
                                      27
                                    ) + "..."
                                  : preference?.charityProgram}
                              </span>
                            </Tooltip>
                          </td>
                          <td className="ant-table-cell">
                            {preference?.socialOrganization}
                          </td>
                          <td className="ant-table-cell">
                            {preference?.category}
                          </td>
                          <td className="ant-table-cell">
                            <form
                              id={`amount${preference?.employeePreferenceId}`}
                            >
                              <input
                                name="amount"
                                type="text"
                                size="10"
                                maxLength={10}
                                defaultValue={preference?.donationAmount?.toLocaleString()}
                                className="form-control"
                                onKeyDown={(e) => keyDownHandler(e, preference)}
                                onBlur={() =>
                                  updatedValue &&
                                  updatedValue.toString()?.replace(/,/g, "") !==
                                    preference?.donationAmount
                                      ?.toString()
                                      ?.replace(/,/g, "")
                                    ? showConsent(
                                        preference,
                                        donationPreferenceConstants.AMOUNT
                                      )
                                    : null
                                }
                                onChange={(e) =>
                                  setUpdatedValue(e.target.value)
                                }
                                id={`amount${preference?.employeePreferenceId}`}
                                disabled={isCorporatePortal}
                              />
                            </form>
                          </td>
                          <td className="ant-table-cell text-center">
                            <form
                              id={`frequency${preference?.employeePreferenceId}`}
                            >
                              <BootstrapSwitchButton
                                checked={
                                  updatedValue
                                    ? updatedValue
                                    : preference?.frequency ===
                                      donationPreferenceConstants.ONCE_FREQUENCY
                                }
                                onlabel="Once"
                                onstyle="primary"
                                offlabel="Monthly"
                                offstyle="success"
                                style="w-100 mx-1"
                                size="sm"
                                disabled={isCorporatePortal}
                                onChange={(checked) => {
                                  showConsent(
                                    preference,
                                    donationPreferenceConstants.FREQUENCY
                                  );
                                  setUpdatedValue(
                                    checked
                                      ? donationPreferenceConstants.ONCE
                                      : donationPreferenceConstants.MONTHLY
                                  );
                                }}
                              />
                            </form>
                          </td>
                          <td className="ant-table-cell text-center text-uppercase">
                            {preference?.status ===
                              donationPreferenceConstants?.SUSPENDED && (
                              <>
                                {preference?.frequency ===
                                  donationPreferenceConstants?.MONTHLY_FREQUENCY && (
                                  <span className="text-danger">Suspended</span>
                                )}
                                {/* {preference?.frequency ===
                                  donationPreferenceConstants?.ONCE_FREQUENCY && (
                                  <span className="text-primary">
                                    Completed
                                  </span>
                                )} */}
                              </>
                            )}
                            {(!preference?.status ||
                              preference?.status ===
                                donationPreferenceConstants?.RESUMED) &&
                              tabType !==
                                donationPreferenceConstants.COMPLETED && (
                                <span className="text-success">Active</span>
                              )}
                            {tabType ===
                              donationPreferenceConstants.COMPLETED &&
                              preference?.status !==
                                donationPreferenceConstants?.SUSPENDED && (
                                <span className="text-success">Completed</span>
                              )}
                          </td>
                          {/* {tabType !==
                            donationPreferenceConstants.COMPLETED && ( */}
                          <td className="ant-table-cell text-center">
                            {preference?.frequency ===
                              donationPreferenceConstants?.MONTHLY_FREQUENCY &&
                              preference?.status ===
                                donationPreferenceConstants?.SUSPENDED && (
                                <Tooltip title="Resume">
                                  <Link
                                    onClick={() =>
                                      handleOpenDialog("Resume", preference)
                                    }
                                    className="mr-2"
                                  >
                                    <i className="bi bi-play-circle-fill fs-5 custom-color"></i>
                                  </Link>
                                </Tooltip>
                              )}
                            {preference?.frequency ===
                              donationPreferenceConstants?.MONTHLY_FREQUENCY &&
                              (!preference?.status ||
                                preference?.status ===
                                  donationPreferenceConstants?.RESUMED) && (
                                <Tooltip title="Suspend">
                                  <Link
                                    onClick={() =>
                                      handleOpenDialog("Suspend", preference)
                                    }
                                    className="mr-2"
                                  >
                                    <i className="bi bi-pause-circle-fill fs-5 custom-color"></i>
                                  </Link>
                                </Tooltip>
                              )}
                            {preference?.frequency ===
                              donationPreferenceConstants?.ONCE_FREQUENCY && (
                              <Tooltip
                                title={donationPreferenceConstants.REPEAT}
                              >
                                <Link
                                  onClick={() => setRepeatCharity(preference)}
                                  className="mr-2"
                                >
                                  <i className="bi bi-arrow-repeat fs-5 custom-color"></i>
                                </Link>
                              </Tooltip>
                            )}
                            {tabType !==
                              donationPreferenceConstants.COMPLETED && (
                              <Tooltip title={"Delete"}>
                                <Link
                                  onClick={() =>
                                    handleOpenDialog("Delete", preference)
                                  }
                                >
                                  <i className="bi bi-trash fs-5 custom-color"></i>
                                </Link>
                              </Tooltip>
                            )}
                          </td>
                          {/* )} */}
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center">
                        No preferences found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {items?.length > 0 && (
                <div className="row mt-4">
                  <div className="col-md-12 text-right">
                    <h5>
                      Total:&nbsp;
                      <span className="fs-5">
                        {ReactHtmlParser(donationPreferenceConstants?.CURRENCY)}
                        {items
                          ?.reduce(
                            (total, currentValue) =>
                              (total = total + currentValue.donationAmount),
                            0
                          )
                          .toLocaleString()}
                      </span>
                    </h5>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* <Pagination
        className="pagination-bar mt-4"
        currentPage={currentPage}
        totalCount={totalCount ? totalCount : 0}
        pageSize={pageSize}
        onPageChange={(page) => setPage(page)}
      /> */}
      {openDialog && (
        <ConfirmationDialog
          open={true}
          actionType={actionType}
          title={actionTitle}
          content={actionContent}
          duration={setDuration}
          handleConfirm={() => {
            confirm();
          }}
          handleCancel={() => {
            handleCloseDialog();
          }}
        />
      )}
      {open && (
        <DonationConsent
          open={open}
          selectedCharity={selectedPreference}
          employee={employee}
          frequency={
            updateType === donationPreferenceConstants.FREQUENCY
              ? updatedValue
                ? updatedValue === donationPreferenceConstants.MONTHLY
                  ? donationPreferenceConstants.MONTHLY
                  : donationPreferenceConstants.ONCE
                : selectedPreference?.frequency === 2
                ? donationPreferenceConstants.MONTHLY
                : donationPreferenceConstants.ONCE
              : selectedPreference?.frequency === 2
              ? donationPreferenceConstants.MONTHLY
              : donationPreferenceConstants.ONCE
          }
          amount={
            updateType === donationPreferenceConstants.AMOUNT
              ? updatedValue
                ? updatedValue
                : selectedPreference?.donationAmount
              : selectedPreference?.donationAmount
          }
          handleCheck={handleCheck}
          closeCheck={() => closeCheck(selectedPreference)}
        />
      )}
    </div>
  );
};
export default ListDonationPreferences;
