import {
  Box,
  Button,
  FormControl,
  FormLabel,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import styles from "./Login.module.scss";
import classnames from "classnames";
import { useLogin } from "../../hooks";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export const Login = () => {
  const {
    passwordError,
    keyError,
    setKey,
    setPassword,
    onLoginClick,
    submitClicked,
    isRequesting,
  } = useLogin();
  return (
    <div className={classnames(styles.loginContainer)}>
      <div className={classnames(styles.card)}>
        <div className={classnames(styles.header)}>
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Sign in
          </Typography>
        </div>
        <Box
          component="form"
          onSubmit={onLoginClick}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
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
            <Button
              component="label"
              role={undefined}
              variant="contained"
              startIcon={<CloudUploadIcon />}
            >
              Upload key
              <input
                required
                name="key"
                id="key"
                className={classnames(styles.visuallyHidden)}
                type="file"
                onChange={(event) => setKey(event.target?.files?.[0])}
                color={!!keyError && submitClicked ? "error" : "primary"}
              />
            </Button>
          </FormControl>
          <Button
            // type="submit"
            fullWidth
            variant="contained"
            onClick={onLoginClick}
            disabled={isRequesting}
          >
            Sign in
          </Button>
          {isRequesting && <LinearProgress />}
        </Box>
      </div>
    </div>
  );
};
