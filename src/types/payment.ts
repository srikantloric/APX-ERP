import firebase from "../firebase";

export type IPaymentStatus = "UNPAID" | "PARTIAL" | "PAID";
export interface IChallanHeaderType {
  headerTitle: string;
  amount: number;
  amountPaid: number;
  amountPaidTotal: number;
  amountDue: number;
}
export interface IChallanHeaderTypeForChallan {
  headerTitle: string;
  amount: number;
  amountPaidTotal: number;
  amountDue: number;
}
export interface IPaymentNL {
  challanId: string;
  paymentId: string;
  studentId: string;
  challanTitle: string;
  amountPaid: number;
  breakdown: IChallanHeaderType[];
  recievedOn: firebase.firestore.Timestamp;
  recievedBy: string;
  status: IPaymentStatus;
  feeConsession: number;
  timestamp: firebase.firestore.Timestamp;
}
export interface IPaymentNLForChallan {
  challanId: string;
  paymentId: string;
  studentId: string;
  challanTitle: string;
  amountPaid: number;
  breakdown: IChallanHeaderTypeForChallan[];
  recievedOn: firebase.firestore.Timestamp;
  recievedBy: string;
  status: IPaymentStatus;
  feeConsession: number;
  timestamp: firebase.firestore.Timestamp;
}

export interface IChallanNL {
  studentId: string;
  challanId: string;
  challanTitle: string;
  feeHeaders: IChallanHeaderTypeForChallan[];
  totalAmount: number;
  amountPaid: number;
  status: "UNPAID" | "PARTIAL" | "PAID";
  createdBy: string;
  createdOn: firebase.firestore.Timestamp;
  feeDiscount: number;
  dueDate: firebase.firestore.Timestamp;
  feeConsession: number;
  totalDue?: number;
}

// export interface IChallanFlattenNL {
//   studentId: string;
//   challanId: string;
//   challanTitle: string;
//   totalAmount: number;
//   amountPaid: number;
//   status: "UNPAID" | "PARTIAL" | "PAID";
//   createdBy: string;
//   createdOn: firebase.firestore.Timestamp;
//   feeDiscount: number;
//   dueDate: firebase.firestore.Timestamp;
//   lateFine: number;
//   feeConsession: number;
//   totalDue?: number;
//   [key: string]: any; // For dynamic keys from feeHeaders
// }
