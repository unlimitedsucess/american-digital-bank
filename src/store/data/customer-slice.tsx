import { Card, CustomerSliceParams, Transaction } from "@/types/global";
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
    loan: "",
    loanBalance: "",
    expenses: "",
    initialDeposit: "",
    pin: "",
    passportUrl: "",
    driversLicence: "",
    emailVerified: false,
    transactionDate: "",
    updatedAt: "",
    __v: 0,
  },
  transactions: [],
  remainingTransferLimit: 500000,
  cards: [],
};

const customerSlice = createSlice({
  name: "customer",
  initialState: customerInitialState,
  reducers: {
    setCustomerData(state, action: PayloadAction<CustomerSliceParams>) {
      state.customerData = action.payload.customerData;
    },
    updateCustomerData(
      state,
      action: PayloadAction<Partial<CustomerSliceParams["customerData"]>>
    ) {
      state.customerData = { ...state.customerData, ...action.payload };
    },

    setCards(state, action: PayloadAction<Card[]>) {
      state.cards = action.payload;
    },

    setTransactions(state, action: PayloadAction<Transaction[]>) {
      state.transactions = action.payload;
    },

    setRemainingTransferLimit(state, action: PayloadAction<number>) {
      state.remainingTransferLimit = action.payload;
    },

    // ✅ New reducer for updating balance
    updateCustomerBalance(state, action: PayloadAction<number>) {
      const currentBalance = Number(state.customerData.initialDeposit) || 0;
      const newBalance = currentBalance - action.payload;
      state.customerData.initialDeposit = newBalance.toString();
    },

    clearCustomer() {
      return customerInitialState;
    },
  },
});

export const customerActions = customerSlice.actions;
export default customerSlice.reducer;
