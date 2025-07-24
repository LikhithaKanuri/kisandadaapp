{ pkgs, ... }: {
  channel = "stable-24.05";

  packages = [
    pkgs.nodejs_20
    pkgs.yarn
    pkgs.watchman
  ];

  env = {
    EXPO_DEVTOOLS_LISTEN_ADDRESS = "0.0.0.0";
    REACT_NATIVE_PACKAGER_HOSTNAME = "0.0.0.0";
  };

  idx = {
    extensions = [ ];

    previews = {
      enable = true;
      previews = {
        expo = {
          # Start expo in tunnel mode to expose URL
          command = [ "npx" "expo" "start" "--tunnel" ];
          manager = "web";
        };
      };
    };

    workspace = {
      onCreate = {
        install = "npm install -g expo-cli && npm install";
      };
      onStart = {
        start = "npx expo start --tunnel";
      };
    };
  };
}