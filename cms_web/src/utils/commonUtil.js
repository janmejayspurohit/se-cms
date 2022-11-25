import swal from "sweetalert2";

export const indianCurrencyText = (amount = "0") =>
  Number(amount).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });

export const roundDecimal = (number = 0) => {
  return Math.round(number * 100) / 100;
};

export const optionsMap = (options) => options.map((o) => ({ label: o, value: o }));

export const alert = (props) => {
  return swal.fire({
    customClass: {
      confirmButton: "swal2-confirm",
      cancelButton: "swal2-cancel",
    },
    title: "Saved!",
    text: "",
    icon: "success",
    confirmButtonColor: "#065BAA",
    confirmButtonText: "Okay",
    ...props,
  });
};
