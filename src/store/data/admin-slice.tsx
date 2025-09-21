import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdminState, Transaction } from "@/types/global";

const initialState: AdminState = {
  users: [],
  transactions: [],
  loans: [],
  cards: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdminData: (
      state,
      action: PayloadAction<{
        users?: any[];
        transactions?: any[];
        loans?: any[];
        cards?: any[];
      }>
    ) => {
      state.users = action.payload.users || [];
      state.transactions = action.payload.transactions || [];
      state.loans = action.payload.loans || [];
      state.cards = action.payload.cards || [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      state.transactions = state.transactions.filter(
        (t) => t.id !== action.payload
      );
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((u) => u._id !== action.payload);
    },
    updateUser: (state, action: PayloadAction<any>) => {
      state.users = state.users.map((u) =>
        u._id === action.payload._id ? action.payload : u
      );
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.push(action.payload);
    },

    // 🔹 NEW REDUCER for loan status update
    updateLoanStatus: (
      state,
      action: PayloadAction<{ id: string; status: string }>
    ) => {
      state.loans = state.loans.map((loan) =>
        loan._id === action.payload.id
          ? { ...loan, status: action.payload.status }
          : loan
      );
    },
  },
});

export const {
  setAdminData,
  setLoading,
  setError,
  deleteTransaction,
  updateUser,
  deleteUser,
  addTransaction,
  updateLoanStatus, // ✅ export it
} = adminSlice.actions;

export default adminSlice.reducer;
