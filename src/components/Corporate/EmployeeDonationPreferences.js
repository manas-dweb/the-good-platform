import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { donationPreferenceActions } from "../../actions/donationPreference.actions";
import { useDispatch, useSelector } from "react-redux";
import {
  donationPreferenceConstants,
  paginationConstants,
  viewPortalConstants,
} from "../../constants";
import Loader from "./../Shared/Loader";
import ConfirmationDialog from "../Shared/ConfirmationDialog";
import Pagination from "./../Shared/Pagination";
import * as moment from "moment";
import ListDonationPreferences from "../DonationPreferences/ListDonationPreferences";
import { Tabs } from "antd";
import { AuditOutlined, RedoOutlined } from "@ant-design/icons";
import { SearchDonationPreferenceHelper } from "../../helpers";

const preferenceForm = {
  employeePreferenceId: "",
  type: "",
  donationAmount: "",
  frequency: "",
  isConsentCheck: "",
};
const actionInitialValues = {
  isDeleted: false,
  isSuspended: false,
  suspendDuration: "",
  requestType: "",
  preferenceId: "",
};
let pageSize = paginationConstants?.PAGE_SIZE;
const TabPane = Tabs.TabPane;
const EmployeeDonationPreferences = () => {
  let history = useHistory();
  const preferences = useSelector((state) => state.donationPreferences);
  const employee = useSelector((state) => state.employee.user);
  const currentPortal = useSelector((state) => state.currentView);
  const selectedCorporate = useSelector((state) => state.selectedCorporate);
  const isCorporatePortal =
    currentPortal?.currentView === viewPortalConstants.CORPORATE_PORTAL;
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [checked, setChecked] = useState(false);
  const [selectedPreference, setSelectedPreference] = useState();
  const [updateType, setUpdateType] = useState("");
  const [updatedValue, setUpdatedValue] = useState();
  const [actionType, setActionType] = useState("");
  const [actionTitle, setActionTitle] = useState("");
  const [actionContent, setActionContent] = useState("");
  const [selected, setSelected] = useState();
  const [tabType, setTabType] = useState(donationPreferenceConstants.ACTIVE);

  // Pagination
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      donationPreferenceActions.getDonationPreferences({
        corporateId: selectedCorporate?.corporate?.corporateId
          ? selectedCorporate?.corporate?.corporateId
          : selectedCorporate?.corporate?.id,
        userType: isCorporatePortal ? "Corporate" : null,
        requestType: "Preference",
        pageSize: pageSize,
        offset: currentPage >= 2 ? currentPage * pageSize - pageSize : 0,
      })
    );
  }, [currentPage]);

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
    handleCloseDialog();
    actionInitialValues.isDeleted =
      actionType === donationPreferenceConstants.DELETE;
    actionInitialValues.isSuspended =
      actionType === donationPreferenceConstants.SUSPEND;
    actionInitialValues.preferenceId = selectedPreference?.employeePreferenceId;
    actionInitialValues.requestType = actionType;
    dispatch(
      donationPreferenceActions.operateActionRequest(actionInitialValues)
    );
  };
  const changeTab = (activeKey) => {
    setTabType(activeKey);
  };
  const handleCheck = () => {
    setChecked(true);
    setOpen(false);
    updateDonationPreference();
  };
  const closeCheck = () => {
    setChecked(false);
    setOpen(false);
  };
  const showConsent = (preference, type) => {
    setOpen(true);
    setSelectedPreference(preference);
    setUpdateType(type);
  };
  const setPage = (page) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    setTotalCount(preferences?.totalCount);
  }, [preferences?.totalCount]);
  const updateDonationPreference = () => {
    preferenceForm.employeePreferenceId =
      selectedPreference.employeePreferenceId;
    preferenceForm.type = updateType;
    if (updateType === donationPreferenceConstants.AMOUNT) {
      preferenceForm.donationAmount = updatedValue;
    }
    if (updateType === donationPreferenceConstants.FREQUENCY) {
      preferenceForm.frequency =
        updatedValue === donationPreferenceConstants.MONTHLY ? 1 : 2;
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
  const onHandleChange = (e) => {
    setSearchText("");
    setSelected(e.target.value);
  };
  const search = (value) => {
    setSearchText(value);
    setSelected(selected);
  };
  return (
    <div className="customContainer program-list">
      <div className="row mb-4">
        <div className="col-md-6">
          <h1 className="ant-typography customHeading">Donation Preference</h1>
        </div>
      </div>
      <div className="ant-row searchContainer mt-3 py-4 align-center">
        <div className="col-md d-flex pl-0">
          <div className="col-md-4">
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
                <option value="organizationName">Organization Name</option>
                <option value="amount">Amount</option>
              </select>
            </div>
          </div>
          {selected === "programName" && (
            <div className="col-md-4">
              <div>
                <div className="ant-input-affix-wrapper inputFilterInput">
                  <span className="ant-input-prefix">
                    <i className="bi bi-search"></i>
                    <input
                      type="text"
                      className="ant-input-search"
                      placeholder="Search by Program Name"
                      onChange={(e) => search(e.target.value, "programName")}
                    />
                  </span>
                </div>
              </div>
            </div>
          )}
          {selected === "organizationName" && (
            <div className="col-md-4">
              <div>
                <div className="ant-input-affix-wrapper inputFilterInput">
                  <span className="ant-input-prefix">
                    <i className="bi bi-search"></i>
                    <input
                      type="text"
                      // className="form-control"
                      className="ant-input-search"
                      placeholder="Search by Organization Name"
                      onChange={(e) =>
                        search(e.target.value, "organizationName")
                      }
                    />
                  </span>
                </div>
              </div>
            </div>
          )}
          {selected === "amount" && (
            <div className="col-md-4">
              <div>
                <div className="ant-input-affix-wrapper inputFilterInput">
                  <span className="ant-input-prefix">
                    <i className="bi bi-search"></i>
                    <input
                      type="text"
                      className="ant-input-search"
                      placeholder="Search by Amount"
                      onChange={(e) => search(e.target.value, "amount")}
                    />
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {preferences.loading && <Loader />}
      <div className="ant-tabs-nav-wrap">
        <Tabs
          defaultActiveKey={donationPreferenceConstants.ACTIVE}
          onChange={changeTab}
        >
          <TabPane
            tab={
              <span>
                <AuditOutlined className="fs-5" />
                {donationPreferenceConstants.ACTIVE} (
                {preferences?.items?.active
                  ? SearchDonationPreferenceHelper(
                      preferences?.items?.active,
                      searchText,
                      selected
                    ).length
                  : 0}
                )
              </span>
            }
            key={donationPreferenceConstants.ACTIVE}
          >
            <ListDonationPreferences
              tabType={tabType}
              items={
                searchText && tabType === donationPreferenceConstants.ACTIVE
                  ? SearchDonationPreferenceHelper(
                      preferences?.items?.active,
                      searchText,
                      selected
                    )
                  : preferences?.items?.active
              }
            />
          </TabPane>
          <TabPane
            tab={
              <span>
                <RedoOutlined className="fs-5" />
                {donationPreferenceConstants.COMPLETED} (
                {preferences?.items?.complete
                  ? SearchDonationPreferenceHelper(
                      preferences?.items?.complete,
                      searchText,
                      selected
                    ).length
                  : 0}
                )
              </span>
            }
            key={donationPreferenceConstants.COMPLETED}
          >
            <ListDonationPreferences
              tabType={tabType}
              items={
                searchText && tabType === donationPreferenceConstants.COMPLETED
                  ? SearchDonationPreferenceHelper(
                      preferences?.items?.complete,
                      searchText,
                      selected
                    )
                  : preferences?.items?.complete
              }
            />
          </TabPane>
        </Tabs>
      </div>
      <Pagination
        className="pagination-bar mt-4"
        currentPage={currentPage}
        totalCount={totalCount ? totalCount : 0}
        pageSize={pageSize}
        onPageChange={(page) => setPage(page)}
      />
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
    </div>
  );
};
export default EmployeeDonationPreferences;
