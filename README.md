# solarplanr

Make drawings for rooftop solar panel installations.

## file url usage

This uses a Worker thread. This breaks when opened with a file url due to the web browser
same-origin-policy. Run a local web server from the solarplanr root to get around this:

`python -m http.server 8034`

Then in the web browser:

`http://localhost:8034/`
