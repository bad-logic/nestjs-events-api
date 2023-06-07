#!/bin/bash


usage() {
  cat << USAGE >&2
    Options:
        --help                      for help
        
    Commands:
        start                           start the application
        migration:generate <filename>   generate migrations
        rollback                        revert last migration
        test:unit                       to run all unit tests
        test:e2e                        to run all e2e tests
        test:cov                             generate test coverage
USAGE
exit 1
}

start(){
    docker-compose up --build
}

runUnitTest(){
    docker exec -it nestjs-events-server npm run test
}

runE2ETest(){
    docker exec -it nestjs-events-server npm run test:e2e
}

generateTestCoverage(){
    docker exec -it nestjs-events-server npm run test:cov
}

generate(){
    if [ -n "$1" ];
    then
        echo "generating migration file ..."
        docker exec -it nestjs-events-server npm run create:migration ./src/db/migrations/$1
    else
        echo "invalid filename $1"
    fi
}

migrate(){
    docker exec -it nestjs-events-server npm run migrate
}

rollback(){
    docker exec -it nestjs-events-server npm run rollback
}

if [ "$1" == "--help" ];
then
    usage
else
    if [ -n "$1" ];
    then
        case $1 in
        "start")
            start
            ;;
        "test:unit")
            runUnitTest
            ;;
        "test:e2e")
            runE2ETest
            ;;
        "test:cov")
            generateTestCoverage
            ;;
        "migration:generate")
            generate $2
            ;;
        "migrate")
            migrate
            ;;
        "rollback")
            rollback
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