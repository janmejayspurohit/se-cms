import React from "react";
import { Button as ChakraButton } from "@chakra-ui/react";

const Button = (props) => {
  return (
    <ChakraButton colorScheme={props.colorScheme} {...props}>
      {props.children}
    </ChakraButton>
  );
};

Button.defaultProps = {
  colorScheme: "teal",
  color: "white",
  borderRadius: "0.5em",
};

export default Button;
