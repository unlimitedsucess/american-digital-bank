import { CustomerSliceParams } from "@/types/global";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Initial state
const customerInitialState: CustomerSliceParams = {
  customerData: {
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    accountNumber: "",
    address: "",
    country: "",
    state: "",
    city: "",
    accountType: "",
    userName: "",
    phoneNo: "",
    loan : "",
    loanBalance: "",
    expenses: "",
    initialDeposit: "",
    pin: "",
    passportUrl: "",
    driversLicence: "",
    emailVerified: false,
    createdAt: "",
    updatedAt: "",
    __v: 0,
  },

};

const customerSlice = createSlice({
  name: "customer",
  initialState: customerInitialState,
  reducers: {
    // ✅ Update entire customer object
    setCustomerData(state, action: PayloadAction<CustomerSliceParams>) {
      state.customerData = action.payload.customerData;
      
    },

    // ✅ Update only customerData (partial update)
    updateCustomerData(
      state,
      action: PayloadAction<Partial<CustomerSliceParams["customerData"]>>
    ) {
      state.customerData = { ...state.customerData, ...action.payload };
    },

 
  

    // ✅ Clear customer state (on logout, etc.)
    clearCustomer() {
      return customerInitialState;
    },
  },
});

export const customerActions = customerSlice.actions;
export default customerSlice.reducer;
