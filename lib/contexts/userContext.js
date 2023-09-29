import { createContext, useContext, useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

const UserContext = createContext(null);
const UserDispatchContext = createContext(null);

export function UserProvider({ children }) {
  const [user, dispatch] = useReducer(userReducer, initialValues);

  // Load initial values from AsyncStorage
  useEffect(() => {
    const loadInitialValues = async () => {
      try {
        const tempFirstName = await AsyncStorage.getItem("tempFirstName");
        const tempLastName = await AsyncStorage.getItem("tempLastName");

        if (tempFirstName && tempLastName) {
          dispatch({ type: "SET_FIRST_NAME", payload: tempFirstName });
          dispatch({ type: "SET_LAST_NAME", payload: tempLastName });
        }
      } catch (error) {
        console.error("Error loading initial values from AsyncStorage:", error);
      }
    };

    loadInitialValues();
  }, []);

  return (
    <UserContext.Provider value={user}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

export function useUserDispatch() {
  return useContext(UserDispatchContext);
}

function userReducer(state, action) {
  switch (action.type) {
    case "SET_FIRST_NAME":
      return { ...state, first_name: action.payload };
    case "SET_LAST_NAME":
      return { ...state, last_name: action.payload };
    case "SET_ID_NUMBER":
      return { ...state, id_number: action.payload };
    case "SET_PHONE_NUMBER":
      return { ...state, phone_number: action.payload };
    case "RESET":
      return initialValues;
    default:
      return state;
  }
}

const initialValues = {
  first_name: "",
  last_name: "",
  id_number: "",
  phone_number: "",
};
