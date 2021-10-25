#!/usr/bin/env bash

npm_cmd_on_all_packages() {
  for package in $(ls ./packages/); do
    echo "${package:?}"
    declare package_dir="./packages/${package:?}"
    if [[ -d ${package_dir:?} ]]; then
      cd "${package_dir:?}"
      npm "$@"
      cd -
    fi
  done
}
