import React from "react";
import { Stack } from "expo-router";

import { Amplify } from "aws-amplify";
import awsconfig from "../src/aws-exports";
Amplify.configure(awsconfig);

// import { withAuthenticator } from "@aws-amplify/ui-react-native";

const RootLayout = () => {
  return <Stack />;
};

export default RootLayout;
// commented out withAuthenticator because it give empty screen
// export default withAuthenticator(RootLayout);
