import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import urlSlug from "url-slug";
import {
  socialOrganizationConstants,
  paginationConstants,
  charityProgramConstants,
  viewPortalConstants
} from "../../constants";
import { selectedOrganizationActions } from "../../actions";
import * as moment from "moment";
let pageSize = paginationConstants?.PAGE_SIZE;
let theArray = [];
const ListSocialOrganizations = ({ tabType, items }) => {
  console.log(items);
  const socialOrganizations = useSelector((state) => state.socialOrganizations);
  const currentPortal = useSelector((state) => state.currentView);
  const user = useSelector((state) => state.employee.user);
  const [open, setOpen] = useState(false);
  const [allChecked, setAllChecked] = useState(false);
  const [actionType, setActionType] = useState("");
  const [actionTitle, setActionTitle] = useState("");
  const [actionContent, setActionContent] = useState("");
  // Pagination
  // const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const isCorporatePortal =
    currentPortal?.currentView === viewPortalConstants.CORPORATE_PORTAL;

  const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(
  //     socialOrganizationActions.getSocialOrganizations({
  //       employeeId: isEmployeePortal ? user?.emp_id : null,
  //       corporateId: isCorporatePortal
  //         ? selectedCorporate?.corporate?.corporateId
  //         : null,
  //       pageSize: pageSize,
  //       offset: currentPage >= 2 ? currentPage * pageSize - pageSize : 0,
  //     })
  //   );
  // }, [currentPage]);
  // const setPage = (page) => {
  //   setCurrentPage(page);
  // };
  // useEffect(() => {
  //   setTotalCount(totalCount);
  // }, [totalCount]);
  const setOrganization = (organization) => {
    dispatch(selectedOrganizationActions.selectedOrganization(organization));
  };
  const renderClass = (param) => {
    switch (param) {
      case socialOrganizationConstants.APPROVED:
        return "text-success";
      case socialOrganizationConstants.REJECTED:
        return "text-danger";
      case socialOrganizationConstants.PENDING:
        return "text-warning";
      default:
        return "text-warning";
    }
  };
  const handleOpen = (action, item) => {
    setOpen(true);
    setActionType(action);
    setActionTitle(`${action} Confirmation`);
    if (action === charityProgramConstants.UNPROMOTE) {
      setActionContent(
        `Are you sure you want to unpromote?. Doing this would remove all the donation preferences set for the programs by the employees. Total 15 employees have set donation preference for the programs.`
      );
    } else {
      setActionContent(`Are you sure to ${action.toLowerCase()}?`);
    }
  };
  const handleChange = (id) => {
    // let items = socialOrganizations?.items;
    // if (e.target.value === "checkAll") {
    //   items.forEach((item) => {
    //     item.isChecked = e.target.checked;
    //     allChecked = e.target.checked;
    //   });
    // } else {
    //   items.find((item) => item.name === e.target.name).isChecked =
    //     e.target.checked;
    // }
    const index = theArray.indexOf(id);
    if (index !== -1) {
      theArray.splice(index, 1);
    } else {
      theArray.push(id);
    }
    // setState({items:items, allChecked: allChecked});
  };
  return (
    <div className="customContainer">
      <div className="ant-row">
        <div className="ant-col ant-col-24 mt-2">
          <div className="ant-table-wrapper">
            <div className="ant-table">
              <table>
                <thead className="ant-table-thead">
                  <tr>
                    {/* <th className="ant-table-cell">
                      <input
                        type="checkbox"
                        value="checkAll"
                        checked={allChecked}
                        onChange={() => handleChange('checkAll')}
                      />
                    </th> */}
                    <th className="ant-table-cell">SR NO.</th>
                    <th className="ant-table-cell">Name</th>
                    {/* <th className="ant-table-cell text-center">
                      Total Programs
                    </th> */}
                    <th className="ant-table-cell">Created On</th>
                    {/* <th className="ant-table-cell">Status</th> */}
                    {/* <th className="ant-table-cell text-center">&nbsp;</th> */}
                  </tr>
                </thead>
                <tbody className="ant-table-tbody">
                  {items?.length > 0 ? (
                    items.map((socialOrganization, index) => (
                      <tr
                        key={index + 1}
                        className="ant-table-row ant-table-row-level-0"
                      >
                        {/* <td className="ant-table-cell">
                            <input
                              type="checkbox"
                              value={index + 1}
                              name={index + 1}
                              checked={
                                theArray?.indexOf(socialOrganization?.id) !== -1 ? true : false
                              }
                              onChange={() =>
                                handleChange(socialOrganization?.id)
                              }
                            />
                          </td> */}
                        <td className="ant-table-cell">{index + 1}</td>
                        <td className="ant-table-cell">
                          <span className="ant-typography font-weight-bold">
                            <Link
                              to={{
                                pathname: `/social-organizations/${urlSlug(
                                  socialOrganization?.name
                                )}`,
                                tabType: tabType
                              }}
                              onClick={() =>
                                setOrganization(socialOrganization)
                              }
                            >
                              <span className="custom-color">
                                {socialOrganization?.name}
                              </span>
                            </Link>
                          </span>
                        </td>
                        {/* <td className="ant-table-cell text-center">
                          {socialOrganization?.total_program}
                        </td> */}
                        <td className="ant-table-cell">
                          {moment(socialOrganization?.created_date).format(
                            "LL"
                          )}
                        </td>
                        {/* <td className="ant-table-cell text-center">
                            <Tooltip title={charityProgramConstants.UNPROMOTED}>
                              <i className="bi-heart fs-6 custom-color"></i>
                            </Tooltip>
                          </td> */}
                        {/* <td className="ant-table-cell">
                          <span
                            className={renderClass(
                              socialOrganization?.approvalStatus
                            )}
                          >
                            {socialOrganization?.approvalStatus}
                          </span>
                        </td> */}
                        {/* <td className="ant-table-cell text-center">
                          <Link>
                            <span
                              className="bi-check-circle fs-5"
                              title="Confirm"
                            ></span>
                          </Link>
                        </td> */}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No organizations found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* <Pagination
              className="pagination-bar mt-4"
              currentPage={currentPage}
              totalCount={totalCount ? totalCount : 0}
              pageSize={pageSize}
              onPageChange={(page) => setPage(page)}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ListSocialOrganizations;
