#!/bin/bash


usage() {
  cat << USAGE >&2
    Options:
        --help                      for help
        
    Commands:
        migration:generate <filename>   generate migrations
        rollback                        revert last migration
        test:unit                       to run all unit tests
        test:e2e                        to run all e2e tests
USAGE
exit 1
}

runUnitTest(){
    docker exec -it nestjs-events-server npm run test
}

runE2ETest(){
    docker exec -it nestjs-events-server npm run test:e2e
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
        "test:unit")
            runUnitTest
            ;;
        "test:e2e")
            runE2ETest
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