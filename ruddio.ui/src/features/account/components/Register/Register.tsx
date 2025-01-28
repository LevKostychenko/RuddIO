import {
  Box,
  Button,
  FormControl,
  FormLabel,
  TextField,
  Typography,
} from "@mui/material";
import styles from "./Register.module.scss";
import classnames from "classnames";
import { useAuthentication } from "../../hooks";

export const Register = () => {
  const {
    setPassword,
    setUsername,
    onRegisterClick,
    usernameError,
    passwordError,
    submitClicked,
    setPassPhrase,
    passPhraseError,
    setRepeatPassword,
    repeatPasswordError,
  } = useAuthentication();

  return (
    <div className={classnames(styles.registerContainer)}>
      <div className={classnames(styles.card)}>
        <div className={classnames(styles.header)}>
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Sign up
          </Typography>
        </div>
        <Box
          component="form"
          //   onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <FormControl>
            <FormLabel htmlFor="username">Username</FormLabel>
            <TextField
              autoComplete="username"
              name="username"
              required
              fullWidth
              id="username"
              placeholder="aboba2"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setUsername(event.target.value);
              }}
              error={!!usernameError && submitClicked}
              helperText={submitClicked ? usernameError : ""}
              color={!!usernameError && submitClicked ? "error" : "primary"}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="passphrase">Passphrase</FormLabel>
            <TextField
              autoComplete="Passphrase"
              name="passphrase"
              required
              fullWidth
              id="passphrase"
              placeholder="I love frogs"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPassPhrase(event.target.value);
              }}
              error={!!passPhraseError && submitClicked}
              helperText={submitClicked ? passPhraseError : ""}
              color={!!passPhraseError && submitClicked ? "error" : "primary"}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              required
              fullWidth
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="new-password"
              variant="outlined"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(event.target.value);
              }}
              error={!!passwordError && submitClicked}
              helperText={submitClicked ? passwordError : ""}
              color={!!passwordError && submitClicked ? "error" : "primary"}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="passwordRepeat">Repeat Password</FormLabel>
            <TextField
              required
              fullWidth
              name="passwordRepeat"
              placeholder="••••••"
              type="password"
              id="passwordRepeat"
              autoComplete="new-password"
              variant="outlined"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setRepeatPassword(event.target.value);
              }}
              error={!!repeatPasswordError && submitClicked}
              helperText={submitClicked ? repeatPasswordError : ""}
              color={
                !!repeatPasswordError && submitClicked ? "error" : "primary"
              }
            />
          </FormControl>
          <Button
            // type="submit"
            fullWidth
            variant="contained"
            onClick={onRegisterClick}
          >
            Sign up
          </Button>
        </Box>
      </div>
    </div>
  );
};
