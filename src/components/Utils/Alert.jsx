import React from 'react'
import Swal from "sweetalert2";

export const Alert = (message) => {
  Swal.fire({
   position: "center",
   icon: "success",
    title: message,
    showConfirmButton: false,
 timer: 1500,
    });             
  
}

export const Alert2 = (message) => {
   Swal.fire({
    position: "center",
    icon: "failed",
     title: message,
     showConfirmButton: false,
  timer: 1500,
     });             
   
 }

