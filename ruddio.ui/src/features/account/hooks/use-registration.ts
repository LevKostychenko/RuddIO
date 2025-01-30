import ApiContext from "@/features/shared/services/api-context";
import { useEffect, useMemo, useState } from "react";
import { RegisterResponse } from "../types";

export const useAuthentication = () => {
  const [password, setPassword] = useState("");
  const [passPhrase, setPassPhrase] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [username, setUsername] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [repeatPasswordError, setRepeatPasswordError] = useState("");
  const [passPhraseError, setPassPhraseError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [submitClicked, setSubmitClicked] = useState(false);

  const [isRequesting, setIsRequesting] = useState(false);
  const [response, setResponse] = useState<RegisterResponse | undefined>(
    undefined
  );

  const usernameRules = [/^[a-zA-Z0-9]+$/, /^.{2,16}$/];
  const passwordRules = [/^.{8,}$/, /[A-Za-z]/, /\d/, /[^\w\s]/];
  const passphraseRules = [/^.{12,64}$/];

  const validate = (value: string, rules: RegExp[]) => {
    for (const rule of rules) {
      if (!rule.test(value)) {
        return false;
      }
    }
    return true;
  };

  const isPasswordValid = useMemo(
    () => validate(password, passwordRules),
    [password]
  );
  useEffect(() => {
    if (isPasswordValid) {
      setPasswordError("");
    } else {
      setPasswordError(
        "The password must consist of at least 8 characters and must contain numbers, Latin letters and special characters"
      );
    }
  }, [isPasswordValid, password]);

  const isUsernameValid = useMemo(
    () => validate(username, usernameRules),
    [username]
  );
  useEffect(() => {
    if (isUsernameValid) {
      setUsernameError("");
    } else {
      setUsernameError(
        "The username must contain from 2 to 16 characters, only Latin letters and numbers."
      );
    }
  }, [isUsernameValid, username]);

  const isRepeatPasswordValid = useMemo(
    () => !!password && password === repeatPassword,
    [repeatPassword, password]
  );
  useEffect(() => {
    if (isRepeatPasswordValid) {
      setRepeatPasswordError("");
    } else {
      setRepeatPasswordError("Passwords should be the same.");
    }
  }, [isRepeatPasswordValid, repeatPassword]);

  const isPassphraseValid = useMemo(
    () => validate(passPhrase, passphraseRules),
    [passPhrase]
  );
  useEffect(() => {
    if (isPassphraseValid) {
      setPassPhraseError("");
    } else {
      setPassPhraseError(
        "The passphrase must contain a minimum of 12 characters and maximum of 64, only numbers and numbers of any alphabet."
      );
    }
  }, [isPassphraseValid, passPhrase]);

  const onFileDownloadClick = (file: "key" | "recovery") => {
    if (response) {
      const blob = new Blob(
        [file === "key" ? response?.keyFile : response?.recoveryKey],
        { type: "text/plain" }
      );
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${response.fileName}_${file === "key" ? "" : "recovery"}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(url);
    }
  };

  const onRegisterClick = () => {
    setSubmitClicked(true);

    if (
      isPasswordValid &&
      isRepeatPasswordValid &&
      isUsernameValid &&
      isPasswordValid &&
      !isRequesting
    ) {
      setResponse(undefined);
      setIsRequesting(true);
      new ApiContext()
        .identity()
        .getService("register")
        .post({
          password: password,
          username: username,
          secretPhrase: passPhrase,
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
    password,
    setPassword,
    username,
    setUsername,
    onRegisterClick,
    setRepeatPassword,
    setPassPhrase,
    passPhraseError,
    usernameError,
    passwordError,
    submitClicked,
    repeatPassword,
    repeatPasswordError,
    isRequesting,
    onFileDownloadClick,
    response,
  };
};
