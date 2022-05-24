import { charityProgramConstants } from "../constants";

export function charityPrograms(state = {}, action) {
  switch (action.type) {
    case charityProgramConstants.GET_CHARITY_PROGRAMS_REQUEST:
      return {
        loading: true,
      };
    case charityProgramConstants.GET_CHARITY_PROGRAMS_SUCCESS:
      return {
        items: action?.charityPrograms?.data?.charity_list,
      };
    case charityProgramConstants.GET_CHARITY_PROGRAMS_FAILURE:
      return {
        error: action.error,
      };
    case charityProgramConstants.SAVE_DONATION_PREFERENCE_REQUEST:
      return {
        ...state,
        loading: true,
        charityId: action?.data?.charityProgramId,
      };
    case charityProgramConstants.SAVE_DONATION_PREFERENCE_SUCCESS:
      return {
        ...state,
        items: {
          sponser: state?.items["sponser"]?.map((charity) =>
            charity.charityId === state.charityId
              ? { ...charity, donated: true }
              : charity
          ),
          other: state?.items["other"]?.map((charity) =>
            charity.charityId === state.charityId
              ? { ...charity, donated: true }
              : charity
          ),
        },
        loading: false,
      };
    case charityProgramConstants.SAVE_DONATION_PREFERENCE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case charityProgramConstants.OPERATE_SPONSOR_REQUEST:
      return {
        ...state,
        loading: true,
        programId: action?.program?.charityId,
      };
    case charityProgramConstants.OPERATE_SPONSOR_SUCCESS:
      const operateCharity = state?.items["other"]?.filter(
        (element) => element.charityId === state.programId
      );
      return {
        ...state,
        items: {
          sponser: [...state?.items["sponser"], operateCharity[0]],
          other: state?.items["other"]?.filter(function (charity) {
            return charity.charityId !== operateCharity[0]?.charityId;
          }),
        },
        loading: false,
      };
    case charityProgramConstants.OPERATE_SPONSOR_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case charityProgramConstants.OPERATE_DENY_REQUEST:
      return {
        ...state,
        loading: true,
        programId: action?.program?.programId,
      };
    case charityProgramConstants.OPERATE_DENY_SUCCESS:
      const denyCharity = state.items["sponser"].filter(
        (element) => element.charityId === state.programId
      );
      return {
        ...state,
        items: {
          other: [...state.items["other"], denyCharity[0]],
          sponser: state.items["sponser"].filter(function (charity) {
            return charity.charityId !== denyCharity[0]?.charityId;
          }),
        },
        loading: false,
      };
    case charityProgramConstants.OPERATE_DENY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };   
    default:
      return state;
  }
}
