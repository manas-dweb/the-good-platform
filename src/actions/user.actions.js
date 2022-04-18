import { userConstants } from "../constants";
import { userService } from "../services";
import { alertActions } from "./alert.actions";
import { history } from "../helpers";
import { useHistory } from "react-router-dom";

export const userActions = {
  login,
  logout,
  register,
  getAll,
  delete: _delete,
  getById,
};

function login(data, from) {
  return (dispatch) => {
    dispatch(request({ data }));

    userService.login(data).then(
      (data) => {
        dispatch(success(data));
        localStorage.setItem("user", JSON.stringify(data.data));
        history.push("/dashboard");
        dispatch(alertActions.success("Loggedin successful"));
      },
      (error) => {
        dispatch(failure(error.toString()));
        dispatch(
          alertActions.error(
            error.toString() === "Error: Request failed with status code 404"
              ? "Email or Password is not valid"
              : error.toString()
          )
        );
      }
    );
  };

  function request(data) {
    return { type: userConstants.LOGIN_REQUEST, data };
  }
  function success(data) {
    return { type: userConstants.LOGIN_SUCCESS, data };
  }
  function failure(error) {
    return { type: userConstants.LOGIN_FAILURE, error };
  }
}

function logout() {
  userService.logout();
  return { type: userConstants.LOGOUT };
}

function register(user) {
  return (dispatch) => {
    dispatch(request(user));

    userService.register(user).then(
      (user) => {
        dispatch(success());
        history.push("/login");
        dispatch(alertActions.success("Registration successful"));
      },
      (error) => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    );
  };

  function request(user) {
    return { type: userConstants.REGISTER_REQUEST, user };
  }
  function success(user) {
    return { type: userConstants.REGISTER_SUCCESS, user };
  }
  function failure(error) {
    return { type: userConstants.REGISTER_FAILURE, error };
  }
}

function getAll() {
  return (dispatch) => {
    dispatch(request());

    userService.getAll().then(
      (users) => dispatch(success(users)),
      (error) => dispatch(failure(error.toString()))
    );
  };

  function request() {
    return { type: userConstants.GETALL_REQUEST };
  }
  function success(users) {
    return { type: userConstants.GETALL_SUCCESS, users };
  }
  function failure(error) {
    return { type: userConstants.GETALL_FAILURE, error };
  }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
  return (dispatch) => {
    dispatch(request(id));

    userService.delete(id).then(
      (user) => dispatch(success(id)),
      (error) => dispatch(failure(id, error.toString()))
    );
  };

  function request(id) {
    return { type: userConstants.DELETE_REQUEST, id };
  }
  function success(id) {
    return { type: userConstants.DELETE_SUCCESS, id };
  }
  function failure(id, error) {
    return { type: userConstants.DELETE_FAILURE, id, error };
  }
}
// prefixed function name with underscore because delete is a reserved word in javascript
function getById(id) {
  return (dispatch) => {
    dispatch(request(id));

    userService.getById(id).then(
      (user) => dispatch(success(id)),
      (error) => dispatch(failure(id, error.toString()))
    );
  };

  function request(id) {
    return { type: userConstants.GET_PROFILE_REQUEST, id };
  }
  function success(id) {
    return { type: userConstants.GET_PROFILE_SUCCESS, id };
  }
  function failure(id, error) {
    return { type: userConstants.GET_PROFILE_FAILURE, id, error };
  }
}
