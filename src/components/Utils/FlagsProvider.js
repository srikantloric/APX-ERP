import React, { useEffect } from "react";
import firebase from "../../firebase";

const FlagsContext = React.createContext({});
const rConfig = firebase.remoteConfig();
// Only for development
rConfig.settings = {
  minimumFetchIntervalMillis: 3600000,
};
const FlagsProvider = ({ defaults, children }) => {
  const [flags, setFlags] = React.useState(defaults);
  // Next part...
  useEffect(() => {
    rConfig.defaultConfig = defaults;

    // rConfig.fetchAndActivate().then(() => {
    //   const val = rConfig.getValue('feePaymentEnabled')
    //   console.log(val)
    // })

    // rConfig
    //   .fetchAndActivate()
    //   .then((activated) => {
    //     if (!activated) console.log("not activated");
    //     return rConfig.getAll();
    //   })
    //   .then((remoteFlags) => {
    //     console.log(remoteFlags);
    //     const newFlags = {
    //       ...flags,
    //     };
    //     // for (const [key, config] of Object.entries(remoteFlags)) {
    //     //   const appVer = process.env.REACT_APP_VERSION;
    //     //   newFlags[key] = semverSatisfies(appVer, config.asString());
    //     // }
    //     setFlags(newFlags);
    //   })
    //   .catch((error) => console.error(error));
  }, []);

  return (
    <FlagsContext.Provider value={flags}>{children}</FlagsContext.Provider>
  );
};

export const useFlags = () => {
  const context = React.useContext(FlagsContext);
  return context;
};

export default FlagsProvider;
