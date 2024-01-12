# setup-hcloud

[![CI](https://github.com/hetznercloud/setup-hcloud/actions/workflows/ci.yml/badge.svg)](https://github.com/hetznercloud/setup-hcloud/actions/workflows/ci.yml)

This action installs the [Hetzner Cloud CLI](https://github.com/hetznercloud/cli) in your `PATH`.

# Usage

The environment variable `HCLOUD_TOKEN` is required for hcloud to work properly. See the [hcloud getting started docs](https://github.com/hetznercloud/cli#getting-started) for details.

**Setup the latest version:**

```yaml
steps:
  - uses: hetznercloud/setup-hcloud@v1

  - run: hcloud server-type list
    env:
      HCLOUD_TOKEN: ${{ secrets.HCLOUD_TOKEN }}
```

**Setup a specific version:**

```yaml
steps:
  - uses: hetznercloud/setup-hcloud@v1
    with:
      version: v1.41.1

  - run: hcloud server-type list
    env:
      HCLOUD_TOKEN: ${{ secrets.HCLOUD_TOKEN }}
```

### Inputs

- `hcloud-version` (Optional): Version of Hetzner Cloud CLI to install. Using `latest` will install the
  [latest version of hcloud](https://github.com/hetznercloud/cli/releases/latest).
- `github-token` (Optional): A Personal Access Token or the Github Token to access the GitHub API. If
  none provided it will use the default Github Token.

### Outputs

- `hcloud-version`: Version of the Hetzner Cloud CLI that was installed.

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
