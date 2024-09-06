## To install the host:

### Windows

Run `install_host.bat` script in the host directory.

This script installs the native messaging host for the current user, by creating a registry key
` HKEY_CURRENT_USER\SOFTWARE\Google\Chrome\NativeMessagingHosts\com.google.chrome.example.echo`
and setting its default value to the full path to `host\com.google.chrome.example.echo-win.json`.

If you want to install the native messaging host for all users, change HKCU to HKLM.

Note that you need to have Python installed.

### Mac and Linux

Run `install_host.sh` script in the host directory: `host/install_host.sh`

By default the host is installed only for the user who runs the script, but if
you run it with admin privileges (i.e. `sudo host/install_host.sh`), then the
host will be installed for all users. You can later use `host/uninstall_host.sh`
to uninstall the host.
