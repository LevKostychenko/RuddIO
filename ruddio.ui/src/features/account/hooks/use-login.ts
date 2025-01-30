import ApiContext from "@/features/shared/services/api-context";
import { signOut, tokenReceived } from "@/features/shared/store/auth";
import { ITokenInfo } from "@/features/shared/types";
import { saveAuthorizationInfo } from "@/features/shared/utils";
import { AxiosResponse } from "axios";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

export const useLogin = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

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
            handleSignInResponse(response);
          }
        })
        .finally(() => setIsRequesting(false));
    }
  };

  const handleSignInResponse = (resp: AxiosResponse<ITokenInfo, any>) => {
    if (resp.data && resp.status >= 200 && resp.status < 400) {
      saveAuthorizationInfo(resp.data);
      dispatch(tokenReceived(resp.data));

      if (location.state) {
        navigate(-1);
      } else {
        navigate("/");
      }
    } else {
      dispatch(signOut());
      // TODO: something went wrong
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
