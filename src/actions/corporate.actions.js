import { corporateConstants } from "../constants";
import { corporateService } from "../services";
import { alertActions } from "./";
import { history } from "../helpers";
export const corporateActions = {
  addCorporate,
  deleteCorporate,
  updateCorporate,
  registerCorporate,
  getCorporates,
  corporateAccountRequest,
  oidcConfigure,
};
function getCorporates() {
  return (dispatch) => {
    dispatch(request());
    corporateService.getCorporates().then(
      (corporates) => dispatch(success(corporates)),

      (error) => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    );
  };
  function request() {
    return { type: corporateConstants.GET_CORPORATES_REQUEST };
  }
  function success(corporates) {
    return { type: corporateConstants.GET_CORPORATES_SUCCESS, corporates };
  }
  function failure(error) {
    return { type: corporateConstants.GET_CORPORATES_FAILURE, error };
  }
}
function addCorporate(corporate, type) {
  return (dispatch) => {
    dispatch(request(corporate));
    corporateService.addCorporate(corporate).then(
      (res) => {
        dispatch(success(res));
        if (res?.data?.email) {
          dispatch(alertActions.error(res?.data?.email?.[0]));
        } else {
          history.push("/list-corporates");
          dispatch(alertActions.success("Corporate added successfully"));
        }
      },
      (error) => {
        dispatch(failure(error.toString()));
        // dispatch(alertActions.error(error.toString()));
      }
    );
  };
  function request(corporate) {
    return { type: corporateConstants.ADD_CORPORATE_REQUEST, corporate };
  }
  function success(corporate) {
    return { type: corporateConstants.ADD_CORPORATE_SUCCESS, corporate };
  }
  function failure(error) {
    return { type: corporateConstants.ADD_CORPORATE_FAILURE, error };
  }
}
function updateCorporate(corporate) {
  return (dispatch) => {
    dispatch(request(corporate));
    corporateService.updateCorporate(corporate).then(
      (corporate) => {
        dispatch(success(corporate));
        history.push("/list-corporates");
        dispatch(alertActions.success("Corporate Updated Successfully"));
      },
      (error) => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    );
  };
  function request(corporate) {
    return { type: corporateConstants.UPDATE_CORPORATE_REQUEST, corporate };
  }
  function success(corporate) {
    return {
      type: corporateConstants.UPDATE_CORPORATE_SUCCESS,
      corporate,
    };
  }
  function failure(error) {
    return { type: corporateConstants.UPDATE_CORPORATE_FAILURE, error };
  }
}
function deleteCorporate(corporateId) {
  return (dispatch) => {
    dispatch(request(corporateId));
    corporateService.deleteCorporate(corporateId).then(
      (corporateId) => {
        dispatch(success(corporateId));
        dispatch(alertActions.success("Corporate deleted successfully"));
      },
      (error) => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    );
  };
  function request(corporateId) {
    return { type: corporateConstants.DELETE_CORPORATE_REQUEST, corporateId };
  }
  function success(corporateId) {
    return { type: corporateConstants.DELETE_CORPORATE_SUCCESS, corporateId };
  }
  function failure(error) {
    return { type: corporateConstants.DELETE_CORPORATE_FAILURE, error };
  }
}
function registerCorporate(corporate, type) {
  return (dispatch) => {
    dispatch(request(corporate));
    corporateService.registerCorporate(corporate).then(
      (corporate) => {
        dispatch(success());
        if (type === "admin") {
          history.push("/corporates");
        } else {
          history.push("/login");
        }
        dispatch(
          alertActions.success(
            type === "admin"
              ? "Corporate added successfully"
              : "Corporate registered successfully"
          )
        );
      },
      (error) => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    );
  };
  function request(corporate) {
    return { type: corporateConstants.ADD_CORPORATE_REQUEST, corporate };
  }
  function success(corporate) {
    return { type: corporateConstants.ADD_CORPORATE_SUCCESS, corporate };
  }
  function failure(error) {
    return { type: corporateConstants.ADD_CORPORATE_FAILURE, error };
  }
}
function corporateAccountRequest(actionValues) {
  return (dispatch) => {
    dispatch(request(actionValues));
    corporateService.corporateAccountRequest(actionValues).then(
      (msg) => {
        dispatch(success(msg));
        dispatch(
          alertActions.success(
            `Corporate ${
              actionValues.requestType === "Inactivate"
                ? "inactivated"
                : actionValues.requestType.toLowerCase() + "d"
            } successfully`
          )
        );
      },
      (error) => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    );
  };
  function request(corporate) {
    return { type: corporateConstants.CORPORATE_ACTION_REQUEST, corporate };
  }
  function success(data) {
    return { type: corporateConstants.CORPORATE_ACTION_SUCCESS, data };
  }
  function failure(error) {
    return { type: corporateConstants.CORPORATE_ACTION_FAILURE, error };
  }
}

function oidcConfigure(oidcValues) {
  return (dispatch) => {
    dispatch(request(oidcValues));
    corporateService.oidcConfigure(oidcValues).then(
      (res) => {
        console.log(oidcValues, "oidc before sucesssss");

        dispatch(success(res));
        dispatch(alertActions.success("OIDC Configure saved successfully"));
      },
      (error) => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    );
  };
  function request(oidcValues) {
    return { type: corporateConstants.OIDC_CONFIGURE_REQUEST, oidcValues };
  }
  function success(oidcValues) {
    console.log(oidcValues, "oidc after sucesssss");

    return { type: corporateConstants.OIDC_CONFIGURE_SUCCESS, oidcValues };
  }
  function failure(error) {
    return { type: corporateConstants.OIDC_CONFIGURE_FAILURE, error };
  }
}
