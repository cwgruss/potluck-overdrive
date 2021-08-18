const core = require("@actions/core");
const github = require("@actions/github");
const { execSync } = require("child_process");

const heroku = {
  api_key: core.getInput("heroku_api_key"),
  email: core.getInput("heroku_email"),
  app_name: core.getInput("heroku_app_name"),
  branch: core.getInput("branch"),
  dockerHerokuProcessType: core.getInput("docker_heroku_process_type"),
  dockerBuildArgs: core.getInput("docker_build_args"),
  healthcheck: core.getInput("healthcheck"),
  checkstring: core.getInput("checkstring"),
  env_file: core.getInput("env_file"),
  appdir: core.getInput("appdirl"),
};

const createCatFile = ({ email, api_key }) => `cat >~/.netrc <<EOF
machine api.heroku.com
    login ${email}
    password ${api_key}
machine git.heroku.com
    login ${email}
    password ${api_key}
EOF`;

// Formatting
if (heroku.appdir) {
  heroku.appdir =
    heroku.appdir[0] === "." && heroku.appdir[1] === "/"
      ? heroku.appdir.slice(2)
      : heroku.appdir[0] === "/"
      ? heroku.appdir.slice(1)
      : heroku.appdir;
}

// Collate docker build args into arg list
if (heroku.dockerBuildArgs) {
  const args = heroku.dockerBuildArgs && heroku.dockerBuildArgs.split("\n");
  console.log("TEST_VAR", process.env["TEST_VAR"]);
  console.log(args);
  heroku.dockerBuildArgs = heroku.dockerBuildArgs
    .split("\n")
    .map((arg) => `${arg}="${process.env[arg]}"`)
    .join(",");

  heroku.dockerBuildArgs = heroku.dockerBuildArgs
    ? `--arg ${heroku.dockerBuildArgs}`
    : "";
}

const LOGIN_CMD = `heroku container:login`;
const CONTAINER_DEPLOY_CMD = `heroku container:push`;
const CONTAINER_RELEASE_CMD = `heroku container:release`;

const herokuLogin = ({ email, api_key }) => {
  execSync(createCatFile({ email, api_key }), { stdio: "inherit" });
  console.log("Created and wrote to ~/.netrc");

  console.log("1. Logging into Heroku ...");
  execSync(`${LOGIN_CMD}`, { stdio: "inherit" });
  console.log("Successfully logged into heroku");
};

const deployDockerImage = ({
  app_name,
  branch,
  dockerHerokuProcessType,
  dockerBuildArgs,
  appdir,
}) => {
  console.log("2. Building Docker Image ...");
  execSync(
    `${CONTAINER_DEPLOY_CMD} ${dockerHerokuProcessType} --app ${app_name} ${dockerBuildArgs}`,
    {
      stdio: "inherit",
      cwd: appdir || null,
    }
  );
};

const releaseDockerImage = ({ app_name, dockerHerokuProcessType, appdir }) => {
  console.log("3. Releasing Image to ", app_name);
  execSync(
    `${CONTAINER_RELEASE_CMD} ${dockerHerokuProcessType} --app=${app_name}`,
    {
      stdio: "inherit",
      cwd: appdir || null,
    }
  );
  console.log("Released.");
};

(async (heroku) => {
  try {
    herokuLogin({ ...heroku });
    deployDockerImage({ ...heroku });
    releaseDockerImage({ ...heroku });

    console.log("\nDone.\n");
    core.setOutput(
      "status",
      "Successfully deployed heroku app from branch " + heroku.branch
    );
  } catch (err) {
    console.error(`Error: Unable to deploy branch "${heroku.branch}": ${err}`);
    core.setFailed(
      "status",
      "Failed to deploy heroku app from branch " + heroku.branch
    );
  }
})(heroku);
