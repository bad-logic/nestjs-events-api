#!/bin/bash


usage() {
  cat << USAGE >&2
    Options:
        --help                      for help
        
    Commands:
        unit                  to run all unit tests
        e2e                   to run all e2e tests
USAGE
exit 1
}

runUnitTest(){
    docker exec -it nestjs-events-server npm run test
}

runE2ETest(){
    docker exec -it nestjs-events-server npm run test:e2e
}

if [ "$1" == "--help" ];
then
    usage
else
    if [ -n "$1" ];
    then
        case $1 in
        "unit")
            runUnitTest
            ;;
        "e2e")
            runE2ETest
            ;;
        *)
            echo "unknown command $1"
            usage
            ;;
        esac
    else
        usage
    fi
fi