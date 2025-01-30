import ApiContext from "@/features/shared/services/api-context";
import { useEffect, useMemo, useState } from "react";

export const useLogin = () => {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [submitClicked, setSubmitClicked] = useState(false);

  const [key, setKey] = useState<File | undefined>(undefined);
  const [keyError, setKeyError] = useState("");

  const [isRequesting, setIsRequesting] = useState(false);
  const [response, setResponse] = useState<undefined>(undefined);

  const isPasswordValid = useMemo(() => !!password, [password]);
  useEffect(() => {
    if (isPasswordValid) {
      setPasswordError("");
    } else {
      setPasswordError("Please enter your password.");
    }
  }, [isPasswordValid, password]);

  const isKeyValid = useMemo(() => !!key, [key]);
  useEffect(() => {
    if (isKeyValid) {
      setKeyError("");
    } else {
      setKeyError("Please attach your key.");
    }
  }, [isKeyValid, key]);

  const onLoginClick = () => {
    setSubmitClicked(true);

    if (!isRequesting && isPasswordValid && isKeyValid) {
      setResponse(undefined);
      setIsRequesting(true);
      new ApiContext()
        .identity()
        .getService("login")
        .postForm({
          password: password,
          keyFile: key,
        })
        .then((response) => {
          if (response.data) {
            setResponse(response.data);
          }
        })
        .finally(() => setIsRequesting(false));
    }
  };

  return {
    setPassword,
    setKey,
    onLoginClick,
    passwordError,
    keyError,
    isRequesting,
    submitClicked,
    response,
  };
};
