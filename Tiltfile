# Welcome to Tilt!
#   To get you started as quickly as possible, we have created a
#   starter Tiltfile for you.
#
#   Uncomment, modify, and delete any commands as needed for your
#   project's configuration.


# Output diagnostic messages
#   You can print log messages, warnings, and fatal errors, which will
#   appear in the (Tiltfile) resource in the web UI. Tiltfiles support
#   multiline strings and common string operations such as formatting.
#
#   More info: https://docs.tilt.dev/api.html#api.warn
print("""
-----------------------------------------------------------------
✨ Hello Tilt! This appears in the (Tiltfile) pane whenever Tilt
   evaluates this file.
-----------------------------------------------------------------
""".strip())

os.putenv('SERVER_PORT', '3002')
os.putenv('CLIENT_PORT', '3003')


# Build Docker image
#   Tilt will automatically associate image builds with the resource(s)
#   that reference them (e.g. via Kubernetes or Docker Compose YAML).
#
#   More info: https://docs.tilt.dev/api.html#api.docker_build
#
# docker_build('registry.example.com/my-image',
#              context='.',
#              # (Optional) Use a custom Dockerfile path
#              dockerfile='./deploy/app.dockerfile',
#              # (Optional) Filter the paths used in the build
#              only=['./app'],
#              # (Recommended) Updating a running container in-place
#              # https://docs.tilt.dev/live_update_reference.html
#              live_update=[
#                 # Sync files from host to container
#                 sync('./app', '/src/'),
#                 # Execute commands inside the container when certain
#                 # paths change
#                 run('/src/codegen.sh', trigger=['./app/api'])
#              ]
# )


# Apply Kubernetes manifests
#   Tilt will build & push any necessary images, re-deploying your
#   resources as they change.
#
#   More info: https://docs.tilt.dev/api.html#api.k8s_yaml
#
# k8s_yaml(['k8s/deployment.yaml', 'k8s/service.yaml'])


# Customize a Kubernetes resource
#   By default, Kubernetes resource names are automatically assigned
#   based on objects in the YAML manifests, e.g. Deployment name.
#
#   Tilt strives for sane defaults, so calling k8s_resource is
#   optional, and you only need to pass the arguments you want to
#   override.
#
#   More info: https://docs.tilt.dev/api.html#api.k8s_resource
#
# k8s_resource('my-deployment',
#              # map one or more local ports to ports on your Pod
#              port_forwards=['5000:8080'],
#              # change whether the resource is started by default
#              auto_init=False,
#              # control whether the resource automatically updates
#              trigger_mode=TRIGGER_MODE_MANUAL
# )


# Run local commands
#   Local commands can be helpful for one-time tasks like installing
#   project prerequisites. They can also manage long-lived processes
#   for non-containerized services or dependencies.
#
#   More info: https://docs.tilt.dev/local_resource.html
#
# local_resource('install-helm',
#                cmd='which helm > /dev/null || brew install helm',
#                # `cmd_bat`, when present, is used instead of `cmd` on Windows.
#                cmd_bat=[
#                    'powershell.exe',
#                    '-Noninteractive',
#                    '-Command',
#                    '& {if (!(Get-Command helm -ErrorAction SilentlyContinue)) {scoop install helm}}'
#                ]
# )

local_resource('server',
    labels=['demo-playwright-server'],
    dir='server',
    serve_dir='server',
    cmd='yarn && yarn build',
    serve_cmd='yarn dev',
    deps=['server'],
    ignore=['server/dist', 'server/.*'],
    links=['http://localhost:' + os.getenv('SERVER_PORT')],
)

local_resource('purge server',
    labels=['demo-playwright-server'],
    dir='server',
    cmd='yarn purge',
    trigger_mode=TRIGGER_MODE_MANUAL,
    auto_init=False,
)

local_resource('client',
    labels=['demo-playwright-client'],
    resource_deps=['server'],
    dir='client',
    serve_dir='client',
    cmd='yarn',
    serve_cmd='yarn dev',
    links=['http://localhost:' + os.getenv('CLIENT_PORT')],
)

local_resource('e2e',
    labels=['demo-playwright-e2e'],
    dir='e2e',
    cmd='yarn playwright test',
    auto_init=(config.tilt_subcommand == 'ci'),
    allow_parallel=True,
    trigger_mode=TRIGGER_MODE_MANUAL,
    resource_deps=['server', 'client'],
)

load('ext://uibutton', 'cmd_button')
cmd_button('e2e:1-ui',
    argv=['yarn', 'test:e2e:ui'],
    resource='e2e',
    icon_name='preview',
    text='Playwright UI',
)

cmd_button('e2e:2-codegen',
    argv=['yarn', 'test:e2e:codegen', 'http://localhost:' + os.getenv('CLIENT_PORT')],
    resource='e2e',
    icon_name='code',
    text='Playwright Codegen',
)

# Extensions are open-source, pre-packaged functions that extend Tilt
#
#   More info: https://github.com/tilt-dev/tilt-extensions
#
# load('ext://git_resource', 'git_checkout')


# Edit your Tiltfile without restarting Tilt
#   While running `tilt up`, Tilt watches the Tiltfile on disk and
#   automatically re-evaluates it on change.
#
#   To see it in action, try uncommenting the following line with
#   Tilt running.
# tilt_demo()
