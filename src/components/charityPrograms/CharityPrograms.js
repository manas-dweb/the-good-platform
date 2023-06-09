import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Donate from "./Donate";
import "./../../assets/css/charityProgramsList.scss";
import {
  donationPreferenceConstants,
  viewPortalConstants,
  charityProgramConstants,
  payrollConstants,
  userConstants
} from "../../constants";
import { charityProgramActions, selectedCharityActions } from "../../actions";
import ListCharityPrograms from "./ListCharityPrograms";
import CardCharityPrograms from "./CardCharityPrograms";
import { Tabs, Icon } from "antd";
import { AuditOutlined, RedoOutlined } from "@ant-design/icons";
import DonateHeader from "./DonateHeader";
import { SearchCharityHelper, SearchHelper } from "../../helpers";
const TabPane = Tabs.TabPane;
const CharityPrograms = (props) => {
  let history = useHistory();
  const charityPrograms = useSelector((state) => state.charityPrograms);

  const selectedOrganizationId = useSelector(
    (state) => state?.selectedOrganization?.organization?.id
  );
  const [selectedCharity, setSelectedCharity] = useState();
  const [tabType, setTabType] = useState(charityProgramConstants.SPONSOR);
  const user = useSelector((state) => state.employee.user);
  const otherUser = useSelector((state) => state.user);
  const currentPortal = useSelector((state) => state.currentView);
  const selectedCorporate = useSelector((state) => state.selectedCorporate);
  const [searchText, setSearchText] = useState("");
  const selectedOrganization = useSelector(
    (state) => state.selectedOrganization?.organization
  );
  const [currentView, setCurrentView] = useState(
    charityProgramConstants.LIST_VIEW
  );
  const [selectedCategory, setSelectedCategory] = useState(
    charityProgramConstants.ALL_CATEGORY
  );
  const dispatch = useDispatch();
  const isOthersPortal =
    currentPortal?.currentView === viewPortalConstants.OTHERS_PORTAL;
  const isCorporatePortal = user?.user_type === userConstants.CORPORATE;
  const isIndividualPortal = user?.user_type === userConstants.INDIVIDUAL;
  const isSocialOrganizationPortal =
    currentPortal?.currentView ===
    viewPortalConstants.SOCIAL_ORGANIZATION_PORTAL;
  const openNav = () => {
    document.getElementById("sidepanel").classList.add("is-open");
  };
  const closeNav = () => {
    document.getElementById("sidepanel").classList.remove("is-open");
  };
  useEffect(() => {
    dispatch(
      charityProgramActions.getCharityPrograms(
        isOthersPortal
          ? {
              corporateId: selectedCorporate?.corporate?.id,
              orgId: selectedOrganization?.id,
              userType: userConstants.CORPORATE_VIEW,
              userId: user?.user_id,
              userRole: otherUser?.detail?.userRole
              // corporateId: selectedCorporate?.corporate?.corporateId,
              // socialId: selectedOrganization?.id,
              // userType: userConstants.CORPORATE_VIEW,
            }
          : isIndividualPortal || isSocialOrganizationPortal
          ? {
              userType: userConstants.INDIVIDUAL_VIEW,
              // uuid: user?.uuid,
              // socialId: selectedOrganization?.id,
              orgId: selectedOrganization?.id
            }
          : {
              // uuid: user?.uuid,
              // *** comment for remote program *** userId: user?.user_id,
              // orgId: selectedOrganization?.id,
              // *** comment for remote program *** userType: isCorporatePortal
              // *** comment for remote program *** ? userConstants.CORPORATE_VIEW
              // *** comment for remote program *** : userConstants.EMPLOYEE_VIEW,
              // *** comment for remote program *** corporateId: isCorporatePortal
              // *** comment for remote program *** ? selectedCorporate?.corporate?.id
              // *** comment for remote program *** : user?.corporateId
              // ? selectedCorporate?.corporate?.corporateId
              // : user?.corporateId,
              orgId: selectedOrganization?.id,
              userId: user?.user_id,
              userType: isCorporatePortal
                ? userConstants.CORPORATE_VIEW
                : userConstants.EMPLOYEE_VIEW
            }
      )
    );
  }, []);
  const setCharity = (charity) => {
    setSelectedCharity(charity);
    if (charity) {
      dispatch(selectedCharityActions.selectedCharity(charity));
    }
    openNav();
  };
  const setType = (type) => {
    setTabType(type);
    closeNav();
  };
  const changeTab = (activeKey) => {
    closeNav();
    setTabType(activeKey);
  };
  if (charityPrograms.loading) {
    document.getElementById("root").classList.add("loading");
  } else {
    document.getElementById("root").classList.remove("loading");
  }
  const search = (value) => {
    setSearchText(value);
    // if(tabType === socialOrganizationConstants.SPONSORED){
    //   socialOrganizations?.items?.sponsored.filter((sponsor) => sponsor?.name.includes(value))
    //
    // }
  };
  return (
    <div className="customContainer program-list">
      <div className="row mb-4">
        <div className="col-md-12">
          <h1 className="ant-typography customHeading">
            {isSocialOrganizationPortal
              ? selectedOrganization?.name
              : "Social Organizations"}
            /Charity Programs
          </h1>
        </div>
      </div>
      {!isSocialOrganizationPortal && (
        <div className="row mb-4">
          <div className="col-md-12 text-right">
            <button
              type="button"
              className={`${
                currentView === charityProgramConstants.LIST_VIEW
                  ? "active"
                  : ""
              } btn btn-sm btn-outline-primary btn-outline-custom mr-3`}
              onClick={() => setCurrentView(charityProgramConstants.LIST_VIEW)}
            >
              <i className="bi bi-grid-3x3-gap"></i> List View
            </button>
            <button
              type="button"
              className={`${
                currentView === charityProgramConstants.PROGRESS_VIEW
                  ? "active"
                  : ""
              } btn btn-sm  btn-outline-primary btn-outline-custom`}
              onClick={() =>
                setCurrentView(charityProgramConstants.PROGRESS_VIEW)
              }
            >
              <i className="bi bi-card-heading"></i> Progress view
            </button>
          </div>
        </div>
      )}
      <div className="ant-row searchContainer mt-3 py-4 px-4 align-center">
        <div className="ant-col ant-col-24  searchContainer">
          <div className="ant-col ant-col-8">
            <div className="ant-input-affix-wrapper inputFilterInput">
              <span className="ant-input-prefix">
                <i className="bi bi-search"></i>
                <input
                  placeholder="Search by Program Name"
                  className="ant-input-search"
                  type="text"
                  onChange={(e) => search(e.target.value)}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
      {!isSocialOrganizationPortal && (
        <>
          <div className="mt-4 mb-2">
            <h5>Categories</h5>
          </div>
          <div className="row mb-4">
            <div className="col">
              <div
                className={`categotyButton pl-0`}
                onClick={() =>
                  setSelectedCategory(charityProgramConstants.ALL_CATEGORY)
                }
              >
                <label
                  className={`${
                    selectedCategory === charityProgramConstants.ALL_CATEGORY
                      ? "active"
                      : ""
                  } ant-radio-button-wrapper ant-radio-button-wrapper-checked purposePreview`}
                >
                  <span>
                    <span className="bi-border-all"></span>{" "}
                    {charityProgramConstants.ALL_CATEGORY}
                  </span>
                </label>
              </div>
            </div>
            <div className="col">
              <div
                className={`categotyButton`}
                onClick={() =>
                  setSelectedCategory(charityProgramConstants.WOMEN_CATEGORY)
                }
              >
                <label
                  className={`${
                    selectedCategory === charityProgramConstants.WOMEN_CATEGORY
                      ? "active"
                      : ""
                  } ant-radio-button-wrapper ant-radio-button-wrapper-checked purposePreview`}
                >
                  <span>
                    <img src="/assets/img/women.png" alt="Women" />{" "}
                    {charityProgramConstants.WOMEN_CATEGORY}
                  </span>
                </label>
              </div>
            </div>
            <div className="col">
              <div
                className={`categotyButton`}
                onClick={() =>
                  setSelectedCategory(charityProgramConstants.YOUTH_CATEGORY)
                }
              >
                <label
                  className={`${
                    selectedCategory === charityProgramConstants.YOUTH_CATEGORY
                      ? "active"
                      : ""
                  } ant-radio-button-wrapper ant-radio-button-wrapper-checked purposePreview`}
                >
                  <span>
                    <img src="/assets/img/youth.png" alt="Youth" />{" "}
                    {charityProgramConstants.YOUTH_CATEGORY}
                  </span>
                </label>
              </div>
            </div>
            <div className="col">
              <div
                className={`categotyButton`}
                onClick={() =>
                  setSelectedCategory(charityProgramConstants.ELDERLY_CATEGORY)
                }
              >
                <label
                  className={`${
                    selectedCategory ===
                    charityProgramConstants.ELDERLY_CATEGORY
                      ? "active"
                      : ""
                  } ant-radio-button-wrapper ant-radio-button-wrapper-checked purposePreview`}
                >
                  <span>
                    <img src="/assets/img/elderly.png" alt="Elderly" />{" "}
                    {charityProgramConstants.ELDERLY_CATEGORY}
                  </span>
                </label>
              </div>
            </div>
            <div className="col">
              <div
                className={`categotyButton`}
                onClick={() =>
                  setSelectedCategory(charityProgramConstants.CHILDREN_CATEGORY)
                }
              >
                <label
                  className={`${
                    selectedCategory ===
                    charityProgramConstants.CHILDREN_CATEGORY
                      ? "active"
                      : ""
                  } ant-radio-button-wrapper ant-radio-button-wrapper-checked purposePreview`}
                >
                  <span>
                    <img src="/assets/img/children.png" alt="Children" />{" "}
                    {charityProgramConstants.CHILDREN_CATEGORY}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="ant-tabs-nav-wrap">
        {currentPortal?.currentView === "Individual Portal" ||
        currentPortal?.currentView === "Others Portal" ||
        isSocialOrganizationPortal ? (
          <>
            {currentView === charityProgramConstants.LIST_VIEW && (
              <ListCharityPrograms
                items={charityPrograms?.items}
                setCharity={setCharity}
                tabType={tabType}
                pathname={selectedOrganization?.name}
              />
            )}
            {currentView === charityProgramConstants.PROGRESS_VIEW && (
              <CardCharityPrograms
                items={charityPrograms?.items}
                setCharity={setCharity}
                tabType={tabType}
                pathname={selectedOrganization?.name}
              />
            )}
          </>
        ) : (
          <>
            <Tabs
              defaultActiveKey={charityProgramConstants.SPONSORED}
              onChange={changeTab}
            >
              <TabPane
                tab={
                  <span>
                    <AuditOutlined className="fs-5" />
                    {charityProgramConstants.SPONSORED} (
                    {charityPrograms?.items?.sponsored
                      ? SearchCharityHelper(
                          charityPrograms?.items?.sponsored,
                          searchText
                        ).length
                      : 0}
                    )
                  </span>
                }
                key={charityProgramConstants.SPONSOR}
              >
                {currentView === charityProgramConstants.LIST_VIEW && (
                  <ListCharityPrograms
                    items={
                      searchText && tabType === charityProgramConstants.SPONSOR
                        ? SearchCharityHelper(
                            charityPrograms?.items?.sponsored,
                            searchText
                          )
                        : charityPrograms?.items?.sponsored
                    }
                    setCharity={setCharity}
                    tabType={tabType}
                  />
                )}
                {currentView === charityProgramConstants.PROGRESS_VIEW && (
                  <CardCharityPrograms
                    items={
                      searchText && tabType === charityProgramConstants.SPONSOR
                        ? SearchCharityHelper(
                            charityPrograms?.items?.sponsored,
                            searchText
                          )
                        : charityPrograms?.items?.sponsored
                    }
                    setCharity={setCharity}
                    tabType={tabType}
                  />
                )}
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <RedoOutlined className="fs-5" />
                    {charityProgramConstants.OTHERS} (
                    {charityPrograms?.items?.others
                      ? SearchCharityHelper(
                          charityPrograms?.items?.others,
                          searchText
                        ).length
                      : 0}
                    )
                  </span>
                }
                key={charityProgramConstants.OTHERS}
              >
                {currentView === charityProgramConstants.LIST_VIEW && (
                  <ListCharityPrograms
                    items={
                      searchText && tabType === charityProgramConstants.OTHERS
                        ? SearchCharityHelper(
                            charityPrograms?.items?.others,
                            searchText
                          )
                        : charityPrograms?.items?.others
                    }
                    setCharity={setCharity}
                    tabType={tabType}
                  />
                )}
                {currentView === charityProgramConstants.PROGRESS_VIEW && (
                  <CardCharityPrograms
                    items={
                      searchText && tabType === charityProgramConstants.OTHERS
                        ? SearchCharityHelper(
                            charityPrograms?.items?.others,
                            searchText
                          )
                        : charityPrograms?.items?.others
                    }
                    setCharity={setCharity}
                    tabType={tabType}
                  />
                )}
              </TabPane>
            </Tabs>
          </>
        )}
      </div>
      {
        <div id="sidepanel" className="sidepanel">
          <DonateHeader selectedCharity={selectedCharity} />
          <div className="tab-content pt-2">
            <div className="tab-pane fade show active give-once" id="give-once">
              <Donate
                frequency={donationPreferenceConstants.ONCE}
                selectedCharity={selectedCharity}
                tabType={tabType}
                customProgram={selectedCharity?.approved}
              />
            </div>
            <div className="tab-pane fade show give-monthly" id="give-monthly">
              <Donate
                frequency={donationPreferenceConstants.MONTHLY}
                selectedCharity={selectedCharity}
                tabType={tabType}
                customProgram={selectedCharity?.approved}
              />
            </div>
          </div>
        </div>
      }
    </div>
  );
};
export default CharityPrograms;
